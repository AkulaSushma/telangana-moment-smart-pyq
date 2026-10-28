import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "Sadhana | Telangana Police Smart Practice",
  description:
    "Evidence-led learning for Telangana Police SI and Constable. Telangana Movement & State Formation.",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
