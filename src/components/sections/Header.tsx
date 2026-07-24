"use client";

import React, { useState, useEffect, startTransition, useSyncExternalStore } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import logoImg from "@/logo/logo-for-dark-bg.png";
import logoImgLight from "@/logo/fulllogo.webp";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLightBg, setIsLightBg] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  // Subscribe to document.body class changes using React's built-in external store hook
  // This avoids calling setState inside a MutationObserver callback (lint error fix)
  const showNav = useSyncExternalStore(
    (onStoreChange) => {
      const observer = new MutationObserver(onStoreChange);
      observer.observe(document.body, {
        attributes: true,
        attributeFilter: ["class"],
      });
      return () => observer.disconnect();
    },
    () => document.body.classList.contains("show-nav"),
    // Server-side snapshot — no document available, default to false
    () => false,
  );

  // Fallback: show nav after a short delay even if body class isn't set yet
  useEffect(() => {
    if (!document.body.classList.contains("show-nav")) {
      const fallback = setTimeout(() => {
        document.body.classList.add("show-nav");
      }, 2000);
      return () => clearTimeout(fallback);
    }
  }, []);

  // Trigger capsule expansion after header slides in from top
  useEffect(() => {
    if (showNav) {
      const timer = setTimeout(() => {
        startTransition(() => {
          setIsExpanded(true);
        });
      }, 700);
      return () => clearTimeout(timer);
    } else {
      startTransition(() => {
        setIsExpanded(false);
      });
    }
  }, [showNav]);

  useEffect(() => {
    const updateThemeAndScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);

      // Check all sections with data-theme-section="white"
      const whiteSections = document.querySelectorAll('[data-theme-section="white"]');
      let isOverWhite = false;

      whiteSections.forEach((sec, idx) => {
        const rect = sec.getBoundingClientRect();
        // Add a ~14-line (~380px) scroll delay on the first white section before triggering light theme navbar
        if (idx === 0) {
          if (rect.top <= 0 && rect.bottom > 80) {
            isOverWhite = true;
          }
        } else {
          if (rect.top < window.innerHeight * 0.7 && rect.bottom > 80) {
            isOverWhite = true;
          }
        }
      });

      setIsLightBg(isOverWhite);
    };

    updateThemeAndScroll();
    window.addEventListener("scroll", updateThemeAndScroll, { passive: true });
    window.addEventListener("resize", updateThemeAndScroll);

    return () => {
      window.removeEventListener("scroll", updateThemeAndScroll);
      window.removeEventListener("resize", updateThemeAndScroll);
    };
  }, []);

  const isHeaderVisible = showNav && (scrollY <= 60 || isLightBg);

  const navLinks = [
    { name: "Work", href: "#work" },
    { name: "Services", href: "#services" },
    { name: "Process", href: "#process" },
    { name: "About", href: "#about" },
    { name: "Careers", href: "/career" },
  ];

  return (
    <div
      className={`fixed top-3 left-0 w-full flex justify-center z-50 transition-all duration-1000 cubic-bezier(.2,.8,.2,1) ${
        isHeaderVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 -translate-y-24 pointer-events-none"
      }`}
    >
      <motion.div
        layout
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 15,
        }}
        className={`relative flex items-center justify-between rounded-full border backdrop-blur-[16px] transition-all duration-500 ease-in-out ${
          isLightBg
            ? "border-black/10 bg-white/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),0_8px_32px_rgba(0,0,0,0.06)]"
            : "border-white/10 bg-black/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),0_8px_32px_rgba(0,0,0,0.35)]"
        } ${
          isExpanded
            ? "w-[96%] md:w-[92%] max-w-[1300px] h-[64px]"
            : "w-[320px] h-[50px]"
        }`}
        role="navigation"
      >
        {/* Logo container (cross-fading absolute elements to avoid layout shifts) */}
        <motion.a
          layout
          href="#"
          className="absolute left-6 md:left-12 top-1/2 -translate-y-1/2 flex items-center shrink-0 z-10 w-[180px] h-[60px]"
        >
          <Image
            src={logoImg}
            alt="CureLogics Logo"
            height={60}
            priority
            className={`absolute inset-0 h-[60px] w-auto object-contain max-h-none select-none pointer-events-none transition-opacity duration-500 ${
              isLightBg ? "opacity-0" : "opacity-100"
            }`}
          />
          <Image
            src={logoImgLight}
            alt="CureLogics Logo"
            height={60}
            priority
            className={`absolute inset-0 h-[60px] w-auto object-contain max-h-none select-none pointer-events-none transition-opacity duration-500 ${
              isLightBg ? "opacity-100" : "opacity-0"
            }`}
          />
        </motion.a>

        {/* Desktop nav links container - centered inside the capsule */}
        <div className="flex-1 flex justify-center overflow-hidden h-full items-center">
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -5 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -5 }}
                transition={{ delay: 0.15, duration: 0.3 }}
                className="hidden sm:flex items-center gap-9"
              >
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className={`transition-colors duration-300 text-[0.88rem] font-sans font-medium no-underline ${
                      isLightBg
                        ? "text-black hover:text-[#4a5568]"
                        : "text-[#8b96ac] hover:text-[#eaf1fb]"
                    }`}
                  >
                    {link.name}
                  </a>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Desktop CTA (Book a Call) / Mobile Hamburger toggle (Absolute positioned right) */}
        <div className="absolute right-6 md:right-12 top-1/2 -translate-y-1/2 flex items-center shrink-0 z-10">
          {/* Desktop CTA */}
          <motion.div layout className="hidden md:block">
            <a
              href="#contact"
              className={`text-[0.88rem] font-medium px-6 py-2.5 rounded-full border transition-all duration-300 whitespace-nowrap ${
                isLightBg
                  ? "text-black border-transparent bg-white/90 hover:bg-white"
                  : "text-white border-white/10 bg-white/[0.045] hover:bg-white/[0.07] hover:border-[#35d0ff]/40"
              }`}
            >
              Book a call
            </a>
          </motion.div>

          {/* Mobile Hamburger toggle - only shown when expanded on mobile */}
          {isExpanded && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => setIsOpen(!isOpen)}
              className="flex flex-col gap-1 md:hidden focus:outline-none p-2"
              aria-label="Toggle Navigation"
            >
              <span
                className={`h-[1.5px] w-5 transition-all duration-300 ${
                  isLightBg ? "bg-black" : "bg-[#eaf1fb]"
                } ${isOpen ? "rotate-45 translate-y-[5px]" : ""}`}
              />
              <span
                className={`h-[1.5px] w-5 transition-all duration-300 ${
                  isLightBg ? "bg-black" : "bg-[#eaf1fb]"
                } ${isOpen ? "opacity-0" : ""}`}
              />
              <span
                className={`h-[1.5px] w-5 transition-all duration-300 ${
                  isLightBg ? "bg-black" : "bg-[#eaf1fb]"
                } ${isOpen ? "-rotate-45 -translate-y-[5px]" : ""}`}
              />
            </motion.button>
          )}
        </div>

        {/* Mobile Menu Panel */}
        <AnimatePresence>
          {isOpen && isExpanded && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="absolute top-[125%] left-0 w-full backdrop-blur-lg bg-black/90 border border-white/10 flex flex-col items-center py-6 gap-5 rounded-[24px] shadow-2xl md:hidden z-40"
            >
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`text-[17px] transition-colors duration-300 no-underline font-sans ${
                    isLightBg
                      ? "text-black hover:text-[#eaf1fb]"
                      : "text-[#8b96ac] hover:text-[#eaf1fb]"
                  }`}
                >
                  {link.name}
                </a>
              ))}
              <a
                href="#contact"
                onClick={() => setIsOpen(false)}
                className={`text-[15px] font-semibold px-6 py-2.5 rounded-full transition-colors duration-300 ${
                  isLightBg
                    ? "bg-white text-black hover:bg-white/90"
                    : "bg-gradient-to-r from-[#35d0ff] to-[#8b7bff] text-[#031018]"
                }`}
              >
                Book a call
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
