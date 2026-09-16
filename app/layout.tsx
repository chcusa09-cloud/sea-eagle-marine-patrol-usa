import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: {
    default: "SEMP USA | One Ship, One Course, One Marine",
    template: "%s | SEMP USA",
  },
  description:
    "Sea Eagle Marine Patrol USA. United in brotherhood, humanitarian service, and community development.",
  icons: { icon: "/sea-eagle-logo.jpeg" },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
