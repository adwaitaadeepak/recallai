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
          {/* Source Mode Tabs */}
          <div
            className="flex items-center rounded-xl p-1"
            style={{
              background: "#f3f4f6",
              marginBottom: 20,
              gap: 4,
            }}
          >
            <button
              type="button"
              onClick={() => { setInputTab("url"); setError(""); }}
              className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all"
              style={{
                background: inputTab === "url" ? "#ffffff" : "transparent",
                color: inputTab === "url" ? "#111827" : "#6b7280",
                boxShadow: inputTab === "url" ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              <span>📺</span> YouTube URL
            </button>
            <button
              type="button"
              onClick={() => { setInputTab("notes"); setError(""); }}
              className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all"
              style={{
                background: inputTab === "notes" ? "#ffffff" : "transparent",
                color: inputTab === "notes" ? "#111827" : "#6b7280",
                boxShadow: inputTab === "notes" ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
                border: "none",
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
                style={{ color: "#374151", marginBottom: 8 }}
              >
                YouTube video URL
              </label>

              {/* URL input with YouTube icon */}
              <div className="relative" style={{ marginBottom: 10 }}>
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
                    paddingRight: url ? 38 : 14,
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

              {/* Verified sample pills */}
              <div className="flex flex-wrap items-center gap-1.5" style={{ marginBottom: 16 }}>
                <span style={{ fontSize: "0.75rem", color: "#6b7280", fontWeight: 500 }}>
                  Try verified sample:
                </span>
                {[
                  { label: "⚡ Neural Networks", url: "https://www.youtube.com/watch?v=aircAruvnKk" },
                  { label: "⚡ Scientific Method", url: "https://www.youtube.com/watch?v=8aGhZQkoFbQ" },
                  { label: "⚡ PC Hardware", url: "https://youtu.be/fGVfqA_Iv6s" },
                ].map((sample) => (
                  <button
                    key={sample.label}
                    type="button"
                    onClick={() => {
                      setUrl(sample.url);
                      setError("");
                      inputRef.current?.focus();
                    }}
                    className="inline-flex items-center text-xs font-medium rounded-full transition-colors"
                    style={{
                      background: "#f5f3ff",
                      color: "#4f46e5",
                      border: "1px solid #ddd6fe",
                      padding: "2px 9px",
                      cursor: "pointer",
                      fontSize: "0.6875rem",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#ede9fe")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "#f5f3ff")}
                  >
                    {sample.label}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div style={{ marginBottom: 16 }}>
              <label
                htmlFor="manual-transcript-input"
                className="block text-sm font-semibold"
                style={{ color: "#374151", marginBottom: 8 }}
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
                  color: "#111827",
                  background: error ? "#fef2f2" : "#ffffff",
                  border: `1.5px solid ${error ? "#fca5a5" : "#d1d5db"}`,
                  borderRadius: 10,
                  outline: "none",
                  fontFamily: "'Inter', sans-serif",
                  resize: "vertical",
                  lineHeight: 1.5,
                  marginBottom: 10,
                }}
              />
              <div>
                <label
                  htmlFor="optional-video-url"
                  className="block text-xs font-medium"
                  style={{ color: "#6b7280", marginBottom: 4 }}
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
                    height: 38,
                    padding: "0 12px",
                    fontSize: "0.8125rem",
                    color: "#111827",
                    border: "1px solid #d1d5db",
                    borderRadius: 8,
                    outline: "none",
                  }}
                />
              </div>
            </div>
          )}

          {/* ── Study Mode Selector ── */}
          <div style={{ marginBottom: 16 }}>
            <div className="flex items-center justify-between" style={{ marginBottom: 8 }}>
              <label className="block text-sm font-semibold" style={{ color: "#374151" }}>
                Study Mode
              </label>
              <span style={{ fontSize: "0.75rem", color: "#6b7280" }}>
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
                className="flex flex-col justify-between rounded-xl transition-all"
                style={{
                  padding: "14px 16px",
                  cursor: isLoading ? "not-allowed" : "pointer",
                  background: mode === "basic" ? "#f5f3ff" : "#ffffff",
                  border: `2px solid ${mode === "basic" ? "#4f46e5" : "#e5e7eb"}`,
                  boxShadow: mode === "basic" ? "0 0 0 1px #4f46e5, 0 2px 8px rgba(79,70,229,0.12)" : "none",
                  opacity: isLoading ? 0.7 : 1,
                  userSelect: "none",
                }}
              >
                <div className="flex items-center justify-between" style={{ marginBottom: 6 }}>
                  <div className="flex items-center gap-2">
                    <span style={{ fontSize: "1.1rem" }}>⚡</span>
                    <span className="font-bold text-sm" style={{ color: mode === "basic" ? "#312e81" : "#111827" }}>
                      Basic Study
                    </span>
                    <span
                      className="text-xs font-semibold rounded-full"
                      style={{
                        background: mode === "basic" ? "#e0e7ff" : "#f3f4f6",
                        color: mode === "basic" ? "#4338ca" : "#6b7280",
                        padding: "1px 8px",
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
                      border: `2px solid ${mode === "basic" ? "#4f46e5" : "#d1d5db"}`,
                      background: mode === "basic" ? "#4f46e5" : "#ffffff",
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
                <p style={{ fontSize: "0.8125rem", color: "#6b7280", lineHeight: 1.4 }}>
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
                className="flex flex-col justify-between rounded-xl transition-all"
                style={{
                  padding: "14px 16px",
                  cursor: isLoading ? "not-allowed" : "pointer",
                  background: mode === "intensive" ? "#f5f3ff" : "#ffffff",
                  border: `2px solid ${mode === "intensive" ? "#4f46e5" : "#e5e7eb"}`,
                  boxShadow: mode === "intensive" ? "0 0 0 1px #4f46e5, 0 2px 8px rgba(79,70,229,0.12)" : "none",
                  opacity: isLoading ? 0.7 : 1,
                  userSelect: "none",
                }}
              >
                <div className="flex items-center justify-between" style={{ marginBottom: 6 }}>
                  <div className="flex items-center gap-2">
                    <span style={{ fontSize: "1.1rem" }}>🧠</span>
                    <span className="font-bold text-sm" style={{ color: mode === "intensive" ? "#312e81" : "#111827" }}>
                      Intensive Study
                    </span>
                    <span
                      className="text-xs font-semibold rounded-full"
                      style={{
                        background: mode === "intensive" ? "#e0e7ff" : "#f3f4f6",
                        color: mode === "intensive" ? "#4338ca" : "#6b7280",
                        padding: "1px 8px",
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
                      border: `2px solid ${mode === "intensive" ? "#4f46e5" : "#d1d5db"}`,
                      background: mode === "intensive" ? "#4f46e5" : "#ffffff",
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
                <p style={{ fontSize: "0.8125rem", color: "#6b7280", lineHeight: 1.4 }}>
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
            className="flex items-center justify-center gap-2 font-semibold text-white transition-all rounded-xl w-full"
            style={{
              background: isLoading ? "#818cf8" : "#4f46e5",
              height: 48,
              padding: "0 24px",
              fontSize: "0.9375rem",
              border: "none",
              cursor: isLoading ? "not-allowed" : "pointer",
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

          {/* Hint text (idle) */}
          {status === "idle" && (
            <p style={{ fontSize: "0.8125rem", color: "#9ca3af", marginTop: 10, textAlign: "center" }}>
              Works with youtube.com and youtu.be links · No account needed
            </p>
          )}

          {/* Loading state notification banner */}
          {status === "loading" && (
            <div
              role="status"
              className="fade-up flex items-center gap-2.5 rounded-lg"
              style={{
                background: "#eef2ff",
                border: "1px solid #c7d2fe",
                color: "#3730a3",
                padding: "10px 14px",
                fontSize: "0.875rem",
                marginTop: 12,
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
              className="fade-up flex items-center justify-between rounded-lg"
              style={{
                background: "#ecfdf5",
                border: "1px solid #a7f3d0",
                color: "#065f46",
                padding: "10px 14px",
                fontSize: "0.875rem",
                marginTop: 12,
              }}
            >
              <div className="flex items-center gap-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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
                  color: "#047857",
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
              className="fade-up flex flex-col gap-2 rounded-lg"
              style={{
                background: "#fef2f2",
                border: "1px solid #fecaca",
                color: "#dc2626",
                padding: "12px 14px",
                fontSize: "0.875rem",
                marginTop: 12,
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
                    background: "#fee2e2",
                    color: "#991b1b",
                    padding: "4px 10px",
                    border: "1px solid #fca5a5",
                    cursor: "pointer",
                    marginLeft: 24,
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#fecaca")}
                  onMouseLeave={e => (e.currentTarget.style.background = "#fee2e2")}
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
