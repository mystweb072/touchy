import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Touchy",
  description: "Send digital touch and emotions.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Touchy",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
};
