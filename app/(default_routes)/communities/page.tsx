"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { Fragment, useEffect, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Users, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CommunitySchema, UseCommunitySchema } from "@/zod/schema";
import { useForm } from "react-hook-form";
import Spinner from "@/components/widgets/Spinner";
import { Community, CommunityMember } from "@prisma/client";
import {
  createCommunity,
  fetchCommunities,
  fetchMemberships,
  fetchMyCommunities,
  joinCommunity,
} from "@/actions/community";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import DefaultInput from "@/components/inputs/DefaultInput";
import TextAreaInput from "@/components/inputs/TextAreaInput";
import SelectInput from "@/components/inputs/SelectInput";
import Link from "next/link";

type CommunityType = Community & {
  _count: {
    members: number;
  };
};

export default function CommunitiesPage() {
  const { toast } = useToast();
  const { data: session } = useSession();
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(true);
  const [isPending, transition] = useTransition();
  const [joining, setJoining] = useState<string>();
  const [communities, setCommunities] = useState<{
    all: CommunityType[];
    joined: CommunityType[];
    memberships: CommunityMember[];
  }>({
    all: [],
    joined: [],
    memberships: [],
  });
  const form = useForm<UseCommunitySchema>({
    resolver: zodResolver(CommunitySchema),
    defaultValues: {
      description: "",
      department: "",
      faculty: "",
      name: "",
    },
  });

  const fetchAllCommunities = async () => {
    setError(undefined);

    const [feedback1, feedback2, feedback3] = await Promise.all([
      fetchCommunities(),
      fetchMyCommunities(),
      fetchMemberships(),
    ]);

    if (!feedback1.success || !feedback2.success || !feedback3.success)
      setError("Something went wrong");

    if (feedback1.data)
      setCommunities((prev) => ({ ...prev, all: feedback1.data }));
    if (feedback2.data)
      setCommunities((prev) => ({ ...prev, joined: feedback2.data }));
    if (feedback3.data)
      setCommunities((prev) => ({ ...prev, memberships: feedback3.data }));

    setLoading(false);
  };

  const handleJoinRequest = async (communityId: string) => {
    setJoining(communityId);

    const { message, success, data } = await joinCommunity(communityId);

    if (data)
      setCommunities((prev) => ({
        ...prev,
        memberships: [...prev.memberships, data],
      }));

    toast({
      description: message,
      variant: success ? "default" : "destructive",
    });

    setJoining(undefined);
  };

  const handleSubmit = (values: UseCommunitySchema) => {
    transition(async () => {
      const { message, success, data } = await createCommunity(values);

      if (success) form.reset();
      if (data)
        setCommunities((prev) => ({ ...prev, joined: [...prev.joined, data] }));

      toast({
        description: message,
        variant: success ? "default" : "destructive",
      });
    });
  };

  useEffect(() => {
    fetchAllCommunities();
  }, [session]);

  if (!session) {
    return (
      <div className="container mx-auto py-8">
        <Card className="p-6 text-center">
          <h2 className="text-xl font-semibold mb-2">Please Sign In</h2>

          <p className="text-muted-foreground">
            You need to be signed in to view and join communities.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Communities</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Community
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Community</DialogTitle>
            </DialogHeader>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="w-full flex flex-col gap-8"
              >
                <div className="space-y-4">
                  <FormField
                    name="name"
                    disabled={isPending}
                    control={form.control}
                    render={({ field, fieldState: { error } }) => (
                      <FormItem>
                        <FormControl>
                          <DefaultInput
                            id="name"
                            label="Community Name"
                            disabled={isPending}
                            placeholder="Enter community name"
                            {...field}
                          />
                        </FormControl>

                        <FormMessage className="text-red-600" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="faculty"
                    disabled={isPending}
                    control={form.control}
                    render={({ field, fieldState: { error } }) => (
                      <FormItem>
                        <FormControl>
                          <SelectInput
                            id="faculty"
                            label="Faculty"
                            disabled={isPending}
                            placeholder="Select Faculty"
                            items={[
                              { label: "Art", value: "Art" },
                              { label: "Business", value: "Business" },
                              { label: "Science", value: "Science" },
                            ]}
                            {...field}
                          />
                        </FormControl>

                        <FormMessage className="text-red-600" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="department"
                    disabled={isPending}
                    control={form.control}
                    render={({ field, fieldState: { error } }) => (
                      <FormItem>
                        <FormControl>
                          <SelectInput
                            id="department"
                            label="Department"
                            disabled={isPending}
                            placeholder="Select Department"
                            items={[
                              { label: "Art", value: "Art" },
                              { label: "Business", value: "Business" },
                              { label: "Science", value: "Science" },
                            ]}
                            {...field}
                          />
                        </FormControl>

                        <FormMessage className="text-red-600" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="description"
                    disabled={isPending}
                    control={form.control}
                    render={({ field, fieldState: { error } }) => (
                      <FormItem>
                        <FormControl>
                          <TextAreaInput
                            id="description"
                            label="Description"
                            placeholder="Enter community description"
                            disabled={isPending}
                            {...field}
                          />
                        </FormControl>

                        <FormMessage className="text-red-600" />
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="submit" disabled={isPending} className="w-full">
                  {isPending ? (
                    <Spinner width="w-6" className="size-fit" />
                  ) : (
                    "Create Community"
                  )}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Communities</TabsTrigger>
          <TabsTrigger value="joined">My Communities</TabsTrigger>
        </TabsList>

        {loading ? (
          <div className="py-10">
            <Spinner borderColor="border-primary" />
          </div>
        ) : error ? (
          <div className="py-10 text-center">{error}</div>
        ) : (
          <Fragment>
            {Object.entries({
              all: communities.all,
              joined: communities.joined,
            }).map(([key, value]) => (
              <TabsContent key={key} value={key} className="space-y-4">
                {value.length <= 0 ? (
                  <div className="py-10 text-center">
                    There are no communities found
                  </div>
                ) : (
                  value.map((community) => {
                    const status = communities.memberships.filter(
                      (val) => val.communityId === community.id
                    )[0]?.status;

                    return (
                      <Card key={community.id} className="p-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <h2 className="text-xl font-semibold">
                                {community.name}
                              </h2>

                              {(status === "APPROVED" ||
                                community.adminId === session.user.id) && (
                                <span className="text-sm px-1 rounded-sm border border-green-400 bg-green-400/20">
                                  {status === "APPROVED" ? "Member" : "Admin"}
                                </span>
                              )}
                            </div>

                            <p className="text-muted-foreground mb-2">
                              {community.description}
                            </p>

                            <p className="text-sm text-muted-foreground">
                              Faculty: {community.department}
                            </p>

                            <p className="text-sm text-muted-foreground">
                              Department: {community.department}
                            </p>

                            <div className="flex items-center gap-4 mt-4">
                              <span className="flex items-center text-sm text-muted-foreground">
                                <Users className="mr-1 h-4 w-4" />
                                {community._count.members} members
                              </span>
                            </div>
                          </div>

                          {(key === "all" || status !== "APPROVED") &&
                          community.adminId !== session.user.id ? (
                            <Button
                              onClick={() =>
                                !status && handleJoinRequest(community.id)
                              }
                            >
                              {joining === community.id ? (
                                <Spinner width="w-6" className="size-fit" />
                              ) : status === "PENDING" ? (
                                "Request Sent"
                              ) : status === "REJECTED" ? (
                                "Request Rejected"
                              ) : (
                                "Request to Join"
                              )}
                            </Button>
                          ) : (
                            <Link href={`/communities/${community.id}`}>
                              <Button>View Community</Button>
                            </Link>
                          )}
                        </div>
                      </Card>
                    );
                  })
                )}
              </TabsContent>
            ))}
          </Fragment>
        )}
      </Tabs>
    </div>
  );
}
