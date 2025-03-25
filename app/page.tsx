import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BookOpen, Users, Video } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Welcome to TutorConnect
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Connect with tutors and students worldwide. Host or join interactive
          online classes with real-time collaboration tools.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        <Card className="p-6">
          <Video className="h-12 w-12 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Host Classes</h2>
          <p className="text-muted-foreground mb-4">
            Create and schedule online classes. Share your knowledge with students
            worldwide.
          </p>
          <Link href="/classes/create">
            <Button className="w-full">Create a Class</Button>
          </Link>
        </Card>

        <Card className="p-6">
          <BookOpen className="h-12 w-12 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Join Classes</h2>
          <p className="text-muted-foreground mb-4">
            Browse available classes and join interactive learning sessions with
            expert tutors.
          </p>
          <Link href="/classes">
            <Button className="w-full" variant="outline">
              Browse Classes
            </Button>
          </Link>
        </Card>

        <Card className="p-6">
          <Users className="h-12 w-12 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Community</h2>
          <p className="text-muted-foreground mb-4">
            Connect with other students, share resources, and participate in
            discussions.
          </p>
          <Link href="/profile">
            <Button className="w-full" variant="outline">
              View Profile
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}