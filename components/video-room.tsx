"use client";

import { useToast } from "@/hooks/use-toast";
import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import { useRouter } from "next/navigation";

import "@livekit/components-styles";
import { useEffect, useState } from "react";

interface VideoRoomProps {
  token: string;
  classId: string;
}

export function VideoRoom({ token, classId }: VideoRoomProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (connected) {
      const script = document.createElement("script");

      script.src = "/lk-script.js";
      script.defer = true;

      document.head.appendChild(script);

      return () => {
        document.head.removeChild(script);
      };
    }
  }, [connected]);

  return (
    <LiveKitRoom
      video={true}
      audio={true}
      token={token}
      connect={true}
      className="h-[100dvh]"
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      onConnected={() => {
        setConnected(true);

        toast({ description: "Connected" });
      }}
      onError={(err) => console.log(err)}
      onDisconnected={() => {
        setConnected(false);

        toast({ description: "Diconnected", variant: "destructive" });

        router.replace(`/classes/${classId}`);
      }}
    >
      <VideoConference />

      {/* <ControlBar /> */}
    </LiveKitRoom>
  );
}
