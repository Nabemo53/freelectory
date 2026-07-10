"use client";

import { useState } from "react";
import { Bot, CheckCircle2, ExternalLink, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type Verification = {
  code: string;
  status: "pending" | "awaiting_contact" | "verified" | "expired";
  phone: string;
};

export function TelegramPhoneCard() {
  const [phone, setPhone] = useState("");
  const [botUrl, setBotUrl] = useState("");
  const [verification, setVerification] = useState<Verification | null>(null);
  const [statusText, setStatusText] = useState("");
  const [loading, setLoading] = useState(false);

  const start = async () => {
    setLoading(true);
    setStatusText("");
    try {
      const response = await fetch("/api/telegram/phone/start", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Telegram verification failed");
      setBotUrl(data.botUrl);
      setVerification(data.verification);
      setStatusText("Ссылка создана. Откройте бота и нажмите кнопку отправки контакта.");
    } catch (error) {
      setStatusText(error instanceof Error ? error.message : "Telegram verification failed");
    } finally {
      setLoading(false);
    }
  };

  const check = async () => {
    if (!verification?.code) return;
    const response = await fetch(`/api/telegram/phone/status?code=${verification.code}`);
    const data = await response.json();
    if (response.ok) {
      setVerification(data.verification);
      setStatusText(data.verification.status === "verified" ? "Телефон подтверждён через Telegram." : `Статус: ${data.verification.status}`);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          Telegram-подтверждение телефона
        </CardTitle>
        <CardDescription>Это не SMS и не звонок. Подтверждение идёт через вашего Telegram-бота: пользователь открывает ссылку и делится контактом.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input placeholder="+7 999 123-45-67" value={phone} onChange={(event) => setPhone(event.target.value)} />
          <Button onClick={start} disabled={loading || !phone}>
            <Phone className="h-4 w-4" />
            {loading ? "..." : "Начать"}
          </Button>
        </div>
        {botUrl && (
          <div className="rounded-lg border bg-muted/30 p-3">
            <a className="inline-flex items-center gap-2 text-sm font-semibold text-primary" href={botUrl} target="_blank" rel="noreferrer">
              Открыть Telegram-бота <ExternalLink className="h-4 w-4" />
            </a>
            <div className="mt-3 flex gap-2">
              <Button size="sm" variant="outline" onClick={check}>Проверить статус</Button>
              {verification?.status === "verified" && (
                <span className="inline-flex items-center gap-1 text-sm font-medium text-success">
                  <CheckCircle2 className="h-4 w-4" />
                  Подтверждено
                </span>
              )}
            </div>
          </div>
        )}
        {statusText && <p className="text-sm text-muted-foreground">{statusText}</p>}
      </CardContent>
    </Card>
  );
}
