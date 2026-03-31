"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const LazyFluidCursor = dynamic(() => import("@/app/components/FluidCursor"), {
  ssr: false,
});

export default function FluidCursorWrapper() {
  // Mobile: start as interacted so FluidCursor mounts immediately (animation loop starts on init)
  // Desktop: defer until first mousemove (original behavior)
  const [isInteracted, setIsInteracted] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(pointer: coarse)").matches;
  });

  useEffect(() => {
    if (isInteracted) return;

    // Desktop: defer until first mousemove
    const handleMouseMove = () => setIsInteracted(true);
    window.addEventListener("mousemove", handleMouseMove, { once: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isInteracted]);

  if (!isInteracted) return null;

  return <LazyFluidCursor />;
}
