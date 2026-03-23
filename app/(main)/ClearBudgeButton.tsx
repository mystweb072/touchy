"use client";

export default function ClearBadgeButton() {
  return (
    <button
      onClick={async () => {
        try {
          if ("clearAppBadge" in navigator) {
            // @ts-ignore
            await navigator.clearAppBadge();
            alert("Badge wyczyszczony");
          } else {
            alert("Brak clearAppBadge");
          }
        } catch (e) {
          alert(`Błąd: ${e instanceof Error ? e.message : "unknown"}`);
        }
      }}
    >
      Clear badge
    </button>
  );
}
