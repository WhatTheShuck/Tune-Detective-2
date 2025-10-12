"use client";

import { useEffect, useState } from "react";

export function NavSpacer() {
  const [isPWA, setIsPWA] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Detect PWA mode
    const checkPWA = () => {
      const isStandalone = window.matchMedia(
        "(display-mode: standalone)",
      ).matches;
      // @ts-expect-error - iOS-specific standalone property
      const isIOS = window.navigator.standalone === true;
      setIsPWA(isStandalone || isIOS);
    };

    checkPWA();
  }, []);

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return <div className="h-16" />; // Default height
  }

  return <div className={`${isPWA ? "h-16" : "h-24 md:h-16"}`} />;
}
