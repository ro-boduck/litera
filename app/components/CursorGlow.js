"use client";
import { useEffect, useCallback } from "react";

/**
 * Tracks mouse position on `.hover-glow` elements and sets
 * CSS custom properties `--mouse-x` and `--mouse-y` so the
 * radial-gradient glow follows the cursor.
 *
 * Drop this component once in the root layout.
 */
export default function CursorGlow() {
  const handleMouseMove = useCallback((e) => {
    const cards = document.querySelectorAll(".hover-glow");
    cards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);
    });
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  return null; // No DOM output — pure side-effect
}
