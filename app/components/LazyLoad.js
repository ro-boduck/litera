'use client';
import { useState, useEffect, useRef } from 'react';

export default function LazyLoad({ children, minHeight = '400px', rootMargin = '300px', skeleton }) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [rootMargin]);

  if (!isIntersecting) {
    if (skeleton) {
      return (
        <div ref={ref} className="w-full relative overflow-hidden">
          {skeleton}
        </div>
      );
    }
    return (
      <div 
        ref={ref} 
        style={{ minHeight }} 
        className="w-full flex items-center justify-center relative overflow-hidden bg-slate-50/50"
      >
        {/* Shimmer Effect */}
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
      </div>
    );
  }

  return <div className="animate-fade-in">{children}</div>;
}
