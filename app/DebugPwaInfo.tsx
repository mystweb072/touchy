"use client";

import { useEffect, useState } from "react";

export default function DebugPwaInfo() {
  const [info, setInfo] = useState({
    standalone: "loading...",
    hasBadgeApi: "loading...",
    permission: "loading...",
  });

  useEffect(() => {
    try {
      const iosStandalone =
        typeof window !== "undefined" &&
        "standalone" in window.navigator &&
        Boolean((window.navigator as any).standalone);

      const displayModeStandalone =
        typeof window !== "undefined" &&
        typeof window.matchMedia === "function" &&
        window.matchMedia("(display-mode: standalone)").matches;

      const hasBadgeApi =
        typeof navigator !== "undefined" && "setAppBadge" in navigator;

      const permission =
        typeof Notification !== "undefined"
          ? Notification.permission
          : "Notification API unavailable";

      setInfo({
        standalone: String(iosStandalone || displayModeStandalone),
        hasBadgeApi: String(hasBadgeApi),
        permission: String(permission),
      });
    } catch (error) {
      setInfo({
        standalone: "error",
        hasBadgeApi: "error",
        permission: error instanceof Error ? error.message : "unknown error",
      });
    }
  }, []);

  return (
    <div style={{ padding: 16, fontSize: 16 }}>
      <div>standalone: {info.standalone}</div>
      <div>has badge api: {info.hasBadgeApi}</div>
      <div>permission: {info.permission}</div>
    </div>
  );
}
