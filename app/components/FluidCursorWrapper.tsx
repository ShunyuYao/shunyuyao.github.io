"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const LazyFluidCursor = dynamic(() => import("@/app/components/FluidCursor"), {
  ssr: false,
});

export default function FluidCursorWrapper() {
  const [isInteracted, setIsInteracted] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    const touchDevice = window.matchMedia("(pointer: coarse)").matches;
    setIsTouchDevice(touchDevice);

    if (touchDevice) {
      // Mobile: mount immediately so the animation loop can start on init
      setIsInteracted(true);
    } else {
      // Desktop: defer until first mousemove (original behavior)
      const handleMouseMove = () => setIsInteracted(true);
      window.addEventListener("mousemove", handleMouseMove, { once: true });
      return () => window.removeEventListener("mousemove", handleMouseMove);
    }
  }, []);

  if (!isInteracted) return null;

  return <LazyFluidCursor />;
}
