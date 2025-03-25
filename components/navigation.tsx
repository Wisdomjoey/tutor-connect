"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  BookOpen,
  Calendar,
  Users,
  Video,
  LogOut,
  MessageSquare,
  Menu,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";

export function Navigation() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  const NavItems = () => (
    <>
      {status === "authenticated" ? (
        <>
          {[
            { path: "/classes", label: "Classes", icon: Video },
            { path: "/communities", label: "Communities", icon: MessageSquare },
            { path: "/profile", label: "Profile", icon: Users },
          ].map((Val, ind) => (
            <Link key={ind} href={Val.path}>
              <Button
                className="w-full justify-start md:justify-center"
                variant={pathname === Val.path ? "default" : "ghost"}
              >
                <Val.icon className="mr-2 h-4 w-4" />
                {Val.label}
              </Button>
            </Link>
          ))}

          <Button
            className="w-full justify-start md:justify-center"
            variant="ghost"
            onClick={() => signOut()}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </>
      ) : (
        <>
          <Link href="/auth/signin">
            <Button variant="ghost">Sign In</Button>
          </Link>

          <Link href="/auth/signup">
            <Button>Sign Up</Button>
          </Link>
        </>
      )}
    </>
  );

  return (
    <nav className="border-b">
      <div className="flex h-16 items-center px-4">
        <Link href="/" className="flex items-center space-x-2">
          <BookOpen className="h-6 w-6" />
          <span className="font-bold">TutorConnect</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="ml-auto hidden md:flex items-center space-x-4">
          <NavItems />
        </div>

        {/* Mobile Navigation */}
        <div className="ml-auto md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="flex flex-col space-y-4 mt-8">
                <NavItems />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
