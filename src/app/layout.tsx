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
  openGraph: {
    title: "Date Slop - The Adversarial Agent Date Picker",
    description:
      "A bad UX game where an AI agent hijacks your data entry. Give it clues to help it guess your date.",
    url: "https://date-slop.hdv.dev",
    type: "website",
  },
  icons: {
    icon: "/robot-bot-icon.webp",
    shortcut: "/robot-bot-icon.webp",
  },
  other: {
    "application/ld+json": JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Date Slop",
      url: "https://date-slop.hdv.dev",
      description:
        "An interactive Bad UX game where a date input field is hijacked by an incompetent AI agent. Users are blocked from direct text entry and must provide contextual clues to guide the agent into guessing the correct date.",
      applicationCategory: "Game Application",
      operatingSystem: "All",
      author: {
        "@type": "Person",
        name: "Hussein Duvigneau",
        url: "https://hdv.dev",
      },
      keywords: [
        "Bad UX",
        "date picker",
        "AI agent",
        "interactive web app",
        "frustrating UX",
        "LLM prank",
      ],
    }),
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
