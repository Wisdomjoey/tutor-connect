"use client";

import { Fragment, useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { VideoRoom } from "@/components/video-room";
import { Chat } from "@/components/chat";
import { MaterialsList } from "@/components/materials-list";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Spinner from "@/components/widgets/Spinner";
import { fetchClass } from "@/actions/class";
import { useSession } from "next-auth/react";
import { Class, Enrollment } from "@prisma/client";

type ClassType = Class & {
  tutor: {
    id: string;
    phone: string;
    fullname: string;
  };
  enrollments: Enrollment[];
};

export default function ClassPage() {
  const params = useParams();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [classDetails, setClassDetails] = useState<ClassType>();

  const fetchClassDetails = useCallback(async (id: string) => {
    setError(undefined);

    const { message, success, data } = await fetchClass(id);

    if (!success) setError(message);
    if (data) setClassDetails(data);
    if (data?.enrollments.some((val) => val.id === session?.user.id))
      setIsEnrolled(true);

    setLoading(false);
  }, [session?.user.id]);

  useEffect(() => {
    if (params.id && typeof params.id === "string")
      fetchClassDetails(params.id);
  }, [fetchClassDetails, params.id]);

  if (!params.id || typeof params.id !== "string")
    return <div className="py-16 text-center">Class not found</div>;

  return (
    <div className="container mx-auto py-8">
      {loading ? (
        <div className="py-10">
          <Spinner borderColor="border-primary" />
        </div>
      ) : error ? (
        <div className="py-10 text-center">{error}</div>
      ) : !classDetails ? (
        <div className="py-10 text-center">Class not found</div>
      ) : (
        <Fragment>
          <Card className="p-6 mb-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-2xl font-bold mb-2">
                  {classDetails.title}
                </h1>

                <p className="text-muted-foreground mb-2">
                  by {classDetails.tutor.fullname}
                </p>

                <p className="text-sm text-muted-foreground">
                  {format(new Date(classDetails.date), "PPP p")} -{" "}
                  {classDetails.duration} Hrs
                </p>
              </div>

              {!isEnrolled && (
                <Button onClick={() => {}}>Enroll in Class</Button>
              )}
            </div>

            <p className="text-gray-600">{classDetails.description}</p>
          </Card>

          {isEnrolled && (
            <Tabs defaultValue="video" className="space-y-4">
              <TabsList>
                <TabsTrigger value="video">Video Room</TabsTrigger>
                <TabsTrigger value="chat">Chat</TabsTrigger>
                <TabsTrigger value="materials">Materials</TabsTrigger>
              </TabsList>

              <TabsContent value="video" className="space-y-4">
                <VideoRoom classId={params.id as string} />
              </TabsContent>

              <TabsContent value="chat" className="space-y-4">
                <Chat classId={params.id as string} />
              </TabsContent>

              <TabsContent value="materials" className="space-y-4">
                <MaterialsList classId={params.id as string} />
              </TabsContent>
            </Tabs>
          )}
        </Fragment>
      )}
    </div>
  );
}
