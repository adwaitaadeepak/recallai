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
        background: scrolled ? "rgba(8, 12, 30, 0.92)" : "rgba(8, 12, 30, 0.75)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
        boxShadow: scrolled ? "0 4px 24px -2px rgba(0,0,0,0.4)" : "none",
      }}
    >
      <nav
        className="mx-auto flex items-center justify-between"
        style={{ maxWidth: 1040, height: 64, padding: "0 24px" }}
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 no-underline">
          <div
            className="flex items-center justify-center rounded-xl shadow-lg shadow-indigo-500/20"
            style={{ width: 32, height: 32, background: "linear-gradient(135deg, #5c52ff 0%, #4338ca 100%)" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
          </div>
          <span
            className="text-base font-bold tracking-tight"
            style={{ fontFamily: "'Unbounded', sans-serif", color: "#ffffff", fontSize: "0.95rem" }}
          >
            Recall<span style={{ color: "#5c52ff" }}>AI</span>
          </span>
        </Link>

        {/* Nav links */}
        <div className="flex items-center" style={{ gap: 28 }}>
          <a href="#features" className="text-sm font-semibold no-underline transition-colors" style={{ color: "#94a3b8" }}
            onMouseEnter={e => (e.currentTarget.style.color = "#ffffff")}
            onMouseLeave={e => (e.currentTarget.style.color = "#94a3b8")}>
            Features
          </a>
          <a href="#how-it-works" className="text-sm font-semibold no-underline transition-colors" style={{ color: "#94a3b8" }}
            onMouseEnter={e => (e.currentTarget.style.color = "#ffffff")}
            onMouseLeave={e => (e.currentTarget.style.color = "#94a3b8")}>
            How it works
          </a>
        </div>
      </nav>
    </header>
  );
}
