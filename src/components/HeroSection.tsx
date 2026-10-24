"use client";

import { Dispatch, SetStateAction, useRef } from "react";
import type { GenerateStatus } from "@/app/page";

interface HeroSectionProps {
  url: string;
  setUrl: Dispatch<SetStateAction<string>>;
  error: string;
  setError: Dispatch<SetStateAction<string>>;
  isLoading: boolean;
  status: GenerateStatus;
  flashcardCount?: number;
  onGenerate: () => void;
  onReset: () => void;
}

export default function HeroSection({
  url,
  setUrl,
  error,
  setError,
  isLoading,
  status,
  flashcardCount = 0,
  onGenerate,
  onReset,
}: HeroSectionProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <section
      id="generate"
      aria-labelledby="hero-headline"
      style={{
        background: "linear-gradient(180deg, #eef2ff 0%, #f8f9fc 100%)",
        paddingTop: 100,
        paddingBottom: 72,
        paddingLeft: 24,
        paddingRight: 24,
      }}
    >
      {/* ── Center column ── */}
      <div style={{ maxWidth: 640, margin: "0 auto" }}>

        {/* Label pill */}
        <div className="flex justify-center" style={{ marginBottom: 20 }}>
          <span
            className="inline-flex items-center gap-1.5 text-xs font-semibold rounded-full"
            style={{
              background: "#eef2ff",
              border: "1px solid #c7d2fe",
              color: "#4f46e5",
              padding: "4px 14px",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            AI-Powered Learning
          </span>
        </div>

        {/* Headline */}
        <h1
          id="hero-headline"
          className="text-center font-bold leading-tight tracking-tight"
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "clamp(2.2rem, 5vw, 3.25rem)",
            color: "#111827",
            marginBottom: 16,
            lineHeight: 1.18,
          }}
        >
          Watch Less.{" "}
          <span style={{ color: "#4f46e5" }}>Remember More.</span>
        </h1>

        {/* Sub-headline */}
        <p
          className="text-center leading-relaxed"
          style={{
            fontSize: "1.0625rem",
            color: "#6b7280",
            marginBottom: 40,
            maxWidth: 500,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          Paste a YouTube URL and RecallAI turns the video into
          ready-to-study flashcards — so every minute you watch counts.
        </p>

        {/* ── Generate card ── */}
        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: 16,
            boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.06)",
            padding: 28,
          }}
        >
          {/* Input label */}
          <label
            htmlFor="youtube-url-input"
            className="block text-sm font-semibold"
            style={{ color: "#374151", marginBottom: 8 }}
          >
            YouTube video URL
          </label>

          {/* Input + button row */}
          <div className="flex flex-col sm:flex-row gap-3" style={{ marginBottom: 12 }}>

            {/* URL input with YouTube icon */}
            <div className="relative flex-1">
              {/* YouTube icon */}
              <span
                className="absolute flex items-center pointer-events-none"
                style={{ left: 12, top: "50%", transform: "translateY(-50%)" }}
                aria-hidden="true"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <rect x="2" y="5" width="20" height="14" rx="3" fill="#FF0000" />
                  <polygon points="10,9 10,15 16,12" fill="white" />
                </svg>
              </span>

              {/* Clear button */}
              {url && !isLoading && (
                <button
                  type="button"
                  onClick={() => { setUrl(""); setError(""); inputRef.current?.focus(); }}
                  aria-label="Clear URL"
                  className="absolute flex items-center justify-center transition-colors"
                  style={{
                    right: 10,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#9ca3af",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 4,
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#374151")}
                  onMouseLeave={e => (e.currentTarget.style.color = "#9ca3af")}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}

              <input
                ref={inputRef}
                id="youtube-url-input"
                type="url"
                value={url}
                onChange={(e) => { setUrl(e.target.value); if (error) setError(""); }}
                onKeyDown={(e) => { if (e.key === "Enter" && !isLoading) onGenerate(); }}
                placeholder="https://www.youtube.com/watch?v=…"
                disabled={isLoading}
                autoComplete="url"
                spellCheck={false}
                aria-label="YouTube video URL"
                aria-invalid={!!error}
                aria-describedby={error ? "url-error" : undefined}
                style={{
                  width: "100%",
                  height: 48,
                  paddingLeft: 44,
                  paddingRight: url ? 36 : 14,
                  paddingTop: 0,
                  paddingBottom: 0,
                  fontSize: "0.9375rem",
                  color: "#111827",
                  background: error ? "#fef2f2" : "#ffffff",
                  border: `1.5px solid ${error ? "#fca5a5" : "#d1d5db"}`,
                  borderRadius: 10,
                  outline: "none",
                  fontFamily: "'Inter', sans-serif",
                  transition: "border-color 0.15s, box-shadow 0.15s",
                }}
                onFocus={e => {
                  e.currentTarget.style.borderColor = "#4f46e5";
                  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(79,70,229,0.12)";
                }}
                onBlur={e => {
                  e.currentTarget.style.borderColor = error ? "#fca5a5" : "#d1d5db";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
            </div>

            {/* Generate button */}
            <button
              id="generate-flashcards-btn"
              type="button"
              onClick={onGenerate}
              disabled={isLoading}
              aria-label="Generate flashcards from this YouTube video"
              className="flex items-center justify-center gap-2 font-semibold text-white transition-all rounded-xl whitespace-nowrap"
              style={{
                background: isLoading ? "#818cf8" : "#4f46e5",
                height: 48,
                padding: "0 22px",
                fontSize: "0.9375rem",
                border: "none",
                cursor: isLoading ? "not-allowed" : "pointer",
                flexShrink: 0,
                boxShadow: isLoading ? "none" : "0 2px 8px rgba(79,70,229,0.25)",
              }}
              onMouseEnter={e => { if (!isLoading) { e.currentTarget.style.background = "#4338ca"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(79,70,229,0.35)"; } }}
              onMouseLeave={e => { if (!isLoading) { e.currentTarget.style.background = "#4f46e5"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(79,70,229,0.25)"; } }}
            >
              {isLoading ? (
                <>
                  <svg className="spin-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                  </svg>
                  Generating…
                </>
              ) : (
                <>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  Generate Flashcards
                </>
              )}
            </button>
          </div>

          {/* Hint text (idle) */}
          {status === "idle" && (
            <p style={{ fontSize: "0.8125rem", color: "#9ca3af" }}>
              Works with youtube.com and youtu.be links · No account needed
            </p>
          )}

          {/* Success banner */}
          {status === "success" && (
            <div
              role="status"
              className="fade-up flex items-center justify-between rounded-lg"
              style={{
                background: "#ecfdf5",
                border: "1px solid #a7f3d0",
                color: "#065f46",
                padding: "10px 14px",
                fontSize: "0.875rem",
                marginTop: 10,
              }}
            >
              <div className="flex items-center gap-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                <span className="font-semibold">
                  {flashcardCount ? `${flashcardCount} flashcards generated!` : "Flashcards generated!"}
                </span>
              </div>
              <button
                type="button"
                onClick={() => document.getElementById("flashcards-results")?.scrollIntoView({ behavior: "smooth" })}
                className="font-semibold underline underline-offset-2 transition-opacity"
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#047857",
                  padding: "4px 8px",
                }}
              >
                View Flashcards ↓
              </button>
            </div>
          )}

          {/* Loading state */}
          {status === "loading" && (
            <p style={{ fontSize: "0.8125rem", color: "#6b7280", marginTop: 8 }}>
              Fetching transcript and generating flashcards…
            </p>
          )}

          {/* Error message */}
          {status === "error" && error && (
            <div
              id="url-error"
              role="alert"
              className="fade-up flex items-start gap-2 rounded-lg"
              style={{
                background: "#fef2f2",
                border: "1px solid #fecaca",
                color: "#dc2626",
                padding: "10px 14px",
                fontSize: "0.875rem",
                marginTop: 10,
              }}
            >
              <svg className="shrink-0 mt-px" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {error}
            </div>
          )}
        </div>

        {/* Trust strip */}
        <div
          className="flex flex-wrap items-center justify-center"
          style={{ gap: "8px 20px", marginTop: 20 }}
        >
          {[
            { icon: "🔒", text: "No signup required" },
            { icon: "✓", text: "Any YouTube video" },
            { icon: "★", text: "Free to use" },
          ].map(({ icon, text }) => (
            <span
              key={text}
              className="flex items-center gap-1.5"
              style={{ fontSize: "0.8125rem", color: "#9ca3af" }}
            >
              <span style={{ fontSize: "0.75rem" }}>{icon}</span>
              {text}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
