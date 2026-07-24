"use client";

import Header from "@/components/sections/Header";
import CareerHero from "@/components/sections/CareerHero";
import ThreeDStars from "@/components/ui/ThreeDStars";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { Brain, Rocket, HeartHandshake, Sparkles } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const values = [
  {
    icon: Brain,
    title: "Think Deeply",
    description:
      "We sweat the details that others skip. Engineering decisions are made with intent, not inertia.",
  },
  {
    icon: Rocket,
    title: "Ship Relentlessly",
    description:
      "Bias toward action. We get working software in front of real users fast, then iterate.",
  },
  {
    icon: HeartHandshake,
    title: "Own the Outcome",
    description:
      "We don't hand off problems. We stay with them until the result is right for the people we serve.",
  },
  {
    icon: Sparkles,
    title: "Stay Curious",
    description:
      "The best work comes from people who keep learning. We make time and space for it.",
  },
];

export default function CareerPage() {
  const valuesRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const cards = valuesRef.current?.querySelectorAll(".value-card");
      if (!cards) return;
      cards.forEach((card) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      });
    },
    { scope: valuesRef, dependencies: [] }
  );

  return (
    <main className="relative flex flex-col w-full min-h-screen bg-black overflow-x-hidden">
      <ThreeDStars />
      <Header />
      <CareerHero />

      <section className="relative z-40 w-full bg-[#05070c] py-28 px-6 md:px-16 flex flex-col items-center">
        <div className="max-w-6xl w-full">
          <div className="text-center mb-20">
            <span className="font-mono text-xs uppercase tracking-widest text-[#35d0ff] mb-4 block">
              What we value
            </span>
            <h3 className="font-[var(--font-display)] text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-zinc-50">
              How we work together
            </h3>
          </div>

          <div
            ref={valuesRef}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {values.map((v) => {
              const Icon = v.icon;
              return (
                <div
                  key={v.title}
                  className="value-card group relative rounded-2xl border border-white/10 bg-white/[0.045] p-7 transition-all duration-500 hover:border-[#35d0ff]/40 hover:bg-white/[0.07]"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#35d0ff]/20 to-[#8b7bff]/20 flex items-center justify-center mb-5 transition-transform duration-500 group-hover:scale-110">
                    <Icon className="w-6 h-6 text-[#35d0ff]" />
                  </div>
                  <h4 className="font-[var(--font-display)] text-lg font-semibold text-zinc-50 mb-2">
                    {v.title}
                  </h4>
                  <p className="text-sm text-[#8b96ac] leading-relaxed">
                    {v.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
