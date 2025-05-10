"use client";

import { ChatMessageProps } from "@/types";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";

export function ChatMessage({ message, isOwnMessage }: ChatMessageProps) {
  return (
    <div
      className={cn(
        "flex mb-4",
        isOwnMessage ? "justify-end" : "justify-start"
      )}
    >
      <Card
        className={cn(
          "px-4 py-2.5 max-w-[80%] relative shadow-sm",
          isOwnMessage
            ? "bg-primary text-primary-foreground"
            : "bg-card"
        )}
      >
        <p className="text-sm pr-12 break-words">{message.content}</p>
        <span
          className={cn(
            "text-xs absolute bottom-2 right-3",
            isOwnMessage
              ? "text-primary-foreground/70"
              : "text-muted-foreground"
          )}
        >
          {format(new Date(message.created_at), "HH:mm")}
        </span>
      </Card>
    </div>
  );
}
