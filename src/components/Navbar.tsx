"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-200"
      style={{
        background: scrolled ? "rgba(255,255,255,0.95)" : "#ffffff",
        backdropFilter: scrolled ? "blur(8px)" : "none",
        borderBottom: "1px solid #e5e7eb",
        boxShadow: scrolled ? "0 1px 8px rgba(0,0,0,0.06)" : "none",
      }}
    >
      <nav
        className="mx-auto flex items-center justify-between"
        style={{ maxWidth: 1040, height: 60, padding: "0 24px" }}
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 no-underline">
          <div
            className="flex items-center justify-center rounded-lg"
            style={{ width: 30, height: 30, background: "#4f46e5" }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
          </div>
          <span
            className="text-base font-semibold tracking-tight"
            style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#111827" }}
          >
            Recall<span style={{ color: "#4f46e5" }}>AI</span>
          </span>
        </Link>

        {/* Nav links — desktop only */}
        <div className="hidden md:flex items-center" style={{ gap: 28 }}>
          <a href="#features" className="text-sm font-medium no-underline transition-colors" style={{ color: "#6b7280" }}
            onMouseEnter={e => (e.currentTarget.style.color = "#111827")}
            onMouseLeave={e => (e.currentTarget.style.color = "#6b7280")}>
            Features
          </a>
          <a href="#how-it-works" className="text-sm font-medium no-underline transition-colors" style={{ color: "#6b7280" }}
            onMouseEnter={e => (e.currentTarget.style.color = "#111827")}
            onMouseLeave={e => (e.currentTarget.style.color = "#6b7280")}>
            How it works
          </a>
        </div>

        {/* CTA button */}
        <a
          href="#generate"
          className="no-underline rounded-lg text-sm font-semibold text-white transition-all"
          style={{ background: "#4f46e5", padding: "8px 18px" }}
          onMouseEnter={e => (e.currentTarget.style.background = "#4338ca")}
          onMouseLeave={e => (e.currentTarget.style.background = "#4f46e5")}
        >
          Get Started
        </a>
      </nav>
    </header>
  );
}
