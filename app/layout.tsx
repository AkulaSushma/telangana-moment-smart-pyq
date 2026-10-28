import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Telangana Movement Smart PYQ",
  description:
    "Next.js 16 + TypeScript + SQLite platform for Telangana Police SI & Constable aspirants with spaced repetition.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
