"use client";

import { useEffect } from "react";

export default function KeepAlive() {
  useEffect(() => {
    try {
      const key = "keepalive-pinged";
      if (typeof window !== "undefined" && !sessionStorage.getItem(key)) {
        fetch("/api/guess?keepalive=1", { cache: "no-store" }).catch(() => {});
        try {
          sessionStorage.setItem(key, "1");
        } catch (e) {}
      }
    } catch (e) {
      // ignore
    }
  }, []);

  return null;
}
