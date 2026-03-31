"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const LazyFluidCursor = dynamic(() => import("@/app/components/FluidCursor"), {
  ssr: false,
});

export default function FluidCursorWrapper() {
  const [isInteracted, setIsInteracted] = useState(false);

  useEffect(() => {
    // Mobile: mount immediately since touch is the primary input
    if (window.matchMedia("(pointer: coarse)").matches) {
      setIsInteracted(true);
      return;
    }

    // Desktop: defer until first mousemove
    const handleMouseMove = () => setIsInteracted(true);
    window.addEventListener("mousemove", handleMouseMove, { once: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  if (!isInteracted) return null;

  return <LazyFluidCursor />;
}
