"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { gsap } from "gsap";
import { ArrowLeftRight, ArrowUpRight, PlaneTakeoff, RadioTower, ShieldCheck } from "lucide-react";
import type { DemoRole } from "@/lib/auth/demo-session";
import { getSectionSwitchTarget } from "@/lib/auth/section-switch";
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
  contentSized?: boolean;
};

export function CardNav({
  logo,
  logoAlt = "VAYUNETRA",
  items,
  buttonLabel = "HQ command",
  baseColor = "#ffffff",
  menuColor = "#0b1f33",
  buttonBgColor = "#0b1f33",
  buttonTextColor = "#ffffff",
  ease = "power3.out",
  sessionRole,
  contentSized = false,
}: CardNavProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);
  const [switchError, setSwitchError] = useState("");
  const navRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const switchLockRef = useRef(false);
  const switchTarget = sessionRole ? getSectionSwitchTarget(sessionRole) : null;
  const destinationRole = switchTarget?.role ?? null;
  const destinationPath = switchTarget?.path ?? "/squadron";

  async function switchSection() {
    if (!destinationRole || switchLockRef.current) return;
    switchLockRef.current = true;
    setIsSwitching(true);
    setSwitchError("");

    try {
      const sessionResponse = await fetch("/api/demo-session", {
        method: "GET",
        cache: "no-store",
        credentials: "same-origin",
      });
      if (!sessionResponse.ok) throw new Error("Could not verify section access.");
      const session = await sessionResponse.json() as { enabled?: boolean; role?: DemoRole | null };

      if (session.enabled && session.role === sessionRole) {
        const switchResponse = await fetch("/api/demo-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "same-origin",
          body: JSON.stringify({ role: destinationRole }),
        });
        if (!switchResponse.ok) throw new Error("The preview role could not be switched.");
        const switchedSession = await switchResponse.json() as { role?: DemoRole };
        if (switchedSession.role !== destinationRole) throw new Error("The preview role did not change.");
      } else if (session.enabled && session.role && session.role !== sessionRole) {
        // Leave role enforcement to the existing login/proxy flow for a stale or mismatched session.
        router.replace("/login");
        return;
      }

      // With no preview session, the route proxy retains its existing access-denied redirect.
      router.push(destinationPath);
    } catch {
      setSwitchError("Could not switch sections. Check the connection and try again.");
    } finally {
      switchLockRef.current = false;
      setIsSwitching(false);
    }
  }

  useLayoutEffect(() => {
    if (!navRef.current) return;
    const navElement = navRef.current;
    const cardElements = [...cardsRef.current];
    const calculateHeight = () => {
      if (!navElement) return 260;
      if (window.matchMedia("(max-width: 768px)").matches) return sessionRole ? 500 : 430;
      return sessionRole ? 320 : 260;
    };
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const duration = reduceMotion ? 0 : 0.4;
    const timeline = gsap.timeline({ paused: true });
    gsap.set(navElement, { height: 60, overflow: "hidden" });
    gsap.set(cardElements, { y: 50, opacity: 0 });
    if (!contentSized) {
      timeline.to(navElement, { height: calculateHeight, duration, ease });
      timeline.to(cardElements, { y: 0, opacity: 1, duration, ease, stagger: reduceMotion ? 0 : 0.08 }, reduceMotion ? 0 : "-=0.1");
      timelineRef.current = timeline;
    }

    return () => {
      if (animationFrameRef.current !== null) cancelAnimationFrame(animationFrameRef.current);
      gsap.killTweensOf(navElement);
      gsap.killTweensOf(cardElements);
      timeline.kill();
      timelineRef.current = null;
    };
  }, [contentSized, ease, items, sessionRole]);

  function toggleMenu() {
    const nav = navRef.current;
    if (!nav) return;
    if (!contentSized) {
      const timeline = timelineRef.current;
      if (!timeline) return;
      if (!isOpen) {
        setIsOpen(true);
        timeline.play(0);
      } else {
        timeline.eventCallback("onReverseComplete", () => setIsOpen(false));
        timeline.reverse();
      }
      return;
    }
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!isOpen) {
      setIsOpen(true);
      animationFrameRef.current = requestAnimationFrame(() => {
        const expandedHeight = nav.scrollHeight;
        gsap.killTweensOf(nav);
        gsap.set(nav, { height: 60, overflow: "hidden" });
        gsap.to(nav, {
          height: expandedHeight,
          duration: reduceMotion ? 0 : 0.4,
          ease,
          onComplete: () => gsap.set(nav, { height: "auto", overflow: "visible" }),
        });
        gsap.to(cardsRef.current, { y: 0, opacity: 1, duration: reduceMotion ? 0 : 0.4, ease, stagger: reduceMotion ? 0 : 0.08 });
      });
    } else {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      const currentHeight = nav.getBoundingClientRect().height;
      gsap.killTweensOf(nav);
      gsap.set(nav, { height: currentHeight, overflow: "hidden" });
      gsap.to(nav, {
        height: 60,
        duration: reduceMotion ? 0 : 0.32,
        ease,
        onComplete: () => setIsOpen(false),
      });
      gsap.to(cardsRef.current, { y: 50, opacity: 0, duration: reduceMotion ? 0 : 0.25, ease });
    }
  }

  return (
    <div className={`card-nav-container ${contentSized ? "card-nav-container--content-sized" : ""}`}>
      <nav ref={navRef} aria-label={`${buttonLabel} navigation`} className={`card-nav ${contentSized ? "card-nav--content-sized" : ""} ${isOpen ? "open" : ""} ${sessionRole ? "has-session" : ""}`} style={{ backgroundColor: baseColor }}>
        <div className="card-nav-top">
          <div className="card-nav-command">
            <button type="button" className={`hamburger-menu ${isOpen ? "open" : ""}`} onClick={toggleMenu} aria-label={isOpen ? "Close menu" : "Open menu"} aria-expanded={isOpen} aria-controls="card-nav-content" style={{ color: menuColor }}>
              <span className="hamburger-line" /><span className="hamburger-line" />
            </button>
            <span className="card-nav-command-label"><RadioTower className="size-3.5" />AIR COMMAND</span>
          </div>
          <div className="logo-container"><Image src={logo} alt={logoAlt} width={1031} height={552} className="logo" /><span className="logo-wordmark">VAYUNETRA</span></div>
          {destinationRole ? <button type="button" className="card-nav-cta-button" onClick={switchSection} disabled={isSwitching} aria-label={`Switch to ${destinationRole === "headquarters" ? "Headquarters" : "Squadron Leader"} section`} aria-busy={isSwitching} title={`Switch to ${destinationRole === "headquarters" ? "Headquarters" : "Squadron Leader"}`} style={{ backgroundColor: buttonBgColor, color: buttonTextColor }}>
            <span className="card-nav-cta-label">{isSwitching ? "Switching…" : buttonLabel}</span><ArrowLeftRight className="card-nav-switch-icon" aria-hidden="true" />
          </button> : <span className="card-nav-cta-button" style={{ backgroundColor: buttonBgColor, color: buttonTextColor }}>{buttonLabel}</span>}
        </div>
        <div id="card-nav-content" className="card-nav-content" aria-hidden={!isOpen}>
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
      {switchError && <div className="card-nav-switch-error" role="alert"><span>{switchError}</span><button type="button" onClick={() => setSwitchError("")} aria-label="Dismiss section switch error">×</button></div>}
    </div>
  );
}
