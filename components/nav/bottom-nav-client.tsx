"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { navItems } from "@/lib/data";
import { NavButton } from "./nav-button";

export function BottomNavClient() {
  const router = useRouter();
  const pathname = usePathname();
  const [isPWA, setIsPWA] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Detect PWA mode
    const checkPWA = () => {
      const isStandalone = window.matchMedia(
        "(display-mode: standalone)",
      ).matches;
      const isIOS = window.navigator.standalone === true;
      setIsPWA(isStandalone || isIOS);
    };

    checkPWA();

    // Set viewport height custom property for better mobile handling
    const updateViewportHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    updateViewportHeight();
    window.addEventListener("resize", updateViewportHeight);
    window.addEventListener("orientationchange", updateViewportHeight);

    return () => {
      window.removeEventListener("resize", updateViewportHeight);
      window.removeEventListener("orientationchange", updateViewportHeight);
    };
  }, []);

  const handleNavigation = (href: string) => {
    router.push(href);
  };

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  // Don't render until mounted to avoid hydration issues
  if (!mounted) return null;

  return (
    <nav
      className={`
        fixed bottom-0 left-0 right-0 z-50
        bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60
        border-t border-border
        ${isPWA ? "pb-safe" : "pb-4 md:pb-2"}
      `}
      style={{
        paddingBottom: isPWA
          ? "max(env(safe-area-inset-bottom, 0px), 0.5rem)"
          : "max(env(safe-area-inset-bottom, 0px) + 1rem, 1rem)",
      }}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="flex justify-around items-center pt-2 px-2">
        {navItems.map((item) => (
          <NavButton
            key={item.id}
            item={item}
            isActive={isActive(item.href)}
            onClick={() => handleNavigation(item.href)}
          />
        ))}
      </div>
    </nav>
  );
}
