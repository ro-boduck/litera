"use client";

import { useEffect, useRef } from 'react';

/**
 * Hook to trigger animations when elements scroll into view.
 * Attach the returned ref to a container element.
 * 
 * Elements inside the container with `.reveal-base` will have the `.is-revealed` class
 * added when the container enters the viewport, triggering their CSS transitions.
 */
export function useScrollReveal(options = { threshold: 0.1, triggerOnce: true }) {
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Find all revealable children
            const elements = entry.target.querySelectorAll('.reveal-base');
            // Delay class addition to ensure the browser paints the initial state (opacity: 0)
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                if (entry.target.classList.contains('reveal-base')) {
                  entry.target.classList.add('is-revealed');
                }
                
                elements.forEach((el) => {
                  el.classList.add('is-revealed');
                });
              });
            });

            if (options.triggerOnce) {
              observer.unobserve(entry.target);
            }
          } else if (!options.triggerOnce) {
             // Optional: remove class if we want it to animate every time it enters
             const elements = entry.target.querySelectorAll('.reveal-base');
             if (entry.target.classList.contains('reveal-base')) {
               entry.target.classList.remove('is-revealed');
             }
             elements.forEach((el) => {
               el.classList.remove('is-revealed');
             });
          }
        });
      },
      {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: options.threshold,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [options.threshold, options.triggerOnce]);

  return ref;
}
