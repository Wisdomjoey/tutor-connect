"use client";

import {
  Fragment,
  useCallback,
  useEffect,
  useState,
  useTransition,
} from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { VideoRoom } from "@/components/video-room";
import { Chat } from "@/components/chat";
import { MaterialsList } from "@/components/materials-list";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Spinner from "@/components/widgets/Spinner";
import {
  connectToClass,
  enrollInClass,
  fetchClass,
  generateInvitation,
} from "@/actions/class";
import { useSession } from "next-auth/react";
import { Class, Enrollment } from "@prisma/client";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Copy, Link } from "lucide-react";

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
  const { toast } = useToast();
  const query = useSearchParams();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  const [roomToken, setRoomToken] = useState<string>();
  const [invite, setInvite] = useState<string>();
  const [isPending, transition] = useTransition();
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [classDetails, setClassDetails] = useState<ClassType>();

  const classId = params.id;
  const token = query.get("token");
  const now = new Date();
  const message = classDetails
    ? new Date(classDetails.date) > now
      ? "This Class Has Not Yet Commenced"
      : new Date(classDetails.end) < now
      ? "This Class Has Ended"
      : undefined
    : undefined;

  const fetchClassDetails = useCallback(
    async (id: string) => {
      setError(undefined);

      const { message, success, data } = await fetchClass(id);

      if (!success) setError(message);
      if (data) setClassDetails(data);
      if (
        session?.user.id === data?.tutorId ||
        data?.enrollments.some((val) => val.id === session?.user.id)
      )
        setIsEnrolled(true);

      setLoading(false);
    },
    [session?.user.id]
  );

  const handleInvite = () => {
    if (!classDetails?.id) return;

    setInvite(undefined);

    transition(async () => {
      const { message, success, data } = await generateInvitation(
        classDetails.id
      );

      if (data) setInvite(data);

      toast({
        description: message,
        variant: success ? "default" : "destructive",
      });
    });
  };

  const handleClassEnroll = () => {
    if (!token || !classDetails?.id)
      return toast({
        description: "Invalid Invitation",
        variant: "destructive",
      });

    transition(async () => {
      const { message, success, data } = await enrollInClass(
        classDetails.id,
        token
      );

      if (data) setClassDetails(data);

      toast({
        description: message,
        variant: success ? "default" : "destructive",
      });
    });
  };

  const handleClassJoin = () => {
    if (!classId && typeof classId !== "string") return;

    transition(async () => {
      const { message, success, data } = await connectToClass(
        classId.toString()
      );

      if (data) setRoomToken(data);
      if (!success) toast({ description: message, variant: "destructive" });
    });
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);

      toast({ description: "Copied" });
    } catch (error) {
      console.log(error);

      toast({ description: "Failed to copy", variant: "destructive" });
    }
  };

  useEffect(() => {
    if (classId && typeof classId === "string" && session) fetchClassDetails(classId);
  }, [fetchClassDetails, classId, session]);

  if (!classId || typeof classId !== "string")
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
          <Card className="p-6 mb-6 space-y-5">
            <div>
              <div className="flex items-center gap-3 justify-between">
                <h1 className="text-2xl font-bold mb-2">
                  {classDetails.title}
                </h1>

                {session?.user.id === classDetails?.tutorId && (
                  <Button
                    size={"sm"}
                    title="Copy Class Link"
                    onClick={() =>
                      handleCopy(
                        `${process.env.NEXT_PUBLIC_BASE_URL}/${params.id}`
                      )
                    }
                  >
                    <Link size={14} className="stroke-primary-foreground" />
                  </Button>
                )}

                {!isEnrolled && token && (
                  <Button disabled={isPending} onClick={handleClassEnroll}>
                    {isPending ? (
                      <Spinner width="w-6" className="size-fit" />
                    ) : (
                      "Enroll in Class"
                    )}
                  </Button>
                )}
              </div>

              <p className="text-muted-foreground mb-2">
                by {classDetails.tutor.fullname}
              </p>

              <p className="text-sm text-muted-foreground">
                {format(new Date(classDetails.date), "PPP p")} -{" "}
                {classDetails.duration} Hrs
              </p>
            </div>

            <p className="text-gray-600">{classDetails.description}</p>

            {session?.user.id === classDetails?.tutorId && (
              <div className="flex items-center flex-wrap gap-3">
                <Button disabled={isPending} onClick={handleInvite}>
                  {isPending ? (
                    <Spinner width="w-6" className="size-fit" />
                  ) : (
                    "Generate Invite Key"
                  )}
                </Button>

                <div className="flex-1 flex gap-3 items-center relative">
                  <Input
                    disabled
                    value={invite ?? ""}
                    className="disabled:opacity-90"
                  />

                  <Button
                    size={"sm"}
                    disabled={!invite}
                    title="Copy Invite"
                    onClick={invite ? () => handleCopy(invite) : undefined}
                  >
                    <Copy size={14} className="stroke-primary-foreground" />
                  </Button>
                </div>
              </div>
            )}
          </Card>

          {isEnrolled && (
            <Tabs defaultValue="video" className="space-y-4">
              <TabsList>
                <TabsTrigger value="video">Video Room</TabsTrigger>
                <TabsTrigger value="chat">Chat</TabsTrigger>
                <TabsTrigger value="materials">Materials</TabsTrigger>
              </TabsList>

              <TabsContent value="video" className="space-y-4">
                {message ? (
                  <div className="py-10 text-center">{message}</div>
                ) : roomToken ? (
                  <VideoRoom token={roomToken} />
                ) : (
                  <div className="py-10 flex items-center justify-center">
                    <Button disabled={isPending} onClick={handleClassJoin}>
                      {isPending ? (
                        <Spinner width="w-6" className="size-fit" />
                      ) : (
                        "Connect To Class"
                      )}
                    </Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="chat" className="space-y-4">
                {message ? (
                  <div className="py-10 text-center">{message}</div>
                ) : (
                  <Chat classId={params.id as string} />
                )}
              </TabsContent>

              <TabsContent value="materials" className="space-y-4">
                {message ? (
                  <div className="py-10 text-center">{message}</div>
                ) : (
                  <MaterialsList classId={params.id as string} />
                )}
              </TabsContent>
            </Tabs>
          )}
        </Fragment>
      )}
    </div>
  );
}
