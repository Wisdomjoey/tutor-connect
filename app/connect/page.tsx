"use client";

import { VideoRoom } from "@/components/video-room";
import Spinner from "@/components/widgets/Spinner";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

export default function ConnectPage() {
  return (
    <div className="h-screen overflow-hidden">
      <Suspense fallback={<Spinner />}>
        <Page />
      </Suspense>
    </div>
  );
}

function Page() {
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
