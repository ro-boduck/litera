"use client";
import { useEffect, useCallback } from "react";

/**
 * Tracks mouse coordinates on active glow-enabled containers to dynamically set CSS custom properties.
 * Applies coordinates to hovered elements supporting radial glow effects.
 * @returns {null} Renders no DOM nodes, running as a side-effect.
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

  return null; // Pure side-effect component rendering no DOM elements
}
