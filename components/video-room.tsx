"use client";

import { useToast } from "@/hooks/use-toast";
import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import "@livekit/components-styles";

interface VideoRoomProps {
  token: string;
  classId: string;
}

export function VideoRoom({ token, classId }: VideoRoomProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [connected, setConnected] = useState(false);

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
        console.log("Connected");
      }}
      onError={(err) => {
        console.log(err);
        toast({ description: err.message, variant: "destructive" });
      }}
      onDisconnected={() => {
        setConnected(false);
        console.log("Disconnected");

        router.replace(`/classes/${classId}`);
      }}
    >
      <VideoConference />

      {/* <ControlBar /> */}
    </LiveKitRoom>
  );
}
