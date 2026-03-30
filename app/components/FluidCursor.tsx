"use client";

import { useEffect } from "react";
import fluidCursor from "@/lib/hooks/useFluidCursor";

export default function FluidCursor() {
  useEffect(() => {
    fluidCursor();
  }, []);

  return (
    <div className="fixed inset-0 z-[2] pointer-events-none">
      <canvas id="fluid" className="w-full h-full" style={{ pointerEvents: "none" }} />
    </div>
  );
}
