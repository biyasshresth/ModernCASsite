import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";

import "./cas-portfolio.css";
import WebGLBackground from "./components/Webglbackground";
import HeroSection from "./components/HeroSection";
import NavBar from "./components/Navbar";
import SystemPage from "./components/Systempage";
import ModulesPage from "./components/Modulespage";
import MetricsPage from "./components/Metricspage";
import ContactPage from "./components/Contactpage";
import Footer from "./components/Footer";

gsap.registerPlugin(ScrollTrigger);

export default function CASPortfolio() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    /* ================= Smooth scroll (Lenis + ScrollTrigger) ================= */
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    // anchor links
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener("click", (e) => {
        e.preventDefault();
        const href = (a as HTMLAnchorElement).getAttribute("href");
        if (href) lenis.scrollTo(href, { offset: 0 });
      });
    });

    /* ================= WebGL setup ================= */
    const webglSetup = new WebGLBackground(canvas);
    const { tick } = webglSetup;

    /* --- State & scroll tracking --- */
    const state = {
      progress: 0,
      mouseX: 0,
      mouseY: 0,
    };

    ScrollTrigger.create({
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        state.progress = self.progress;
        webglSetup.setScrollProgress(
          state.progress,
          state.mouseX,
          state.mouseY,
        );
      },
    });

    window.addEventListener("pointermove", (e) => {
      state.mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      state.mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
      webglSetup.setScrollProgress(state.progress, state.mouseX, state.mouseY);
    });

    /* --- Render loop --- */
    function animationLoop() {
      tick();
      requestAnimationFrame(animationLoop);
    }
    animationLoop();

    /* --- Window resize --- */
    const handleResize = () => {
      webglSetup.handleResize();
    };
    window.addEventListener("resize", handleResize);

    /* --- GSAP animations --- */
    gsap.from("#hero h1", {
      y: 80,
      opacity: 0,
      duration: 1.2,
      ease: "power3.out",
      delay: 0.2,
    });
    gsap.from("#hero .sub", {
      y: 30,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
      delay: 0.55,
    });
    gsap.fromTo(
      "header",
      { y: -30, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.8 },
    );
    gsap.to("#hero h1, #hero .sub, .scroll-hint", {
      opacity: 0,
      y: -60,
      ease: "none",
      scrollTrigger: {
        trigger: "#hero",
        start: "top top",
        end: "bottom 40%",
        scrub: true,
      },
    });

    document.querySelectorAll("section .reveal").forEach((el) => {
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });
    });

    gsap.utils.toArray<HTMLElement>("#work .card").forEach((card, i) => {
      gsap.fromTo(
        card,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          delay: i * 0.08,
          scrollTrigger: {
            trigger: "#work .grid",
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        },
      );
    });

    document.querySelectorAll("[data-count]").forEach((el) => {
      const target = parseInt((el as HTMLElement).dataset.count || "0", 10);
      const obj = { v: 0 };
      gsap.to(obj, {
        v: target,
        duration: 1.6,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none none",
        },
        onUpdate: () => {
          el.textContent = String(Math.round(obj.v));
        },
      });
    });

    /* --- Cleanup --- */
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("pointermove", () => {});
      lenis.destroy();
      webglSetup.dispose();
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        id="webgl"
        aria-hidden="true"
        style={{ display: "block", position: "fixed", top: 0, left: 0 }}
      />

      <NavBar />

      <main className="content">
        <HeroSection />
        <SystemPage />
        <ModulesPage />
        <MetricsPage />
        <ContactPage />
      </main>

      <Footer />
    </>
  );
}
