"use client";

import {
  LiveKitRoom,
  VideoConference,
  ControlBar,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { useState } from "react";

interface VideoRoomProps {
  token: string;
}

export function VideoRoom({ token }: VideoRoomProps) {
  const [connected, setConnected] = useState(false);

  return (
    <LiveKitRoom
      video={true}
      audio={true}
      token={token}
      connect={true}
      // className="fixed inset-0 z-50"
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      onConnected={() => {
        setConnected(true);
        console.log("Connected");
      }}
      onDisconnected={() => {
        setConnected(false);
        console.log('Disconnected')
      }}
    >
      <VideoConference />

      {/* <ControlBar /> */}
    </LiveKitRoom>
  );
}
