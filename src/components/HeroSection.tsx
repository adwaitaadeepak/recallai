"use client";

import { Dispatch, SetStateAction, useRef } from "react";
import type { GenerateStatus } from "@/app/page";
import type { StudyMode } from "@/app/api/generate/route";

interface HeroSectionProps {
  url: string;
  setUrl: Dispatch<SetStateAction<string>>;
  manualTranscript: string;
  setManualTranscript: Dispatch<SetStateAction<string>>;
  inputTab: "url" | "notes";
  setInputTab: Dispatch<SetStateAction<"url" | "notes">>;
  error: string;
  setError: Dispatch<SetStateAction<string>>;
  isLoading: boolean;
  status: GenerateStatus;
  mode: StudyMode;
  setMode: Dispatch<SetStateAction<StudyMode>>;
  flashcardCount?: number;
  onGenerate: () => void;
  onReset: () => void;
}

export default function HeroSection({
  url,
  setUrl,
  manualTranscript,
  setManualTranscript,
  inputTab,
  setInputTab,
  error,
  setError,
  isLoading,
  status,
  mode,
  setMode,
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
        background: "radial-gradient(ellipse 80% 60% at 50% -15%, rgba(92, 82, 255, 0.28), rgba(8, 12, 30, 0)), #080c1e",
        paddingTop: 104,
        paddingBottom: 76,
        paddingLeft: 24,
        paddingRight: 24,
      }}
    >
      {/* ── Center column ── */}
      <div style={{ maxWidth: 660, margin: "0 auto" }}>

        {/* Label pill */}
        <div className="flex justify-center" style={{ marginBottom: 20 }}>
          <span
            className="inline-flex items-center gap-2 text-xs font-bold rounded-full font-mono-accent"
            style={{
              background: "rgba(92, 82, 255, 0.12)",
              border: "1px solid rgba(92, 82, 255, 0.35)",
              color: "#a5b4fc",
              padding: "5px 16px",
              letterSpacing: "0.05em",
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
            fontFamily: "'Unbounded', sans-serif",
            fontSize: "clamp(2rem, 4.5vw, 2.85rem)",
            color: "#ffffff",
            marginBottom: 16,
            lineHeight: 1.22,
          }}
        >
          Watch Less.{" "}
          <span style={{
            background: "linear-gradient(135deg, #a5b4fc 0%, #c084fc 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>Remember More.</span>
        </h1>

        {/* Sub-headline */}
        <p
          className="text-center leading-relaxed"
          style={{
            fontSize: "1.0625rem",
            color: "#94a3b8",
            marginBottom: 36,
            maxWidth: 520,
            marginLeft: "auto",
            marginRight: "auto",
            fontFamily: "'Nunito', sans-serif",
          }}
        >
          Paste a YouTube URL and RecallAI turns the video into
          ready-to-study flashcards — so every minute you watch counts.
        </p>

        {/* ── Generate card ── */}
        <div
          style={{
            background: "rgba(14, 19, 43, 0.88)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            borderRadius: 24,
            boxShadow: "0 24px 60px -12px rgba(0, 0, 0, 0.6), 0 0 40px rgba(92, 82, 255, 0.12)",
            padding: 30,
          }}
        >
          {/* Source Mode Tabs */}
          <div
            className="flex items-center rounded-xl p-1.5"
            style={{
              background: "rgba(8, 12, 30, 0.8)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              marginBottom: 20,
              gap: 6,
            }}
          >
            <button
              type="button"
              onClick={() => { setInputTab("url"); setError(""); }}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-bold transition-all"
              style={{
                background: inputTab === "url" ? "rgba(92, 82, 255, 0.28)" : "transparent",
                color: inputTab === "url" ? "#ffffff" : "#94a3b8",
                border: inputTab === "url" ? "1px solid rgba(92, 82, 255, 0.45)" : "1px solid transparent",
                boxShadow: inputTab === "url" ? "0 0 16px rgba(92, 82, 255, 0.3)" : "none",
                cursor: "pointer",
              }}
            >
              <span>📺</span> YouTube URL
            </button>
            <button
              type="button"
              onClick={() => { setInputTab("notes"); setError(""); }}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-bold transition-all"
              style={{
                background: inputTab === "notes" ? "rgba(92, 82, 255, 0.28)" : "transparent",
                color: inputTab === "notes" ? "#ffffff" : "#94a3b8",
                border: inputTab === "notes" ? "1px solid rgba(92, 82, 255, 0.45)" : "1px solid transparent",
                boxShadow: inputTab === "notes" ? "0 0 16px rgba(92, 82, 255, 0.3)" : "none",
                cursor: "pointer",
              }}
            >
              <span>📝</span> Paste Notes / Transcript
            </button>
          </div>

          {inputTab === "url" ? (
            <>
              {/* Input label */}
              <label
                htmlFor="youtube-url-input"
                className="block text-sm font-semibold"
                style={{ color: "#e2e8f0", marginBottom: 8 }}
              >
                YouTube video URL
              </label>

              {/* URL input with YouTube icon */}
              <div className="relative" style={{ marginBottom: 12 }}>
                {/* YouTube icon */}
                <span
                  className="absolute flex items-center pointer-events-none"
                  style={{ left: 14, top: "50%", transform: "translateY(-50%)" }}
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
                      right: 12,
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#94a3b8",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: 4,
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#ffffff")}
                    onMouseLeave={e => (e.currentTarget.style.color = "#94a3b8")}
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
                    height: 50,
                    paddingLeft: 44,
                    paddingRight: url ? 38 : 14,
                    paddingTop: 0,
                    paddingBottom: 0,
                    fontSize: "0.9375rem",
                    color: "#ffffff",
                    background: error ? "rgba(239, 68, 68, 0.15)" : "#080c1e",
                    border: `1.5px solid ${error ? "#f87171" : "rgba(255, 255, 255, 0.15)"}`,
                    borderRadius: 12,
                    outline: "none",
                    fontFamily: "'Nunito', sans-serif",
                    transition: "border-color 0.15s, box-shadow 0.15s",
                  }}
                  onFocus={e => {
                    e.currentTarget.style.borderColor = "#5c52ff";
                    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(92, 82, 255, 0.25)";
                  }}
                  onBlur={e => {
                    e.currentTarget.style.borderColor = error ? "#f87171" : "rgba(255, 255, 255, 0.15)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
              </div>
            </>
          ) : (
            <div style={{ marginBottom: 18 }}>
              <label
                htmlFor="manual-transcript-input"
                className="block text-sm font-semibold"
                style={{ color: "#e2e8f0", marginBottom: 8 }}
              >
                Study Notes, Article, or Audio Transcript
              </label>
              <textarea
                id="manual-transcript-input"
                rows={5}
                value={manualTranscript}
                onChange={(e) => {
                  setManualTranscript(e.target.value);
                  if (error) setError("");
                }}
                disabled={isLoading}
                placeholder="Paste speech transcript, lecture notes, textbook excerpt, or article text here..."
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  fontSize: "0.875rem",
                  color: "#ffffff",
                  background: error ? "rgba(239, 68, 68, 0.15)" : "#080c1e",
                  border: `1.5px solid ${error ? "#f87171" : "rgba(255, 255, 255, 0.15)"}`,
                  borderRadius: 12,
                  outline: "none",
                  fontFamily: "'Nunito', sans-serif",
                  resize: "vertical",
                  lineHeight: 1.5,
                  marginBottom: 10,
                }}
              />
              <div>
                <label
                  htmlFor="optional-video-url"
                  className="block text-xs font-semibold"
                  style={{ color: "#94a3b8", marginBottom: 4 }}
                >
                  Optional YouTube URL (to keep embedded player synced in Studio):
                </label>
                <input
                  id="optional-video-url"
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=… (optional)"
                  disabled={isLoading}
                  style={{
                    width: "100%",
                    height: 40,
                    padding: "0 12px",
                    fontSize: "0.8125rem",
                    color: "#ffffff",
                    background: "#080c1e",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    borderRadius: 10,
                    outline: "none",
                    fontFamily: "'Nunito', sans-serif",
                  }}
                />
              </div>
            </div>
          )}

          {/* ── Study Mode Selector ── */}
          <div style={{ marginBottom: 22 }}>
            <div className="flex items-center justify-between" style={{ marginBottom: 10 }}>
              <label className="block text-sm font-bold" style={{ color: "#ffffff" }}>
                Study Mode
              </label>
              <span className="font-mono-accent text-xs font-semibold" style={{ color: "#a5b4fc" }}>
                {mode === "basic" ? "⚡ Quick Revision (5–10 cards)" : "🧠 Deep Mastery (Dynamic, up to 40 cards)"}
              </span>
            </div>

            <div
              role="radiogroup"
              aria-label="Study mode selection"
              className="grid grid-cols-1 sm:grid-cols-2 gap-3"
            >
              {/* Option 1: Basic Study (Default) */}
              <div
                id="mode-basic-btn"
                role="radio"
                aria-checked={mode === "basic"}
                tabIndex={isLoading ? -1 : 0}
                onClick={() => { if (!isLoading) setMode("basic"); }}
                onKeyDown={(e) => { if ((e.key === "Enter" || e.key === " ") && !isLoading) setMode("basic"); }}
                className="flex flex-col justify-between rounded-2xl transition-all"
                style={{
                  padding: "16px",
                  cursor: isLoading ? "not-allowed" : "pointer",
                  background: mode === "basic" ? "rgba(92, 82, 255, 0.16)" : "rgba(8, 12, 30, 0.65)",
                  border: `2px solid ${mode === "basic" ? "#5c52ff" : "rgba(255, 255, 255, 0.08)"}`,
                  boxShadow: mode === "basic" ? "0 0 25px rgba(92, 82, 255, 0.25)" : "none",
                  opacity: isLoading ? 0.7 : 1,
                  userSelect: "none",
                }}
              >
                <div className="flex items-center justify-between" style={{ marginBottom: 6 }}>
                  <div className="flex items-center gap-2">
                    <span style={{ fontSize: "1.1rem" }}>⚡</span>
                    <span className="font-semibold text-sm" style={{ fontFamily: "'Unbounded', sans-serif", color: "#ffffff", fontSize: "0.85rem" }}>
                      Basic Study
                    </span>
                    <span
                      className="text-xs font-bold rounded-full font-mono-accent"
                      style={{
                        background: mode === "basic" ? "rgba(92, 82, 255, 0.35)" : "rgba(255, 255, 255, 0.08)",
                        color: mode === "basic" ? "#c7d2fe" : "#94a3b8",
                        padding: "2px 8px",
                        fontSize: "0.6875rem",
                      }}
                    >
                      Default
                    </span>
                  </div>
                  <div
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      border: `2px solid ${mode === "basic" ? "#5c52ff" : "rgba(255, 255, 255, 0.3)"}`,
                      background: mode === "basic" ? "#5c52ff" : "transparent",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {mode === "basic" && (
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#ffffff" }} />
                    )}
                  </div>
                </div>
                <p style={{ fontSize: "0.8125rem", color: "#94a3b8", lineHeight: 1.45 }}>
                  Generates 5–10 concise cards focusing on the most essential concepts for rapid review.
                </p>
              </div>

              {/* Option 2: Intensive Study */}
              <div
                id="mode-intensive-btn"
                role="radio"
                aria-checked={mode === "intensive"}
                tabIndex={isLoading ? -1 : 0}
                onClick={() => { if (!isLoading) setMode("intensive"); }}
                onKeyDown={(e) => { if ((e.key === "Enter" || e.key === " ") && !isLoading) setMode("intensive"); }}
                className="flex flex-col justify-between rounded-2xl transition-all"
                style={{
                  padding: "16px",
                  cursor: isLoading ? "not-allowed" : "pointer",
                  background: mode === "intensive" ? "rgba(92, 82, 255, 0.16)" : "rgba(8, 12, 30, 0.65)",
                  border: `2px solid ${mode === "intensive" ? "#5c52ff" : "rgba(255, 255, 255, 0.08)"}`,
                  boxShadow: mode === "intensive" ? "0 0 25px rgba(92, 82, 255, 0.25)" : "none",
                  opacity: isLoading ? 0.7 : 1,
                  userSelect: "none",
                }}
              >
                <div className="flex items-center justify-between" style={{ marginBottom: 6 }}>
                  <div className="flex items-center gap-2">
                    <span style={{ fontSize: "1.1rem" }}>🧠</span>
                    <span className="font-semibold text-sm" style={{ fontFamily: "'Unbounded', sans-serif", color: "#ffffff", fontSize: "0.85rem" }}>
                      Intensive Study
                    </span>
                    <span
                      className="text-xs font-bold rounded-full font-mono-accent"
                      style={{
                        background: mode === "intensive" ? "rgba(92, 82, 255, 0.35)" : "rgba(255, 255, 255, 0.08)",
                        color: mode === "intensive" ? "#c7d2fe" : "#94a3b8",
                        padding: "2px 8px",
                        fontSize: "0.6875rem",
                      }}
                    >
                      In-Depth
                    </span>
                  </div>
                  <div
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      border: `2px solid ${mode === "intensive" ? "#5c52ff" : "rgba(255, 255, 255, 0.3)"}`,
                      background: mode === "intensive" ? "#5c52ff" : "transparent",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {mode === "intensive" && (
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#ffffff" }} />
                    )}
                  </div>
                </div>
                <p style={{ fontSize: "0.8125rem", color: "#94a3b8", lineHeight: 1.45 }}>
                  Comprehensive breakdown of topics, subtopics, comparisons & scenarios (dynamic up to 40 cards).
                </p>
              </div>
            </div>
          </div>

          {/* Generate button (Full width) */}
          <button
            id="generate-flashcards-btn"
            type="button"
            onClick={onGenerate}
            disabled={isLoading}
            aria-label="Generate flashcards from this YouTube video"
            className="flex items-center justify-center gap-2 font-bold text-white transition-all rounded-full w-full"
            style={{
              background: isLoading ? "#4f46e5" : "linear-gradient(135deg, #5c52ff 0%, #4338ca 100%)",
              height: 52,
              padding: "0 24px",
              fontSize: "0.95rem",
              border: "none",
              cursor: isLoading ? "not-allowed" : "pointer",
              boxShadow: isLoading ? "none" : "0 0 25px rgba(92, 82, 255, 0.45)",
            }}
            onMouseEnter={e => {
              if (!isLoading) {
                e.currentTarget.style.filter = "brightness(1.15)";
                e.currentTarget.style.boxShadow = "0 0 32px rgba(92, 82, 255, 0.65)";
              }
            }}
            onMouseLeave={e => {
              if (!isLoading) {
                e.currentTarget.style.filter = "none";
                e.currentTarget.style.boxShadow = "0 0 25px rgba(92, 82, 255, 0.45)";
              }
            }}
          >
            {isLoading ? (
              <>
                <svg className="spin-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                </svg>
                {mode === "intensive" ? "Analyzing topics & generating intensive deck…" : "Generating flashcards…"}
              </>
            ) : (
              <>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                Generate {mode === "intensive" ? "Intensive" : "Basic"} Flashcards
              </>
            )}
          </button>


          {/* Loading state notification banner */}
          {status === "loading" && (
            <div
              role="status"
              className="fade-up flex items-center gap-2.5 rounded-xl"
              style={{
                background: "rgba(92, 82, 255, 0.15)",
                border: "1px solid rgba(92, 82, 255, 0.35)",
                color: "#c7d2fe",
                padding: "12px 16px",
                fontSize: "0.875rem",
                marginTop: 14,
              }}
            >
              <svg className="spin-icon shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
              </svg>
              <span>
                {mode === "intensive"
                  ? "Analyzing video topics & subtopics to craft your in-depth deck (this may take 15–30s)…"
                  : "Fetching transcript & crafting your quick revision flashcards…"}
              </span>
            </div>
          )}

          {/* Success banner */}
          {status === "success" && (
            <div
              role="status"
              className="fade-up flex items-center justify-between rounded-xl"
              style={{
                background: "rgba(16, 185, 129, 0.15)",
                border: "1px solid rgba(16, 185, 129, 0.35)",
                color: "#6ee7b7",
                padding: "12px 16px",
                fontSize: "0.875rem",
                marginTop: 14,
              }}
            >
              <div className="flex items-center gap-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                <span className="font-semibold">
                  {flashcardCount
                    ? `${flashcardCount} flashcards generated (${mode === "intensive" ? "Intensive Study" : "Basic Study"})!`
                    : "Flashcards generated!"}
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
                  color: "#a7f3d0",
                  padding: "4px 8px",
                }}
              >
                View Flashcards ↓
              </button>
            </div>
          )}

          {/* Error message */}
          {status === "error" && error && (
            <div
              id="url-error"
              role="alert"
              className="fade-up flex flex-col gap-2 rounded-xl"
              style={{
                background: "rgba(239, 68, 68, 0.15)",
                border: "1px solid rgba(239, 68, 68, 0.35)",
                color: "#fca5a5",
                padding: "12px 16px",
                fontSize: "0.875rem",
                marginTop: 14,
              }}
            >
              <div className="flex items-start gap-2">
                <svg className="shrink-0 mt-0.5" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>{error}</span>
              </div>
              {inputTab === "url" && (
                <button
                  type="button"
                  onClick={() => {
                    setInputTab("notes");
                    setError("");
                  }}
                  className="inline-flex items-center gap-1.5 font-semibold text-xs rounded transition-colors self-start"
                  style={{
                    background: "rgba(239, 68, 68, 0.25)",
                    color: "#fecaca",
                    padding: "4px 10px",
                    border: "1px solid rgba(239, 68, 68, 0.4)",
                    cursor: "pointer",
                    marginLeft: 24,
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = "rgba(239, 68, 68, 0.35)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "rgba(239, 68, 68, 0.25)")}
                >
                  <span>📝</span> Switch to Paste Notes / Transcript manually →
                </button>
              )}
            </div>
          )}
        </div>

        {/* Trust strip */}
        <div
          className="flex flex-wrap items-center justify-center"
          style={{ gap: "8px 20px", marginTop: 24 }}
        >
          {[
            { icon: "🔒", text: "No signup required" },
            { icon: "✓", text: "Any YouTube video" },
            { icon: "★", text: "Free to use" },
          ].map(({ icon, text }) => (
            <span
              key={text}
              className="flex items-center gap-1.5"
              style={{ fontSize: "0.8125rem", color: "#64748b" }}
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
