"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ArrowUpRight, PlaneTakeoff, RadioTower, ShieldCheck } from "lucide-react";
import type { DemoRole } from "@/lib/auth/demo-session";
import { DemoSessionActions } from "@/components/layout/demo-session-actions";

import "./card-nav.css";

type CardNavLink = { label: string; href: string; ariaLabel?: string };
type CardNavItem = { label: string; bgColor: string; textColor: string; links: CardNavLink[] };

const sectionMarks = [
  { code: "HQ / CMD", icon: ShieldCheck },
  { code: "AIRFRAME", icon: PlaneTakeoff },
  { code: "INTEL / OPS", icon: RadioTower },
];

type CardNavProps = {
  logo: string;
  logoAlt?: string;
  items: CardNavItem[];
  buttonLabel?: string;
  baseColor?: string;
  menuColor?: string;
  buttonBgColor?: string;
  buttonTextColor?: string;
  ease?: string;
  sessionRole?: DemoRole;
};

export function CardNav({
  logo,
  logoAlt = "Aeropulse",
  items,
  buttonLabel = "HQ command",
  baseColor = "#ffffff",
  menuColor = "#0b1f33",
  buttonBgColor = "#0b1f33",
  buttonTextColor = "#ffffff",
  ease = "power3.out",
  sessionRole,
}: CardNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useLayoutEffect(() => {
    if (!navRef.current) return;
    const calculateHeight = () => {
      if (!navRef.current) return 260;
      if (window.matchMedia("(max-width: 768px)").matches) return sessionRole ? 500 : 430;
      return sessionRole ? 320 : 260;
    };
    const timeline = gsap.timeline({ paused: true });
    gsap.set(navRef.current, { height: 60, overflow: "hidden" });
    gsap.set(cardsRef.current, { y: 50, opacity: 0 });
    timeline.to(navRef.current, { height: calculateHeight, duration: 0.4, ease });
    timeline.to(cardsRef.current, { y: 0, opacity: 1, duration: 0.4, ease, stagger: 0.08 }, "-=0.1");
    timelineRef.current = timeline;

    return () => {
      timeline.kill();
      timelineRef.current = null;
    };
  }, [ease, items, sessionRole]);

  function toggleMenu() {
    const timeline = timelineRef.current;
    if (!timeline) return;
    if (!isOpen) {
      setIsOpen(true);
      timeline.play(0);
    } else {
      timeline.eventCallback("onReverseComplete", () => setIsOpen(false));
      timeline.reverse();
    }
  }

  return (
    <div className="card-nav-container">
      <nav ref={navRef} className={`card-nav ${isOpen ? "open" : ""} ${sessionRole ? "has-session" : ""}`} style={{ backgroundColor: baseColor }}>
        <div className="card-nav-top">
          <div className="card-nav-command">
            <button type="button" className={`hamburger-menu ${isOpen ? "open" : ""}`} onClick={toggleMenu} aria-label={isOpen ? "Close menu" : "Open menu"} aria-expanded={isOpen} style={{ color: menuColor }}>
              <span className="hamburger-line" /><span className="hamburger-line" />
            </button>
            <span className="card-nav-command-label"><RadioTower className="size-3.5" />AIR COMMAND</span>
          </div>
          <div className="logo-container"><Image src={logo} alt={logoAlt} width={160} height={40} className="logo" /></div>
          <span className="card-nav-cta-button" style={{ backgroundColor: buttonBgColor, color: buttonTextColor }}>{buttonLabel}</span>
        </div>
        <div className="card-nav-content" aria-hidden={!isOpen}>
          {items.slice(0, 3).map((item, index) => (
            <div key={item.label} className="nav-card" ref={(element) => { if (element) cardsRef.current[index] = element; }} style={{ backgroundColor: item.bgColor, color: item.textColor }}>
              <div className="nav-card-mark">{(() => { const Mark = sectionMarks[index].icon; return <Mark className="size-3.5" />; })()}<span>{sectionMarks[index].code}</span></div>
              <div className="nav-card-label">{item.label}</div>
              <div className="nav-card-links">{item.links.map((link) => <a key={link.label} className="nav-card-link" href={link.href} aria-label={link.ariaLabel}>{link.label}<ArrowUpRight className="size-4" /></a>)}</div>
            </div>
          ))}
        </div>
        {sessionRole && <div className="card-nav-session" aria-hidden={!isOpen}><DemoSessionActions role={sessionRole} /></div>}
      </nav>
    </div>
  );
}
