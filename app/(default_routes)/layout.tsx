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

      <footer className="p-5 text-center text-xs sm:text-sm border-t">
        All Rights Reserved. Yaba Colledge Of Technology, Copyrights © 2025
      </footer>
    </div>
  );
}
