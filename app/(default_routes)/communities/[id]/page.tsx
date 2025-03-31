"use client";

import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { Fragment, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  FileText,
  Upload,
  Users,
  Code,
  BookOpen,
  Microscope,
  Calculator,
  Briefcase,
  Check,
  X,
} from "lucide-react";
import { LiveChat } from "@/components/live-chat";
import {
  Community,
  CommunityFile,
  CommunityMember,
  CommunityMessage,
  STATUS,
  User,
} from "@prisma/client";
import { fetchCommunity, handleJoinRequest } from "@/actions/community";
import Spinner from "@/components/widgets/Spinner";

type CommunityType = Community & {
  admin: User;
  files: (CommunityFile & { user: { fullname: string } })[];
  members: (CommunityMember & { user: { email: string; fullname: string } })[];
  messages: CommunityMessage[];
};

const departmentIcons: { [key: string]: any } = {
  "Computer Science": Code,
  Mathematics: Calculator,
  Science: Microscope,
  Literature: BookOpen,
  Business: Briefcase,
};

export default function CommunityPage() {
  const params = useParams();
  const { toast } = useToast();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  const [request, setRequest] = useState<string>();
  const [community, setCommunity] = useState<CommunityType>();

  useEffect(() => {
    if (params.id && typeof params.id === "string")
      fetchCommunityData(params.id);
  }, [params.id]);

  const fetchCommunityData = async (id: string) => {
    setError(undefined);

    const { success, data } = await fetchCommunity(id);

    if (!success) setError("Something went wrong");

    if (data) setCommunity(data);

    setLoading(false);
  };

  const handleJoin = async (id: string, communitId: string, status: STATUS) => {
    setRequest(id);

    const { message, success } = await handleJoinRequest(
      id,
      communitId,
      status
    );

    if (success)
      setCommunity((prev) => ({
        ...prev!,
        members: prev!.members.map((val) =>
          val.id === id ? { ...val, status } : val
        ),
      }));

    toast({
      description: message,
      variant: success ? "default" : "destructive",
    });

    setRequest(undefined);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {};

  if (!session) {
    return (
      <div className="container mx-auto py-8">
        <Card className="p-6 text-center">
          <h2 className="text-xl font-semibold mb-2">Please Sign In</h2>
          <p className="text-muted-foreground">
            You need to be signed in to view community content.
          </p>
        </Card>
      </div>
    );
  }

  const DepartmentIcon =
    departmentIcons[community?.department ?? ""] || Briefcase;
  const isAdmin = session.user.id === community?.adminId;
  const requests =
    community?.members.filter((val) => val.status === "PENDING") || [];

  return (
    <div className="container mx-auto py-8">
      {loading ? (
        <div className="py-10">
          <Spinner borderColor="border-primary" />
        </div>
      ) : error ? (
        <div className="py-10 text-center">{error}</div>
      ) : !community ? (
        <div className="py-10 text-center">
          You are not a member of this community or it does not exist
        </div>
      ) : (
        <Fragment>
          <Card className="p-6 mb-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <DepartmentIcon className="h-8 w-8" />
              </div>

              <div>
                <h1 className="text-2xl font-bold mb-2">{community.name}</h1>

                <p className="text-muted-foreground mb-2">
                  {community.description}
                </p>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>
                    {
                      community.members.filter(
                        (val) => val.status === "APPROVED"
                      ).length
                    }{" "}
                    members
                  </span>
                </div>
              </div>
            </div>
          </Card>

          <Tabs defaultValue="chat" className="space-y-4">
            <TabsList>
              <TabsTrigger value="chat">Chat</TabsTrigger>
              <TabsTrigger value="files">Files</TabsTrigger>
              {isAdmin && (
                <TabsTrigger value="requests">
                  Join Requests
                  {requests.length > 0 && (
                    <span className="ml-2 px-2 py-0.5 bg-primary text-primary-foreground rounded-full text-xs">
                      {requests.length}
                    </span>
                  )}
                </TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="chat">
              <Card className="p-4">
                {/* <LiveChat
                  roomName={`community-${params.id}`}
                  initialMessages={messages}
                /> */}
              </Card>
            </TabsContent>

            <TabsContent value="files">
              <Card className="p-6">
                <div className="mb-6">
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />

                  <label htmlFor="file-upload">
                    <Button asChild>
                      <span>
                        <Upload className="mr-2 h-4 w-4" />
                        Upload File
                      </span>
                    </Button>
                  </label>
                </div>

                <div className="space-y-4">
                  {community.files.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />

                        <div>
                          <p className="font-medium">{file.name}</p>

                          <p className="text-sm text-muted-foreground">
                            Uploaded by {file.user.fullname}
                          </p>
                        </div>
                      </div>

                      <a
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        Download
                      </a>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            {isAdmin && (
              <TabsContent value="requests">
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-4">
                    Pending Join Requests
                  </h2>

                  {requests.length === 0 ? (
                    <p className="text-muted-foreground">No pending requests</p>
                  ) : (
                    <div className="space-y-4">
                      {requests.map((req) => (
                        <div
                          key={req.id}
                          className="flex items-center justify-between p-4 border rounded-lg"
                        >
                          <div>
                            <p className="font-medium">{req.user.fullname}</p>

                            <p className="text-sm text-muted-foreground">
                              {req.user.email}
                            </p>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              disabled={request === req.userId}
                              onClick={() =>
                                handleJoin(
                                  req.userId,
                                  req.communityId,
                                  STATUS.APPROVED
                                )
                              }
                            >
                              {request === req.userId ? (
                                <Spinner width="w-6" className="size-fit" />
                              ) : (
                                <>
                                  <Check className="h-4 w-4 mr-1" />
                                  Approve
                                </>
                              )}
                            </Button>

                            <Button
                              size="sm"
                              disabled={request === req.userId}
                              variant="destructive"
                              onClick={() =>
                                handleJoin(
                                  req.userId,
                                  req.communityId,
                                  STATUS.REJECTED
                                )
                              }
                            >
                              {request === req.userId ? (
                                <Spinner
                                  width="w-6"
                                  className="size-fit"
                                  borderColor="border-white"
                                />
                              ) : (
                                <>
                                  <X className="h-4 w-4 mr-1" />
                                  Reject
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              </TabsContent>
            )}
          </Tabs>
        </Fragment>
      )}
    </div>
  );
}
