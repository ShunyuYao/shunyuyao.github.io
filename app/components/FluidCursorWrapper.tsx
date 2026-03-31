"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";

const LazyFluidCursor = dynamic(() => import("@/app/components/FluidCursor"), {
  ssr: false,
});

function useIsCoarsePointer() {
  return typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;
}

export default function FluidCursorWrapper() {
  const isCoarse = useIsCoarsePointer();
  const [isInteracted, setIsInteracted] = useState(false);

  const handleInteraction = useCallback(() => setIsInteracted(true), []);

  useEffect(() => {
    if (isCoarse) {
      // Mobile: listen for first touch
      window.addEventListener("touchstart", handleInteraction, { once: true });
      return () => window.removeEventListener("touchstart", handleInteraction);
    }

    // Desktop: defer until first mousemove
    window.addEventListener("mousemove", handleInteraction, { once: true });
    return () => window.removeEventListener("mousemove", handleInteraction);
  }, [isCoarse, handleInteraction]);

  if (!isInteracted) return null;

  return <LazyFluidCursor />;
}
