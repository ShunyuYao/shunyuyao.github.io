"use client";

import { useEffect } from "react";
import fluidCursor from "@/lib/hooks/useFluidCursor";

export default function FluidCursor() {
  const isMobile = typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;

  useEffect(() => {
    fluidCursor();
  }, []);

  if (isMobile) {
    // Absolute positioning: scrolls with page, limited to hero area
    return (
      <div className="absolute top-0 left-0 w-full h-[80vh] z-[2] pointer-events-none">
        <canvas id="fluid" className="w-full h-full" style={{ pointerEvents: "none" }} />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[2] pointer-events-none">
      <canvas id="fluid" className="w-full h-full" style={{ pointerEvents: "none" }} />
    </div>
  );
}
