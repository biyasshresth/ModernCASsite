import React from "react";

export default function HeroSection() {
  return (
    <section id="hero" aria-label="Hero">
      <img src="/Logo1.png" alt="CAS Logo" className="hero-logo h-96" />
      <div className="scroll-hint">
        Scroll
        <div className="blink-line"></div>
      </div>
    </section>
  );
}