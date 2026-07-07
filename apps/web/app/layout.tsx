import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Videos — AI Tools Directory",
  description: "Watch AI tools in action before you commit to one.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://www.youtube-nocookie.com" />
        <link rel="dns-prefetch" href="https://i.ytimg.com" />
      </head>
      <body>{children}</body>
    </html>
  );
}