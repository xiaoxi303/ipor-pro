import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "IPor - Professional IP Detection & Analysis",
  description: "Check your IP address, location, ISP, and network security risk with IPor.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={cn(
          geistSans.variable,
          geistMono.variable,
          "antialiased min-h-screen selection:bg-primary/30 text-foreground"
        )}
      >
        <div className="bg-grid" />
        <div className="bg-glow top-0 -left-20" />
        <div className="bg-glow -bottom-20 -right-20" style={{ animationDelay: '-10s' }} />
        
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}
