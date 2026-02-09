import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { StorageWarning } from "@/components/layout/StorageWarning";
import { Toaster } from "@/components/ui/sonner";
import { ServiceWorkerRegistration } from "@/components/layout/ServiceWorkerRegistration";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pix3lPrompt — Intelligent Prompt Editor for AI Generators",
  description:
    "Intelligent prompt editor for AI image, video and audio generators",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Pix3lPrompt",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
      </head>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} flex h-dvh flex-col font-sans antialiased`}
      >
        <ThemeProvider>
          <Header />
          <StorageWarning />
          <div className="flex min-h-0 flex-1 flex-col">{children}</div>
          <Footer />
          <Toaster />
          <Analytics />
          <ServiceWorkerRegistration />
        </ThemeProvider>
      </body>
    </html>
  );
}
