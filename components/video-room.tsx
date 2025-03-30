"use client";

import { useToast } from "@/hooks/use-toast";
import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import { useRouter } from "next/navigation";

import "@livekit/components-styles";

interface VideoRoomProps {
  token: string;
  classId: string;
}

export function VideoRoom({ token, classId }: VideoRoomProps) {
  const router = useRouter();
  const { toast } = useToast();

  return (
    <LiveKitRoom
      video={true}
      audio={true}
      token={token}
      connect={true}
      className="h-[100dvh]"
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      onConnected={() => {
        console.log("Connected");

        toast({ description: 'Connected' });
      }}
      onError={(err) => console.log(err)}
      onDisconnected={() => {
        toast({ description: 'Diconnected', variant: "destructive" });

        router.replace(`/classes/${classId}`);
      }}
    >
      <VideoConference />

      {/* <ControlBar /> */}
    </LiveKitRoom>
  );
}
