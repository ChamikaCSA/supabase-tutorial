"use client";

import { useEffect, useState, use, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import { UserAvatar } from "@/components/users/user-avatar";
import { useRouter } from "next/navigation";
import { Message } from "@/types";
import { ChatMessage } from "@/components/chat/chat-message";
import { ChatInput } from "@/components/chat/chat-input";
import { ArrowLeft, Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ChatPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const resolvedParams = use(params);
  const [messages, setMessages] = useState<Message[]>([]);
  const [otherUser, setOtherUser] = useState<any>(null);
  const supabase = createClient();
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      const viewport = scrollRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      if (viewport) {
        setTimeout(() => {
          viewport.scrollTop = viewport.scrollHeight;
        }, 100);
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const fetchUserAndMessages = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      const { data: userData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", resolvedParams.userId)
        .single();

      if (userData) {
        setOtherUser(userData);
      }

      const { data } = await supabase
        .from("messages")
        .select("*")
        .or(
          `and(sender_id.eq.${user.id},receiver_id.eq.${resolvedParams.userId}),and(sender_id.eq.${resolvedParams.userId},receiver_id.eq.${user.id})`
        )
        .order("created_at", { ascending: true });

      if (data) setMessages(data);

      const channel = supabase
        .channel("messages")
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "messages",
            filter: `sender_id=eq.${user.id}`,
          },
          (payload) => {
            setMessages((current) => [...current, payload.new as Message]);
          }
        )
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "messages",
            filter: `receiver_id=eq.${user.id}`,
          },
          (payload) => {
            setMessages((current) => [...current, payload.new as Message]);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    };

    fetchUserAndMessages();
  }, [resolvedParams.userId, router, supabase]);

  const sendMessage = async (content: string) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from("messages").insert({
      sender_id: user.id,
      receiver_id: resolvedParams.userId,
      content,
    });

    if (error) {
      throw error;
    }
  };

  if (!otherUser) {
    return (
      <div className="w-full max-w-4xl p-8">
        <Card>
          <CardContent className="p-8 text-center">
            <div className="flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl p-4 sm:p-8 space-y-4">
      <Card className="h-[calc(100vh-120px)] flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between pb-4 shrink-0">
          <div className="flex items-center gap-4">
            <Link href="/users">
              <Button variant="ghost" size="icon">
                <ArrowLeft />
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <UserAvatar
                avatarUrl={otherUser.avatar_url}
                fullName={otherUser.full_name}
                username={otherUser.username}
              />
              <CardTitle className="text-xl font-semibold">
                {otherUser.full_name}
              </CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden">
          <ScrollArea className="h-full" ref={scrollRef}>
            <div className="p-4">
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  message={message}
                  isOwnMessage={message.sender_id !== resolvedParams.userId}
                />
              ))}
            </div>
          </ScrollArea>
        </CardContent>
        <CardFooter className="shrink-0 pt-4">
          <ChatInput onSend={sendMessage} />
        </CardFooter>
      </Card>
    </div>
  );
}
