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
  const [isReady, setIsReady] = useState(false);

  const handleInteraction = useCallback(() => setIsReady(true), []);

  useEffect(() => {
    if (isCoarse) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time init, no cascading render
      setIsReady(true);
      return;
    }

    // Desktop: defer until first mousemove
    window.addEventListener("mousemove", handleInteraction, { once: true });
    return () => window.removeEventListener("mousemove", handleInteraction);
  }, [isCoarse, handleInteraction]);

  if (!isReady) return null;

  return <LazyFluidCursor />;
}
