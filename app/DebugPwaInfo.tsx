"use client";

import { useEffect, useState } from "react";

export default function DebugPwaInfo() {
  const [info, setInfo] = useState({
    standalone: "unknown",
    hasBadgeApi: "unknown",
    permission: "unknown",
  });

  useEffect(() => {
    const isStandalone =
      "standalone" in window.navigator
        ? String((window.navigator as any).standalone)
        : "false";

    setInfo({
      standalone: isStandalone,
      hasBadgeApi: String("setAppBadge" in navigator),
      permission: Notification.permission,
    });
  }, []);

  return (
    <div style={{ padding: 16, fontSize: 16 }}>
      <div>standalone: {info.standalone}</div>
      <div>has badge api: {info.hasBadgeApi}</div>
      <div>permission: {info.permission}</div>
    </div>
  );
}
