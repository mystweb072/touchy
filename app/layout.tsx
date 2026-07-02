import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import ServiceWorkerManager from "./(main)/_components/ServiceWorkerManager";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Touchy",
  description: "Send digital touch and emotions.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Touchy",
  },
  icons: {
    icon: "/icons/512x512.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} touch-none antialiased select-none`}
      >
        <ServiceWorkerManager />
        {children}
      </body>
    </html>
  );
}
