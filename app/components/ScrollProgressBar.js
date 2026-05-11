"use client";

import { useState, useEffect } from "react";

export function ScrollProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const total = document.documentElement.scrollHeight - window.innerHeight;
          if (total > 0) {
            const pct = Math.min(100, (window.scrollY / total) * 100);
            setProgress(pct);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    // Initial call to set progress if already scrolled down
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-[3px] z-[60]">
      <div
        className="h-full progress-shimmer transition-all duration-75"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
