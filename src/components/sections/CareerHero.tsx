"use client";

import React, { useRef, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const BrainJar = dynamic<React.ComponentProps<typeof import("@/components/ui/BrainJar").default>>(
  () => import("@/components/ui/BrainJar"),
  { ssr: false, loading: () => null }
);

export default function CareerHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasWrapRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const scrollProgressRef = useRef(0);
  const [canvasMounted, setCanvasMounted] = useState(false);

  useGSAP(
    () => {
      const container = containerRef.current;
      const canvasWrap = canvasWrapRef.current;
      const heading = headingRef.current;
      const sub = subRef.current;
      if (!container || !canvasWrap || !heading || !sub) return;

      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger && container.contains(st.trigger as Node)) {
          st.kill();
        }
      });

      const pinTl = gsap.timeline({
        scrollTrigger: {
          id: "career-brain-pin",
          trigger: container,
          start: "top top",
          end: "+=200%",
          pin: true,
          pinSpacing: true,
          scrub: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            scrollProgressRef.current = self.progress;
          },
        },
      });

      pinTl.fromTo(
        canvasWrap,
        { opacity: 0 },
        { opacity: 1, duration: 0.08 },
        0
      );

      pinTl.fromTo(
        [heading, sub],
        { opacity: 0, y: -40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.25,
          ease: "power2.out",
          stagger: 0.04,
        },
        0.62
      );

      pinTl.to({}, { duration: 0.15 }, 0.87);

      requestAnimationFrame(() => ScrollTrigger.refresh());
    },
    { scope: containerRef, dependencies: [] }
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setCanvasMounted(true);
          obs.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    obs.observe(container);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={containerRef}
      id="career-hero"
      className="relative w-full h-screen overflow-hidden bg-[#05070c] z-30"
    >
      <div
        ref={canvasWrapRef}
        className="absolute inset-0 z-10"
        style={{ willChange: "opacity" }}
      >
        {canvasMounted && <BrainJar scrollProgressRef={scrollProgressRef} />}
      </div>

      <div className="absolute inset-x-0 top-0 z-20 flex flex-col items-center pt-[8vh] px-6 pointer-events-none">
        <h2
          ref={headingRef}
          className="font-[var(--font-display)] text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-center text-zinc-50 max-w-4xl leading-[1.12] drop-shadow-[0_4px_18px_rgba(0,0,0,0.7)]"
        >
          Meet the Brilliant Minds Behind{" "}
          <span className="bg-gradient-to-r from-[#35d0ff] to-[#8b7bff] bg-clip-text text-transparent">
            CureLogics&apos; Success
          </span>
        </h2>
        <p
          ref={subRef}
          className="mt-5 text-base sm:text-lg text-[#8b96ac] font-light max-w-xl text-center"
        >
          We&apos;re always looking for curious, driven people to join us.
        </p>
      </div>
    </section>
  );
}
