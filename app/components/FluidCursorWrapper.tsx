"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const LazyFluidCursor = dynamic(() => import("@/app/components/FluidCursor"), {
  ssr: false,
});

export default function FluidCursorWrapper() {
  const [isInteracted, setIsInteracted] = useState(false);

  useEffect(() => {
    // On touch devices, load immediately (ambient animation, no interaction needed)
    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
    if (isTouchDevice) {
      requestAnimationFrame(() => setIsInteracted(true));
      return;
    }

    // On desktop, wait for first mouse move
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
