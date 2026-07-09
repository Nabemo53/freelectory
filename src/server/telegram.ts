type TelegramMessage = {
  chat_id: string | number;
  text: string;
  parse_mode?: "HTML" | "MarkdownV2";
  reply_markup?: unknown;
};

export function hasTelegramToken() {
  return Boolean(process.env.TELEGRAM_BOT_TOKEN);
}

export async function telegramApi<T>(method: string, payload: unknown): Promise<T> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    throw new Error("TELEGRAM_BOT_TOKEN is not configured");
  }

  const response = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Telegram API error ${response.status}: ${errorText}`);
  }

  return response.json() as Promise<T>;
}

export function sendTelegramMessage(message: TelegramMessage) {
  return telegramApi("sendMessage", message);
}
