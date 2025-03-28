"use client";

import { connectToClass } from "@/actions/class";
import { VideoRoom } from "@/components/video-room";
import Spinner from "@/components/widgets/Spinner";
import { useToast } from "@/hooks/use-toast";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function ConnectPage() {
  const query = useSearchParams();

  const token = query.get("token");
  const classId = query.get("class");

  if (!token || !classId)
    return (
      <div className="h-screen flex items-center justify-center">
        <p>Invalid Configurations</p>
      </div>
    );

  return <VideoRoom classId={classId} token={token} />;
}
