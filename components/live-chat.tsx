"use client";

import { useEffect, useState } from "react";
import { DataPacket_Kind, Room, RoomEvent } from "livekit-client";
import { formatDistance } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  content: string;
  createdAt: string;
  user: {
    name: string;
  };
}

interface LiveChatProps {
  roomName: string;
  initialMessages: Message[];
}

export function LiveChat({ roomName, initialMessages }: LiveChatProps) {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const [room, setRoom] = useState<Room | null>(null);
  const [isConnecting, setIsConnecting] = useState(true);

  useEffect(() => {
    let mounted = true;

    const connectToRoom = async () => {
      try {
        const response = await fetch("/api/livekit/token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ roomName }),
        });

        if (!response.ok) throw new Error("Failed to get token");
        const { token } = await response.json();

        const room = new Room({
          adaptiveStream: true,
          dynacast: true,
        });

        await room.connect(process.env.NEXT_PUBLIC_LIVEKIT_URL!, token);
        
        if (mounted) {
          setRoom(room);
          setIsConnecting(false);
        }

        room.on(RoomEvent.DataReceived, (payload) => {
          const data = JSON.parse(new TextDecoder().decode(payload));
          if (data.type === "chat") {
            setMessages((prev) => [...prev, data.message]);
          }
        });
      } catch (error) {
        console.error("Failed to connect to LiveKit room:", error);
        toast({
          title: "Connection Error",
          description: "Failed to connect to chat room",
          variant: "destructive",
        });
      }
    };

    connectToRoom();

    return () => {
      mounted = false;
      if (room) {
        room.disconnect();
      }
    };
  }, [roomName]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !room) return;

    try {
      const message = {
        id: crypto.randomUUID(),
        content: newMessage.trim(),
        createdAt: new Date().toISOString(),
        user: {
          name: room.localParticipant.name || "Anonymous",
        },
      };

      const data = {
        type: "chat",
        message,
      };

      await room.localParticipant.publishData(
        new TextEncoder().encode(JSON.stringify(data)),
        { reliable: true, }
      );

      setMessages((prev) => [...prev, message]);
      setNewMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    }
  };

  if (isConnecting) {
    return <div>Connecting to chat...</div>;
  }

  return (
    <div className="flex flex-col h-[600px]">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-medium">{message.user.name}</span>
                <span className="text-xs text-muted-foreground">
                  {formatDistance(new Date(message.createdAt), new Date(), { addSuffix: true })}
                </span>
              </div>
              <p className="text-sm mt-1">{message.content}</p>
            </div>
          ))}
        </div>
      </ScrollArea>

      <form onSubmit={sendMessage} className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
          />
          <Button type="submit">Send</Button>
        </div>
      </form>
    </div>
  );
}