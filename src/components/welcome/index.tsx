"use client";

import { cn } from "@/lib/utils";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";

const FONT_WEIGHTS = {
  title: { min: 400, max: 700, default: 400 },
  subtitle: { min: 100, max: 400, default: 100 },
};

function renderText(text: string, className: string, baseWeight: number = 400) {
  return [...text].map((char, index) => (
    <span
      key={index}
      className={className}
      style={{ fontVariationSettings: `'wght' ${baseWeight}` }}
    >
      {char === " " ? "\u00A0" : char}
    </span>
  ));
}

function setupTextHover(
  container: HTMLDivElement | null,
  type: "title" | "subtitle",
) {
  if (!container) return;

  const target = container;
  const letters = target.querySelectorAll("span");
  const { min, max } = FONT_WEIGHTS[type];

  function animateLetter(
    letter: HTMLSpanElement,
    weight: number,
    duration = 0.25,
  ) {
    return gsap.to(letter, {
      duration,
      ease: "power2.out",
      fontVariationSettings: `'wght' ${weight}`,
    });
  }

  function handleMouseMove(e: MouseEvent) {
    const { left } = target.getBoundingClientRect();
    const mouseX = e.clientX - left;

    letters.forEach((letter) => {
      const { left: l, width: w } = letter.getBoundingClientRect();
      const distance = Math.abs(mouseX - (l - left + w / 2));
      const intensity = Math.exp(-(distance ** 2) / 2000);

      animateLetter(letter, min + (max - min) * intensity);
    });
  }

  function handleMouseLeave() {
    letters.forEach((letter) => {
      animateLetter(letter, min, 0.5);
    });
  }

  target.addEventListener("mousemove", handleMouseMove);
  target.addEventListener("mouseleave", handleMouseLeave);

  return () => {
    target.removeEventListener("mousemove", handleMouseMove);
    target.removeEventListener("mouseleave", handleMouseLeave);
  };
}

export function Welcome() {
  const titleRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const titleCleanup = setupTextHover(titleRef.current, "title");
    const subtitleCleanup = setupTextHover(subtitleRef.current, "subtitle");
    return () => {
      titleCleanup?.();
      subtitleCleanup?.();
    };
  }, []);

  return (
    <section id="welcome" className={cn("cursor-pointer")}>
      <p ref={subtitleRef}>
        {renderText(
          "I'm Claudio Lins! Welcome to my",
          "text-3xl font-georama",
          100,
        )}
      </p>
      <h1 ref={titleRef} className="mt-7 ">
        {renderText("portfolio", "text-9xl font-georama italic font-bold")}
      </h1>

      <div className="small-screen">
        <p>This portfolio is designed for desktop and tablet screens.</p>
      </div>
    </section>
  );
}
