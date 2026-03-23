"use client";

import { useEffect, useState } from "react";

type DebugPushData = {
  payload?: unknown;
  customData?: unknown;
  payloadUnreadCount?: unknown;
  dataUnreadCount?: unknown;
  finalUnreadCount?: unknown;
};

export default function PushDebugPanel() {
  const [info, setInfo] = useState({
    standalone: "loading...",
    hasBadgeApi: "loading...",
    permission: "loading...",
  });

  const [pushData, setPushData] = useState<DebugPushData | null>(null);

  useEffect(() => {
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
        : "unavailable";

    setInfo({
      standalone: String(iosStandalone || displayModeStandalone),
      hasBadgeApi: String(hasBadgeApi),
      permission: String(permission),
    });
  }, []);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    const handler = (event: MessageEvent) => {
      if (event.data?.type === "DEBUG_PUSH") {
        setPushData(event.data.data);
      }
    };

    navigator.serviceWorker.addEventListener("message", handler);

    return () => {
      navigator.serviceWorker.removeEventListener("message", handler);
    };
  }, []);

  const handleSetBadge = async () => {
    try {
      if ("setAppBadge" in navigator) {
        // @ts-ignore
        await navigator.setAppBadge(5);
        alert("Badge ustawiony na 5");
      } else {
        alert("Brak setAppBadge");
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : "Błąd przy setAppBadge");
    }
  };

  const handleClearBadge = async () => {
    try {
      if ("clearAppBadge" in navigator) {
        // @ts-ignore
        await navigator.clearAppBadge();
        alert("Badge wyczyszczony");
      } else {
        alert("Brak clearAppBadge");
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : "Błąd przy clearAppBadge");
    }
  };

  const handleRequestPermission = async () => {
    try {
      if (typeof Notification === "undefined") {
        alert("Notifications API unavailable");
        return;
      }

      const result = await Notification.requestPermission();

      setInfo((prev) => ({
        ...prev,
        permission: result,
      }));

      alert(`Permission: ${result}`);
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "Błąd przy requestPermission",
      );
    }
  };

  return (
    <div
      style={{
        padding: 16,
        fontSize: 14,
        lineHeight: 1.5,
        background: "#fff",
        color: "#111",
        border: "1px solid #ddd",
        borderRadius: 12,
        margin: 16,
        overflow: "scroll",
      }}
    >
      <h2 style={{ marginBottom: 12 }}>Push / Badge Debug</h2>

      <div>standalone: {info.standalone}</div>
      <div>has badge api: {info.hasBadgeApi}</div>
      <div>permission: {info.permission}</div>

      <div style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap" }}>
        <button onClick={handleRequestPermission}>Request permission</button>
        <button onClick={handleSetBadge}>Test badge 5</button>
        <button onClick={handleClearBadge}>Clear badge</button>
      </div>

      <div style={{ marginTop: 20 }}>
        <h3 style={{ marginBottom: 8 }}>Last push payload from SW</h3>

        <pre
          style={{
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            background: "#f6f6f6",
            padding: 12,
            borderRadius: 8,
            border: "1px solid #e5e5e5",
            minHeight: 120,
          }}
        >
          {pushData ? JSON.stringify(pushData, null, 2) : "Brak danych z pusha"}
        </pre>
      </div>
    </div>
  );
}
