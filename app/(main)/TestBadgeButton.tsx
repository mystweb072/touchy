"use client";

export default function TestBadgeButton() {
  return (
    <button
      onClick={async () => {
        try {
          if ("setAppBadge" in navigator) {
            // @ts-ignore
            await navigator.setAppBadge(5);
            alert("Badge ustawiony na 5");
          } else {
            alert("Brak setAppBadge");
          }
        } catch (e) {
          alert(`Błąd: ${e instanceof Error ? e.message : "unknown"}`);
        }
      }}
    >
      Test badge 5
    </button>
  );
}
