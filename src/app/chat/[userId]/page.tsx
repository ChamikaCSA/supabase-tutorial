"use client";

import { useEffect, useState, use } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { UserAvatar } from "@/components/users/user-avatar";
import { useRouter } from "next/navigation";
import { NavigationButton } from "@/components/navigation-button";

interface Message {
  id: string;
  sender_id: string;
  content: string;
  created_at: string;
}

export default function ChatPage({ params }: { params: Promise<{ userId: string }> }) {
  const resolvedParams = use(params);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [otherUser, setOtherUser] = useState<any>(null);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const fetchUserAndMessages = async () => {
      const { data: { user } } = await supabase.auth.getUser();
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
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${resolvedParams.userId}),and(sender_id.eq.${resolvedParams.userId},receiver_id.eq.${user.id})`)
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

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from("messages").insert({
      sender_id: user.id,
      receiver_id: resolvedParams.userId,
      content: newMessage.trim(),
    });

    if (!error) {
      setNewMessage("");
    }
  };

  if (!otherUser) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full max-w-4xl p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <NavigationButton href="/users">
            Back to Users
          </NavigationButton>
          <div className="flex items-center gap-2">
            <UserAvatar
              avatarUrl={otherUser.avatar_url}
              fullName={otherUser.full_name}
              username={otherUser.username}
            />
            <span className="text-xl font-semibold">
              Chat with {otherUser.full_name}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col h-[calc(100vh-200px)] border rounded-lg">
        <div className="flex-1 overflow-y-auto space-y-4 p-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender_id === resolvedParams.userId ? "justify-start" : "justify-end"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.sender_id === resolvedParams.userId
                    ? "bg-muted"
                    : "bg-primary text-primary-foreground"
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-2 p-4 border-t">
          <Textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
          />
          <Button onClick={sendMessage}>Send</Button>
        </div>
      </div>
    </div>
  );
}