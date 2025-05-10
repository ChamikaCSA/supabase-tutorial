"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ChatInputProps } from "@/types";
import { Loader2, Send } from "lucide-react";
import { Card } from "@/components/ui/card";

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = async () => {
    if (!message.trim() || sending) return;

    try {
      setSending(true);
      await onSend(message.trim());
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex gap-2 items-end w-full">
      <Textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
        className="flex-1 resize-none min-h-[40px] max-h-[120px] py-2 focus-visible:ring-primary"
        disabled={disabled || sending}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
          }
        }}
      />
      <Button
        onClick={handleSubmit}
        disabled={disabled || sending || !message.trim()}
        size="icon"
        className="h-[40px] w-[40px] shrink-0"
        variant={message.trim() ? "default" : "secondary"}
      >
        {sending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}
