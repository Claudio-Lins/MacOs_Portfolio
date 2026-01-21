"use client";

import { dockApps } from "@/constants";
import { cn } from "@/lib/utils";
import useWindowStore from "@/store/window";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";
import { useRef } from "react";
import { Tooltip } from "react-tooltip";

export function Dock() {
  const { openWindow, closeWindow, windows } = useWindowStore();
  const dockRef = useRef<HTMLDivElement>(null);
  type WindowKey = Parameters<typeof openWindow>[0];
  type DockApp = {
    id: string;
    name: string;
    icon: string;
    canOpen: boolean;
  };

  function isWindowKey(value: string): value is WindowKey {
    return Object.hasOwn(windows, value);
  }

  useGSAP(function handleDockAnimation() {
    const dockElement = dockRef.current;
    if (!dockElement) return;
    const dockElementCurrent = dockElement as HTMLDivElement;

    const icons = dockElementCurrent.querySelectorAll(".dock-icon-wrapper");

    function animateIcons(mouseX: number) {
      const { left } = dockElementCurrent.getBoundingClientRect();

      icons.forEach(function handleIcon(icon) {
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
    }

    function handleMouseMove(e: MouseEvent) {
      const { left } = dockElementCurrent.getBoundingClientRect();

      animateIcons(e.clientX - left);
    }

    function resetIcons() {
      icons.forEach(function handleReset(icon) {
        gsap.to(icon, {
          scale: 1,
          y: 0,
          duration: 0.3,
          ease: "power1.out",
        });
      });
    }
    dockElementCurrent.addEventListener("mousemove", handleMouseMove);
    dockElementCurrent.addEventListener("mouseleave", resetIcons);

    return () => {
      dockElementCurrent.removeEventListener("mousemove", handleMouseMove);
      dockElementCurrent.removeEventListener("mouseleave", resetIcons);
    };
  }, []);

  function toggleDockApp(app: DockApp) {
    if (!app.canOpen) return;

    if (!isWindowKey(app.id)) return;
    const dockWindow = windows[app.id];
    if (dockWindow.isOpen) {
      closeWindow(app.id);
    } else {
      openWindow(app.id);
    }

    console.log(windows);
  }

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
