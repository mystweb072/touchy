"use client";

import { useEffect } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // useEffect(() => {
  //   if ("serviceWorker" in navigator) {
  //     navigator.serviceWorker
  //       .register("/push-sw.js")
  //       .then((reg) => console.log("SW zarejestrowany:", reg))
  //       .catch((err) => console.error("Błąd rejestracji SW:", err));
  //   }
  // }, []);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} touch-none antialiased select-none`}
      >
        {children}
      </body>
    </html>
  );
}
