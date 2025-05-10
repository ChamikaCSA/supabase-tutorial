export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
}

export interface ChatMessageProps {
  message: Message;
  isOwnMessage: boolean;
}

export interface ChatInputProps {
  onSend: (message: string) => Promise<void>;
  disabled?: boolean;
}

export type PresenceStatus = "online" | "offline" | "away";

export interface PresenceIndicatorProps {
  userId: string;
  className?: string;
}

export interface PresencePayload {
  status: PresenceStatus;
}
