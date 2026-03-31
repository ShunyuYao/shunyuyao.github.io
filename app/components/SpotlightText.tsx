"use client";

import { useRef, useCallback, useState } from "react";

interface SpotlightTextProps {
  children: React.ReactNode;
  className?: string;
}

export function SpotlightText({ children, className = "" }: SpotlightTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [touching, setTouching] = useState(false);

  const updateSpot = useCallback((clientX: number, clientY: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--spot-x", `${clientX - rect.left}px`);
    el.style.setProperty("--spot-y", `${clientY - rect.top}px`);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    updateSpot(e.clientX, e.clientY);
  }, [updateSpot]);

  const handleTouchStart = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    updateSpot(touch.clientX, touch.clientY);
    setTouching(true);
  }, [updateSpot]);

  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    updateSpot(touch.clientX, touch.clientY);
  }, [updateSpot]);

  const handleTouchEnd = useCallback(() => {
    setTouching(false);
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      className={`group relative inline-block cursor-default ${className}`}
    >
      {/* Always-visible dim silhouette */}
      <span className="select-none text-transparent bg-clip-text bg-[var(--foreground)]/[0.06]">
        {children}
      </span>

      {/* Spotlight layer — revealed on hover (desktop) or touch (mobile) */}
      <span
        aria-hidden="true"
        className={`absolute inset-0 select-none text-[var(--foreground)] transition-opacity duration-300 ${touching ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
        style={{
          maskImage:
            "radial-gradient(circle 80px at var(--spot-x, 50%) var(--spot-y, 50%), black 30%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(circle 80px at var(--spot-x, 50%) var(--spot-y, 50%), black 30%, transparent 100%)",
        }}
      >
        {children}
      </span>
    </div>
  );
}
