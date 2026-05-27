"use client";

/**
 * @fileoverview Custom React hook for scroll-triggered reveal animations.
 * Uses the Intersection Observer API to detect when elements enter the viewport and appends CSS active states.
 */

import { useEffect, useRef } from 'react';

/**
 * Observes a target element's visibility in the viewport. When visible,
 * appends active CSS transition classes to reveal base elements.
 * @param {object} [options] - Configuration options for the Intersection Observer.
 * @param {number} [options.threshold=0.1] - Percentage of visibility needed to trigger (0.0 to 1.0).
 * @param {boolean} [options.triggerOnce=true] - Whether to stop observing after the initial reveal.
 * @returns {React.RefObject} Ref object to be attached to the DOM element to observe.
 */
export function useScrollReveal(options = { threshold: 0.1, triggerOnce: true }) {
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Locate all target descendant elements that support scroll reveal transitions
            const elements = entry.target.querySelectorAll('.reveal-base');
            // Delay state application by double-frame animation frames to ensure initial opacity paint is registered
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
             // Reset visibility state if triggerOnce is explicitly disabled
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
