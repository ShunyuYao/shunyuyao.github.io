"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const LazyFluidCursor = dynamic(() => import("@/app/components/FluidCursor"), {
  ssr: false,
});

export default function FluidCursorWrapper() {
  const [isInteracted, setIsInteracted] = useState(false);

  useEffect(() => {
    // Disable on mobile/touch devices
    const isMobile = window.matchMedia("(pointer: coarse)").matches;
    if (isMobile) return;

    const handleInteraction = () => {
      setIsInteracted(true);
    };

    window.addEventListener("mousemove", handleInteraction, { once: true });

    return () => {
      window.removeEventListener("mousemove", handleInteraction);
    };
  }, []);

  if (!isInteracted) return null;

  return <LazyFluidCursor />;
}
