"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, Users, BookOpen } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import Spinner from "@/components/widgets/Spinner";
import {
  fetchOngoingClasses,
  fetchPastClasses,
  fetchUpcomingClasses,
} from "@/actions/class";
import { Class } from "@prisma/client";

type ClassType = Class & {
  _count: {
    enrollments: number;
  };
};

export default function ClassesPage() {
  const { data: session } = useSession();
  const [classes, setClasses] = useState<{
    upcoming: ClassType[];
    ongoing: ClassType[];
    past: ClassType[];
  }>({
    upcoming: [],
    ongoing: [],
    past: [],
  });
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(true);

  const fetchClasses = async () => {
    setError(undefined);

    const [feedback1, feedback2, feedback3] = await Promise.all([
      fetchUpcomingClasses(),
      fetchOngoingClasses(),
      fetchPastClasses(),
    ]);

    if (!feedback1.success || !feedback2.success || !feedback3.success)
      setError("Something went wrong");

    if (feedback1.data)
      setClasses((prev) => ({ ...prev, upcoming: feedback1.data }));
    if (feedback2.data)
      setClasses((prev) => ({ ...prev, ongoing: feedback2.data }));
    if (feedback3.data)
      setClasses((prev) => ({ ...prev, past: feedback3.data }));

    setLoading(false);
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  if (!session) {
    return (
      <div className="container mx-auto py-8">
        <Card className="p-6 text-center">
          <h2 className="text-xl font-semibold mb-2">Please Sign In</h2>
          <p className="text-muted-foreground">
            You need to be signed in to view and join classes.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Classes</h1>

        <Link href="/classes/create">
          <Button>
            <BookOpen className="mr-2 h-4 w-4" />
            Create Class
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="py-10">
          <Spinner borderColor="border-primary" />
        </div>
      ) : error ? (
        <div className="py-10 text-center">{error}</div>
      ) : (
        <Tabs defaultValue="upcoming" className="space-y-4">
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming Classes</TabsTrigger>

            <TabsTrigger value="ongoing">Ongoing Classes</TabsTrigger>

            <TabsTrigger value="past">Past Classes</TabsTrigger>
          </TabsList>

          {Object.entries(classes).map(([key, value]) => (
            <TabsContent key={key} value={key} className="space-y-4">
              {value.length <= 0 ? (
                <div className="py-10 text-center">
                  There are no {key} classes found
                </div>
              ) : (
                value.map((class_) => (
                  <Card key={class_.id} className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h2 className="text-xl font-semibold">
                            {class_.title}
                          </h2>

                          {class_.tutorId === session.user.id && (
                            <span className="text-sm px-1 rounded-sm border border-green-400 bg-green-400/20">
                              Host
                            </span>
                          )}
                        </div>

                        <p className="text-muted-foreground mb-4 line-clamp-1 text-ellipsis">
                          {class_.description}
                        </p>

                        <div className="flex items-center gap-6 text-sm text-muted-foreground">
                          <span className="flex items-center">
                            <Calendar className="mr-2 h-4 w-4" />

                            {format(new Date(class_.date), "PPP")}
                          </span>

                          <span className="flex items-center">
                            <Clock className="mr-2 h-4 w-4" />

                            {format(new Date(class_.date), "p")}
                          </span>

                          <span className="flex items-center">
                            <Users className="mr-2 h-4 w-4" />
                            {class_._count.enrollments}/{class_.maxStudents}{" "}
                            students
                          </span>
                        </div>
                      </div>

                      <Link href={`/classes/${class_.id}`}>
                        <Button>View Details</Button>
                      </Link>
                    </div>
                  </Card>
                ))
              )}
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  );
}
