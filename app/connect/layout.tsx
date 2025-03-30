import Script from "next/script";
import { Fragment } from "react";

export default function ConnectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Fragment>
      <main className="min-h-screen bg-background">{children}</main>

      <Script src="/lk-script.js" />
    </Fragment>
  );
}
