import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  extendDefaultRuntimeCaching: true,
  workboxOptions: {
    importScripts: ["/worker-push.js"],
  },
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "tqvmjbnyrijeyogbdrrx.supabase.co",
        pathname: "/storage/v1/object/public/ProfilePictures/**",
      },
    ],
  },
  allowedDevOrigins: [
    "https://chucklingly-getatable-domenica.ngrok-free.dev/",
    "192.168.1.109:3000",
  ],
};

export default withPWA(nextConfig);
