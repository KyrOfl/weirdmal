import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WeirdMal — What is normal?",
  description: "Can you guess what everyone else considers normal?",
  icons: {
    icon: "/weirdmal-logo.png",
    apple: "/weirdmal-logo.png",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
