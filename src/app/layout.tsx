import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import KeepAlive from "@/libs/KeepAlive";
import type { Metadata } from "next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Date Slop",
  description:
    "Date Slop is a deliberately bad date-picker demo by Hussein Duvigneau for a Bad UX competition: an AI agent hijacks the date field and asks you questions until it guesses your birth date, creating a frustrating but hopefully amusing UX experience.",
  keywords: [
    "Bad UX",
    "date picker",
    "AI agent",
    "UX demo",
    "frustrating interface",
    "date of birth",
    "LLM prank",
  ],
  icons: {
    icon: "/robot-bot-icon.webp",
    shortcut: "/robot-bot-icon.webp",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <KeepAlive />
        {children}
      </body>
    </html>
  );
}
