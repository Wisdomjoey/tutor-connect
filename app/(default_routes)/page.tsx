import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
import {
  ArrowRight,
  BookOpen,
  Calendar,
  CheckCircle2,
  FileText,
  MessageSquare,
  Users,
  Video,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import bg from "@/assets/bg.jpg";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-primary/10 py-20 md:py-32">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_500px] lg:gap-12 xl:grid-cols-[1fr_550px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                  Learn Together,{" "}
                  <span className="text-primary">Grow Together</span>
                </h1>

                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  TutorConnect brings students and educators together in a
                  seamless virtual learning environment with real-time classes
                  and collaborative communities.
                </p>
              </div>

              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/auth/signup">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
                  >
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>

                <Link href="#features">
                  <Button size="lg" variant="outline">
                    Explore Features
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative flex items-center justify-center">
              <div className="relative w-full h-[400px] overflow-hidden rounded-xl shadow-2xl">
                <Image
                  src={bg}
                  alt="Virtual classroom"
                  fill
                  className="object-cover"
                  priority
                />

                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent mix-blend-overlay"></div>
              </div>

              <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-accent rounded-full"></div>

              <div className="absolute -top-6 -right-6 w-32 h-32 bg-primary/20 rounded-full"></div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent"></div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y bg-muted/30">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <h2 className="text-4xl font-bold text-primary">5000+</h2>
              <p className="text-muted-foreground">Active Students</p>
            </div>

            <div className="space-y-2">
              <h2 className="text-4xl font-bold text-primary">1200+</h2>
              <p className="text-muted-foreground">Expert Tutors</p>
            </div>

            <div className="space-y-2">
              <h2 className="text-4xl font-bold text-primary">8500+</h2>
              <p className="text-muted-foreground">Classes Conducted</p>
            </div>

            <div className="space-y-2">
              <h2 className="text-4xl font-bold text-primary">95%</h2>
              <p className="text-muted-foreground">Satisfaction Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 md:py-32">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Powerful Features for{" "}
              <span className="text-primary">Effective Learning</span>
            </h2>

            <p className="mx-auto mt-4 max-w-[700px] text-muted-foreground md:text-xl">
              Our platform is designed to make online education engaging,
              interactive, and accessible for everyone.
            </p>
          </div>

          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
            <div className="group relative overflow-hidden rounded-lg border bg-background p-6 shadow-md transition-all hover:shadow-lg">
              <div className="absolute top-0 right-0 h-20 w-20 bg-primary/10 rounded-bl-full transform translate-x-6 -translate-y-6"></div>

              <Video className="h-12 w-12 mb-4 text-primary" />

              <h3 className="text-xl font-bold mb-2">
                Live Virtual Classrooms
              </h3>

              <p className="text-muted-foreground mb-4">
                Conduct or join interactive classes with high-quality video and
                audio streaming, screen sharing, and real-time collaboration
                tools.
              </p>

              <div className="pt-4 border-t">
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 mr-2 text-primary" />
                    <span className="text-sm">HD video conferencing</span>
                  </li>

                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 mr-2 text-primary" />
                    <span className="text-sm">Interactive whiteboard</span>
                  </li>

                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 mr-2 text-primary" />
                    <span className="text-sm">Screen sharing capabilities</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-lg border bg-background p-6 shadow-md transition-all hover:shadow-lg">
              <div className="absolute top-0 right-0 h-20 w-20 bg-primary/10 rounded-bl-full transform translate-x-6 -translate-y-6"></div>

              <Calendar className="h-12 w-12 mb-4 text-primary" />

              <h3 className="text-xl font-bold mb-2">Flexible Scheduling</h3>

              <p className="text-muted-foreground mb-4">
                Create and manage class schedules with ease. Students can browse
                available classes and join at their convenience.
              </p>

              <div className="pt-4 border-t">
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 mr-2 text-primary" />
                    <span className="text-sm">Automated reminders</span>
                  </li>

                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 mr-2 text-primary" />
                    <span className="text-sm">Recurring class options</span>
                  </li>

                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 mr-2 text-primary" />
                    <span className="text-sm">Time zone adaptation</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-lg border bg-background p-6 shadow-md transition-all hover:shadow-lg">
              <div className="absolute top-0 right-0 h-20 w-20 bg-primary/10 rounded-bl-full transform translate-x-6 -translate-y-6"></div>

              <MessageSquare className="h-12 w-12 mb-4 text-primary" />

              <h3 className="text-xl font-bold mb-2">Learning Communities</h3>

              <p className="text-muted-foreground mb-4">
                Join subject-specific communities to collaborate with peers,
                share resources, and engage in discussions.
              </p>

              <div className="pt-4 border-t">
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 mr-2 text-primary" />
                    <span className="text-sm">Group discussions</span>
                  </li>

                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 mr-2 text-primary" />
                    <span className="text-sm">Resource sharing</span>
                  </li>

                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 mr-2 text-primary" />
                    <span className="text-sm">Peer collaboration</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-lg border bg-background p-6 shadow-md transition-all hover:shadow-lg">
              <div className="absolute top-0 right-0 h-20 w-20 bg-primary/10 rounded-bl-full transform translate-x-6 -translate-y-6"></div>

              <FileText className="h-12 w-12 mb-4 text-primary" />

              <h3 className="text-xl font-bold mb-2">Resource Management</h3>

              <p className="text-muted-foreground mb-4">
                Upload, organize, and share learning materials with your
                students or classmates. Access resources anytime, anywhere.
              </p>

              <div className="pt-4 border-t">
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 mr-2 text-primary" />
                    <span className="text-sm">File storage & sharing</span>
                  </li>

                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 mr-2 text-primary" />
                    <span className="text-sm">Document organization</span>
                  </li>

                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 mr-2 text-primary" />
                    <span className="text-sm">Access control</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-lg border bg-background p-6 shadow-md transition-all hover:shadow-lg">
              <div className="absolute top-0 right-0 h-20 w-20 bg-primary/10 rounded-bl-full transform translate-x-6 -translate-y-6"></div>

              <Users className="h-12 w-12 mb-4 text-primary" />

              <h3 className="text-xl font-bold mb-2">Community Building</h3>

              <p className="text-muted-foreground mb-4">
                Create and join academic communities based on subjects,
                departments, or interests to foster collaboration.
              </p>

              <div className="pt-4 border-t">
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 mr-2 text-primary" />
                    <span className="text-sm">Subject-based groups</span>
                  </li>

                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 mr-2 text-primary" />
                    <span className="text-sm">Moderated discussions</span>
                  </li>

                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 mr-2 text-primary" />
                    <span className="text-sm">Event organization</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-lg border bg-background p-6 shadow-md transition-all hover:shadow-lg">
              <div className="absolute top-0 right-0 h-20 w-20 bg-primary/10 rounded-bl-full transform translate-x-6 -translate-y-6"></div>

              <BookOpen className="h-12 w-12 mb-4 text-primary" />

              <h3 className="text-xl font-bold mb-2">Specialized Learning</h3>

              <p className="text-muted-foreground mb-4">
                Access specialized courses and tutoring sessions tailored to
                your academic needs and learning pace.
              </p>

              <div className="pt-4 border-t">
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 mr-2 text-primary" />
                    <span className="text-sm">Personalized learning</span>
                  </li>

                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 mr-2 text-primary" />
                    <span className="text-sm">Expert tutors</span>
                  </li>

                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 mr-2 text-primary" />
                    <span className="text-sm">Diverse subject areas</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-primary/5 via-background to-primary/10">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              How <span className="text-primary">TutorConnect</span> Works
            </h2>

            <p className="mx-auto mt-4 max-w-[700px] text-muted-foreground md:text-xl">
              Our platform makes it easy to connect, learn, and grow together in
              just a few simple steps.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="relative">
              <div className="absolute top-0 left-0 -mt-4 -ml-4 h-16 w-16 flex items-center justify-center rounded-full bg-primary text-primary-foreground text-2xl font-bold">
                1
              </div>

              <div className="rounded-lg border bg-background p-6 pt-10 shadow-md">
                <h3 className="text-xl font-bold mb-2">Create Your Account</h3>

                <p className="text-muted-foreground">
                  Sign up as a student or tutor and complete your profile with
                  your academic interests and expertise.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute top-0 left-0 -mt-4 -ml-4 h-16 w-16 flex items-center justify-center rounded-full bg-primary text-primary-foreground text-2xl font-bold">
                2
              </div>

              <div className="rounded-lg border bg-background p-6 pt-10 shadow-md">
                <h3 className="text-xl font-bold mb-2">Connect & Explore</h3>

                <p className="text-muted-foreground">
                  Browse available classes and communities or create your own to
                  share your knowledge.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute top-0 left-0 -mt-4 -ml-4 h-16 w-16 flex items-center justify-center rounded-full bg-primary text-primary-foreground text-2xl font-bold">
                3
              </div>

              <div className="rounded-lg border bg-background p-6 pt-10 shadow-md">
                <h3 className="text-xl font-bold mb-2">Learn & Collaborate</h3>

                <p className="text-muted-foreground">
                  Join virtual classrooms, participate in discussions, and share
                  resources with your peers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 md:py-32">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              What Our <span className="text-primary">Users Say</span>
            </h2>

            <p className="mx-auto mt-4 max-w-[700px] text-muted-foreground md:text-xl">
              Hear from students and tutors who have transformed their learning
              experience with TutorConnect.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border bg-background p-6 shadow-md">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>

                <div>
                  <h4 className="font-bold">Sarah Johnson</h4>

                  <p className="text-sm text-muted-foreground">
                    Computer Science Student
                  </p>
                </div>
              </div>

              <p className="italic text-muted-foreground">
                &quot;TutorConnect has been a game-changer for my studies. The
                virtual classrooms are so interactive, and I&apos;ve found an
                amazing community of fellow CS students to collaborate
                with.&quot;
              </p>
            </div>

            <div className="rounded-lg border bg-background p-6 shadow-md">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>

                <div>
                  <h4 className="font-bold">Dr. Michael Chen</h4>

                  <p className="text-sm text-muted-foreground">
                    Mathematics Professor
                  </p>
                </div>
              </div>

              <p className="italic text-muted-foreground">
                &quot;As an educator, I&apos;ve found TutorConnect to be the
                perfect platform to extend my teaching beyond the traditional
                classroom. The tools are intuitive and the student engagement is
                exceptional.&quot;
              </p>
            </div>

            <div className="rounded-lg border bg-background p-6 shadow-md">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>

                <div>
                  <h4 className="font-bold">Aisha Patel</h4>

                  <p className="text-sm text-muted-foreground">
                    Biology Student
                  </p>
                </div>
              </div>

              <p className="italic text-muted-foreground">
                &quot;I was struggling with my advanced biology course until I
                found a study group on TutorConnect. The collaborative
                environment and resource sharing have helped me improve my
                grades significantly.&quot;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-primary/10 via-background to-primary/5">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Ready to Transform Your Learning Experience?
            </h2>

            <p className="max-w-[700px] text-muted-foreground md:text-xl">
              Join thousands of students and educators on TutorConnect today and
              take your education to the next level.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <Link href="/auth/signup">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
                >
                  Get Started Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>

              <Link href="/classes">
                <Button size="lg" variant="outline">
                  Explore Classes
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
  // return (
  //   <div className="container mx-auto px-4 py-8">
  //     <div className="text-center mb-12">
  //       <h1 className="text-4xl font-bold tracking-tight mb-4">
  //         Welcome to TutorConnect
  //       </h1>
  //       <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
  //         Connect with tutors and students worldwide. Host or join interactive
  //         online classes with real-time collaboration tools.
  //       </p>
  //     </div>

  //     <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
  //       <Card className="p-6">
  //         <Video className="h-12 w-12 mb-4" />
  //         <h2 className="text-xl font-semibold mb-2">Host Classes</h2>
  //         <p className="text-muted-foreground mb-4">
  //           Create and schedule online classes. Share your knowledge with students
  //           worldwide.
  //         </p>
  //         <Link href="/classes/create">
  //           <Button className="w-full">Create a Class</Button>
  //         </Link>
  //       </Card>

  //       <Card className="p-6">
  //         <BookOpen className="h-12 w-12 mb-4" />
  //         <h2 className="text-xl font-semibold mb-2">Join Classes</h2>
  //         <p className="text-muted-foreground mb-4">
  //           Browse available classes and join interactive learning sessions with
  //           expert tutors.
  //         </p>
  //         <Link href="/classes">
  //           <Button className="w-full" variant="outline">
  //             Browse Classes
  //           </Button>
  //         </Link>
  //       </Card>

  //       <Card className="p-6">
  //         <Users className="h-12 w-12 mb-4" />
  //         <h2 className="text-xl font-semibold mb-2">Community</h2>
  //         <p className="text-muted-foreground mb-4">
  //           Connect with other students, share resources, and participate in
  //           discussions.
  //         </p>
  //         <Link href="/profile">
  //           <Button className="w-full" variant="outline">
  //             View Profile
  //           </Button>
  //         </Link>
  //       </Card>
  //     </div>
  //   </div>
  // );
}
