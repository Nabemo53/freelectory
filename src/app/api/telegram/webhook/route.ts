import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, listApplications, listJobs, markPhoneAwaitingContact, verifyPhoneByTelegramContact } from "@/server/backend";
import { sendTelegramMessage } from "@/server/telegram";

type TelegramUpdate = {
  message?: {
    chat: { id: number };
    text?: string;
    contact?: {
      phone_number: string;
      user_id?: number;
    };
    from?: { id: number; username?: string; first_name?: string };
  };
};

function contactKeyboard() {
  return {
    keyboard: [[{ text: "Поделиться номером телефона", request_contact: true }]],
    resize_keyboard: true,
    one_time_keyboard: true,
  };
}

async function handleStartPayload(chatId: number, telegramUserId: number | undefined, payload: string) {
  if (payload.startsWith("phone_")) {
    const verification = await markPhoneAwaitingContact(payload, chatId, telegramUserId);

    if (!verification) {
      await sendTelegramMessage({
        chat_id: chatId,
        text: "Ссылка подтверждения телефона устарела. Вернитесь на сайт Freelectory и начните проверку ещё раз.",
      });
      return { ok: true, handled: "expired_phone_verification" };
    }

    await sendTelegramMessage({
      chat_id: chatId,
      text: "Freelectory подтверждает номер через Telegram. Нажмите кнопку ниже и отправьте свой контакт. SMS и звонок не нужны.",
      reply_markup: contactKeyboard(),
    });
    return { ok: true, handled: "phone_verification_started" };
  }

  await sendTelegramMessage({
    chat_id: chatId,
    text: "Привет! Это Freelectory. Команды: /feed, /tokens, /crm. Для подтверждения телефона начните проверку на сайте и откройте персональную ссылку бота.",
  });
  return { ok: true, handled: "start" };
}

async function buildBotText(text: string | undefined) {
  const normalized = (text ?? "").trim().toLowerCase();

  if (normalized === "/start") {
    return [
      "Привет! Это Freelectory.",
      "Команды: /feed, /tokens, /crm.",
      "Подтверждение телефона запускается на сайте в настройках, затем бот попросит поделиться контактом.",
    ].join("\n");
  }

  if (normalized === "/feed") {
    const job = (await listJobs({}))[0];
    if (!job) return "Пока нет подходящих карточек.";
    return `${job.title}\n${job.company} · ${job.salary}\nMatch: ${job.matchScore}%\nТеги: ${job.tags.join(", ")}`;
  }

  if (normalized === "/tokens") {
    const user = await getCurrentUser();
    return `Токены: ${user?.tokens ?? 0} / ${user?.maxTokens ?? 20}\n+5 за подтверждение телефона через Telegram.`;
  }

  if (normalized === "/crm") {
    const applications = await listApplications();
    if (!applications.length) return "В CRM пока нет откликов.";
    return applications.slice(0, 5).map((application) => `${application.job?.title ?? application.jobId}: ${application.status}`).join("\n");
  }

  return "Команда не распознана. Используйте /feed, /tokens или /crm.";
}

export async function POST(request: NextRequest) {
  const update = (await request.json().catch(() => ({}))) as TelegramUpdate;
  const message = update.message;
  const chatId = message?.chat.id;

  if (!chatId) return NextResponse.json({ ok: true, ignored: true });

  if (message.contact) {
    if (message.contact.user_id && message.from?.id && message.contact.user_id !== message.from.id) {
      await sendTelegramMessage({
        chat_id: chatId,
        text: "Для подтверждения нужен ваш собственный Telegram-контакт, не номер из адресной книги.",
      });
      return NextResponse.json({ ok: true, handled: "foreign_contact_rejected" });
    }

    const result = await verifyPhoneByTelegramContact(chatId, message.contact.user_id ?? message.from?.id, message.contact.phone_number);

    if (!result) {
      await sendTelegramMessage({
        chat_id: chatId,
        text: "Не нашёл активную проверку телефона. Вернитесь на сайт Freelectory и начните подтверждение ещё раз.",
      });
      return NextResponse.json({ ok: true, handled: "contact_without_verification" });
    }

    await sendTelegramMessage({
      chat_id: chatId,
      text: "Готово! Телефон подтверждён через Telegram. Бонусные токены начислены.",
      reply_markup: { remove_keyboard: true },
    });
    return NextResponse.json({ ok: true, handled: "phone_verified" });
  }

  const text = message.text ?? "";
  const startMatch = text.match(/^\/start\s+(.+)$/);
  if (startMatch) {
    const result = await handleStartPayload(chatId, message.from?.id, startMatch[1]);
    return NextResponse.json(result);
  }

  await sendTelegramMessage({ chat_id: chatId, text: await buildBotText(text) });
  return NextResponse.json({ ok: true });
}

export function GET() {
  return NextResponse.json({
    ok: true,
    endpoint: "/api/telegram/webhook",
    commands: ["/start", "/feed", "/tokens", "/crm"],
    phoneVerification: "POST /api/telegram/phone/start, then open botUrl and share Telegram contact",
  });
}
