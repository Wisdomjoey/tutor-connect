import { Navigation } from "@/components/navigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Navigation />

      <main className="min-h-screen bg-background">{children}</main>

      {/* <footer className="p-5 text-center text-xs sm:text-sm border-t">
        All Rights Reserved. Yaba Colledge Of Technology, Copyrights © 2025
      </footer> */}
      <footer className="py-10 px-5 text-center border-t bg-muted/30">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left mb-8">
            <div>
              <h3 className="font-bold text-lg mb-4">TutorConnect</h3>

              <p className="text-muted-foreground">
                Connecting students and educators in a seamless virtual learning environment.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4">Quick Links</h3>

              <ul className="space-y-2">
                <li>
                  <a href="/classes" className="text-muted-foreground hover:text-primary">
                    Classes
                  </a>
                </li>

                <li>
                  <a href="/communities" className="text-muted-foreground hover:text-primary">
                    Communities
                  </a>
                </li>

                <li>
                  <a href="/auth/signup" className="text-muted-foreground hover:text-primary">
                    Sign Up
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4">Contact</h3>

              <p className="text-muted-foreground">
                Email: support@tutorconnect.edu
                <br />
                Phone: +234 800 123 4567
              </p>
            </div>
          </div>
          
          <div className="border-t pt-8">
            <p className="text-sm text-muted-foreground">
              All Rights Reserved. Yaba College Of Technology, Copyrights © {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
