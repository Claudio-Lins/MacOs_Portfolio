"use client";

import { dockApps } from "@/constants";
import { cn } from "@/lib/utils";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";
import { useRef } from "react";
import { Tooltip } from "react-tooltip";

export function Dock() {
  const dockRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const dock = dockRef.current;
    if (!dock) return;

    const icons = dock.querySelectorAll(".dock-icon-wrapper");

    const animateIcons = (mouseX: number) => {
      const { left } = dock.getBoundingClientRect();

      icons.forEach((icon) => {
        const { left: iconLeft, width } = icon.getBoundingClientRect();
        const center = iconLeft - left + width / 2;
        const distance = Math.abs(mouseX - center);
        const intensity = Math.exp(-(distance ** 2.5) / 2000);
        gsap.to(icon, {
          scale: 1 + 0.25 * intensity,
          y: -15 * intensity,
          duration: 0.5,
          ease: "power1.out",
        });
      });
    };
    const handleMouseMove = (e: MouseEvent) => {
      const { left } = dock.getBoundingClientRect();

      animateIcons(e.clientX - left);
    };
    const resetIcons = () =>
      icons.forEach((icon) => {
        gsap.to(icon, {
          scale: 1,
          y: 0,
          duration: 0.3,
          ease: "power1.out",
        });
      });
    dock.addEventListener("mousemove", handleMouseMove);
    dock.addEventListener("mouseleave", resetIcons);

    return () => {
      dock.removeEventListener("mousemove", handleMouseMove);
      dock.removeEventListener("mouseleave", resetIcons);
    };
  }, []);

  function toggleDockApp(app: any) {}

  return (
    <section id="dock" ref={dockRef} className={cn("")}>
      <div className="dock-container">
        {dockApps.map((dock) => (
          <div key={dock.id} className="dock-icon-wrapper">
            <Tooltip id={dock.name} className="tooltip" />
            <button
              type="button"
              className="dock-icon"
              aria-label={dock.name}
              data-tooltip-id={dock.name}
              data-tooltip-content={dock.name}
              data-tooltip-delay-show={150}
              disabled={!dock.canOpen}
              onClick={() => toggleDockApp(dock)}
            >
              <Image
                src={`/images/${dock.icon}`}
                alt={dock.name}
                width={50}
                height={50}
                className={cn("", dock?.canOpen ? "" : "opacity-60")}
              />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
