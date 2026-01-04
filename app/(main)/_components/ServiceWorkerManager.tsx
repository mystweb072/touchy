"use client";

import { useEffect } from "react";

type Props = {};

export default function ServiceWorkerManager({}: Props) {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      const registerSw = () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((reg) => {
            console.log("SW zarejestrowany:", reg.scope);
          })
          .catch((error) => {
            console.log("Blad rejestracji SW:", error);
          });
      };

      if (document.readyState === "complete") {
        registerSw();
      } else {
        window.addEventListener("load", registerSw);
      }
    }
  }, []);
  return null;
}
