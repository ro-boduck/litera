"use client";
import { useScrollReveal } from "../hooks/useScrollReveal";

export default function RevealWrapper({ children, className = "", as = "section", ...props }) {
  const revealRef = useScrollReveal();
  const Element = as;
  return (
    <Element ref={revealRef} className={className} {...props}>
      {children}
    </Element>
  );
}
