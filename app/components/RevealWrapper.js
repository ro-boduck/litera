/**
 * @fileoverview Scroll-reveal wrapper component.
 * Integrates with the useScrollReveal hook to automatically register elements for intersection observer entrance transitions.
 */

"use client";
import { useScrollReveal } from "../hooks/useScrollReveal";

/**
 * Wrapper component that automatically triggers entrance transition classes when scrolled into the viewport.
 * @param {object} props
 * @param {React.ReactNode} props.children The target elements to wrap and animate.
 * @param {string} [props.className=""] Additional CSS classes (e.g. reveal-base, reveal-up, delay-1).
 * @param {React.ElementType} [props.as="section"] Custom HTML tag element (e.g. 'div', 'section', 'article').
 * @returns {React.ReactElement} The wrapped HTML element.
 */
export default function RevealWrapper({ children, className = "", as = "section", ...props }) {
  const revealRef = useScrollReveal();
  const Element = as;
  return (
    <Element ref={revealRef} className={className} {...props}>
      {children}
    </Element>
  );
}
