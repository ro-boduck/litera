/**
 * @fileoverview LazyLoad wrapper component using the Intersection Observer API.
 * Defers rendering of off-screen components until they are close to the viewport to optimize initial page loading.
 */

'use client';
import { useState, useEffect, useRef } from 'react';

/**
 * LazyLoad wrapper that delays rendering children until they intersect with the viewport margin.
 * Displays a customizable skeleton or a default shimmer placeholder while loading.
 * @param {object} props
 * @param {React.ReactNode} props.children The children elements to load lazily.
 * @param {string} [props.minHeight='400px'] CSS minimum height for the placeholder container to avoid layout shifts.
 * @param {string} [props.rootMargin='300px'] Intersection Observer margin threshold to pre-load content before it enters the viewport.
 * @param {React.ReactNode} [props.skeleton] Custom skeleton fallback UI to display before intersection.
 */
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
