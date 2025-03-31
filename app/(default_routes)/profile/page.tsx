"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Users, MessageSquare } from "lucide-react";
import { updateUser } from "@/actions/user";
import Spinner from "@/components/widgets/Spinner";

export default function ProfilePage() {
  const { toast } = useToast();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name");
    const bio = formData.get("bio");

    if (!name)
      return toast({
        description: "Required fields were not passed",
        variant: "destructive",
      });

    const { message, success } = await updateUser({
      name: name.toString(),
      bio: bio?.toString(),
    });

    toast({
      description: message,
      variant: success ? "default" : "destructive",
    });

    setLoading(false);
  };

  if (!session) {
    return (
      <div className="container mx-auto py-8">
        <Card className="p-6 text-center">
          <h2 className="text-xl font-semibold mb-2">Please Sign In</h2>
          <p className="text-muted-foreground">
            You need to be signed in to view your profile.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Profile</h1>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 p-6">
          <div className="text-center">
            <div className="w-32 h-32 rounded-full bg-primary/10 mx-auto mb-4 flex items-center justify-center">
              <Users className="h-12 w-12" />
            </div>
            <h2 className="text-xl font-semibold">{session.user?.fullname}</h2>
            <p className="text-muted-foreground">{session.user?.email}</p>
          </div>

          <div className="mt-6 space-y-2">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span>12 Classes Attended</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              <span>5 Communities</span>
            </div>
          </div>
        </Card>

        <div className="md:col-span-2">
          <Card className="p-6">
            {loading ? (
              <div className="py-10">
                <Spinner borderColor="border-primary" />
              </div>
            ) : (
              <Tabs defaultValue="profile" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="profile">Profile</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>

                <TabsContent value="profile">
                  <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        name="name"
                        defaultValue={session.user?.fullname || ""}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        name="bio"
                        placeholder="Tell us about yourself..."
                        className="min-h-[100px]"
                      />
                    </div>

                    <Button type="submit" disabled={loading}>
                      {loading ? "Saving..." : "Save Changes"}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="settings">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Email Notifications</Label>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2">
                          <input type="checkbox" defaultChecked />
                          <span>Class reminders</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="checkbox" defaultChecked />
                          <span>Community updates</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="checkbox" defaultChecked />
                          <span>New message notifications</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
