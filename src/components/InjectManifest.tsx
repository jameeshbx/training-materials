"use client";

import { useEffect } from "react";

export default function InjectManifest() {
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "manifest";
    link.href = "/manifest.json";

    if (!document.querySelector('link[rel="manifest"]')) {
      document.head.appendChild(link);
      console.log("✅ Manifest link injected");
    }
  }, []);

  return null;
}
