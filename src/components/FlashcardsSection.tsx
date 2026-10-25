"use client";

import { useState, useRef, useEffect } from "react";
import type { Flashcard, StudyMode } from "@/app/api/generate/route";

interface FlashcardsSectionProps {
  flashcards: Flashcard[];
  videoId: string;
  mode?: StudyMode;
  onReset: () => void;
}

export default function FlashcardsSection({
  flashcards,
  videoId,
  mode = "basic",
  onReset,
}: FlashcardsSectionProps) {
  const [cards, setCards] = useState<Flashcard[]>(flashcards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [viewMode, setViewMode] = useState<"focus" | "grid">("focus");
  const [gridFlipped, setGridFlipped] = useState<Record<number, boolean>>({});
  const [playerStartTime, setPlayerStartTime] = useState<number | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Sync state if props change
  useEffect(() => {
    setCards(flashcards);
    setCurrentIndex(0);
    setIsFlipped(false);
    setGridFlipped({});
  }, [flashcards]);

  const currentCard = cards[currentIndex] || cards[0];

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setIsFlipped(false);
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const toggleFlip = () => {
    setIsFlipped((prev) => !prev);
  };

  const toggleGridCard = (idx: number) => {
    setGridFlipped((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const toggleFlipAllGrid = () => {
    const allFlipped = cards.every((_, i) => gridFlipped[i]);
    const next: Record<number, boolean> = {};
    cards.forEach((_, i) => {
      next[i] = !allFlipped;
    });
    setGridFlipped(next);
  };

  const handleShuffle = () => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const handleExportCSV = () => {
    if (!cards || cards.length === 0) return;
    const header = "Question,Answer,Timestamp\n";
    const rows = cards
      .map((c) => {
        const q = `"${(c.question || "").replace(/"/g, '""')}"`;
        const a = `"${(c.answer || "").replace(/"/g, '""')}"`;
        const t = `"${c.timestamp || ""}"`;
        return `${q},${a},${t}`;
      })
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
    const downloadUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.setAttribute("download", `recallai_flashcards_${cards.length}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(downloadUrl);
  };

  const handleSeek = (seconds?: number) => {
    if (typeof seconds !== "number" || isNaN(seconds)) return;
    setPlayerStartTime(seconds);

    // Send seekTo command to YouTube iframe player API
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({
          event: "command",
          func: "seekTo",
          args: [seconds, true],
        }),
        "*"
      );
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({
          event: "command",
          func: "playVideo",
          args: [],
        }),
        "*"
      );
    }

    // Scroll to video player if on small mobile screen
    if (window.innerWidth < 1024) {
      document.getElementById("study-video-player")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const videoEmbedUrl = videoId
    ? `https://www.youtube-nocookie.com/embed/${videoId}?enablejsapi=1&rel=0${
        playerStartTime !== null ? `&start=${playerStartTime}&autoplay=1` : ""
      }`
    : "";

  const externalVideoUrl = videoId ? `https://www.youtube.com/watch?v=${videoId}` : "#";

  return (
    <div
      id="screen-2-studio"
      className="min-h-screen flex flex-col"
      style={{
        background: "#080c1e",
      }}
    >
      {/* ── SCREEN 2 TOP STUDIO NAVBAR ── */}
      <header
        style={{
          background: "rgba(8, 12, 30, 0.92)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          padding: "0 24px",
          height: 64,
          position: "sticky",
          top: 0,
          zIndex: 40,
          boxShadow: "0 4px 24px -2px rgba(0, 0, 0, 0.4)",
        }}
        className="flex items-center justify-between"
      >
        {/* Left: Logo & Back Button */}
        <div className="flex items-center gap-3">
          <div
            role="button"
            tabIndex={0}
            onClick={onReset}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onReset(); }}
            className="flex items-center gap-2.5 cursor-pointer transition-opacity hover:opacity-85"
            title="Return to setup"
          >
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
          </div>

          <span className="hidden sm:inline" style={{ color: "rgba(255, 255, 255, 0.2)" }}>|</span>

          {/* Mode Pill */}
          <span
            className="inline-flex items-center gap-1.5 text-xs font-bold rounded-full font-mono-accent"
            style={{
              background: "rgba(92, 82, 255, 0.12)",
              border: "1px solid rgba(92, 82, 255, 0.35)",
              color: "#a5b4fc",
              padding: "4px 14px",
              fontSize: "0.75rem",
            }}
          >
            {mode === "intensive" ? "🧠 Intensive Study" : "⚡ Basic Study"} • {cards.length} cards
          </span>
        </div>

        {/* Right: View Switcher & Change Video Button */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* View switcher */}
          <div
            className="inline-flex items-center rounded-full p-1"
            style={{ background: "rgba(14, 19, 43, 0.8)", border: "1px solid rgba(255, 255, 255, 0.1)" }}
          >
            <button
              type="button"
              onClick={() => setViewMode("focus")}
              className="text-xs font-bold rounded-full transition-all cursor-pointer"
              style={{
                padding: "6px 14px",
                background: viewMode === "focus" ? "rgba(92, 82, 255, 0.35)" : "transparent",
                color: viewMode === "focus" ? "#ffffff" : "#94a3b8",
                border: viewMode === "focus" ? "1px solid rgba(92, 82, 255, 0.5)" : "1px solid transparent",
                boxShadow: viewMode === "focus" ? "0 0 14px rgba(92, 82, 255, 0.4)" : "none",
              }}
            >
              Focus
            </button>
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className="text-xs font-bold rounded-full transition-all cursor-pointer"
              style={{
                padding: "6px 14px",
                background: viewMode === "grid" ? "rgba(92, 82, 255, 0.35)" : "transparent",
                color: viewMode === "grid" ? "#ffffff" : "#94a3b8",
                border: viewMode === "grid" ? "1px solid rgba(92, 82, 255, 0.5)" : "1px solid transparent",
                boxShadow: viewMode === "grid" ? "0 0 14px rgba(92, 82, 255, 0.4)" : "none",
              }}
            >
              Grid
            </button>
          </div>

          {/* Export Deck as CSV button */}
          <button
            id="export-deck-btn"
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 text-xs font-bold rounded-full transition-all cursor-pointer"
            title="Download deck as CSV (compatible with Anki, Notion, Quizlet, and Excel)"
            style={{
              background: "rgba(92, 82, 255, 0.18)",
              border: "1px solid rgba(92, 82, 255, 0.4)",
              color: "#c7d2fe",
              padding: "8px 16px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(92, 82, 255, 0.35)";
              e.currentTarget.style.borderColor = "#5c52ff";
              e.currentTarget.style.color = "#ffffff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(92, 82, 255, 0.18)";
              e.currentTarget.style.borderColor = "rgba(92, 82, 255, 0.4)";
              e.currentTarget.style.color = "#c7d2fe";
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span>Export CSV</span>
          </button>

          {/* Return to Screen 1 button */}
          <button
            id="return-to-setup-btn"
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1.5 text-xs font-bold rounded-full transition-all cursor-pointer"
            style={{
              background: "rgba(255, 255, 255, 0.06)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              color: "#ffffff",
              padding: "8px 16px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#5c52ff";
              e.currentTarget.style.background = "rgba(92, 82, 255, 0.2)";
              e.currentTarget.style.boxShadow = "0 0 16px rgba(92, 82, 255, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.12)";
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.06)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            <span className="hidden sm:inline">Change Video</span>
            <span className="sm:hidden">Exit</span>
          </button>
        </div>
      </header>

      {/* ── MAIN STUDIO CONTENT (TWO COLUMNS) ── */}
      <main
        style={{
          flex: 1,
          maxWidth: 1280,
          margin: "0 auto",
          width: "100%",
          padding: "32px 20px 64px",
        }}
      >
        {/* ── TWO-COLUMN STUDY LAYOUT ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ── LEFT COLUMN: YouTube Video Player ── */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div
              id="study-video-player"
              style={{
                background: "#050814",
                borderRadius: 20,
                overflow: "hidden",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                boxShadow: "0 24px 60px -12px rgba(0, 0, 0, 0.7), 0 0 30px rgba(92, 82, 255, 0.15)",
                position: "relative",
                paddingTop: "56.25%", // 16:9 ratio
                width: "100%",
              }}
            >
              {videoId ? (
                <iframe
                  ref={iframeRef}
                  id="recallai-yt-iframe"
                  src={videoEmbedUrl}
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    border: "none",
                  }}
                />
              ) : (
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  style={{ color: "#94a3b8", fontSize: "0.9375rem", fontFamily: "'Nunito', sans-serif" }}
                >
                  No video selected
                </div>
              )}
            </div>

            {/* Video player toolbar */}
            <div
              className="flex items-center justify-between rounded-2xl"
              style={{
                background: "rgba(14, 19, 43, 0.85)",
                backdropFilter: "blur(16px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                padding: "14px 20px",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
              }}
            >
              <div className="flex items-center gap-2" style={{ fontSize: "0.8125rem", color: "#94a3b8", fontFamily: "'Nunito', sans-serif" }}>
                <span style={{ fontSize: "1rem" }}>💡</span>
                <span>
                  Click any card&apos;s <strong className="font-mono-accent" style={{ color: "#a5b4fc" }}>⏱️ timestamp</strong> to jump to that moment in the video.
                </span>
              </div>
              <a
                href={externalVideoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-bold text-xs transition-colors shrink-0"
                style={{ color: "#a5b4fc", textDecoration: "none", fontFamily: "'Nunito', sans-serif" }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "#ffffff"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "#a5b4fc"; }}
              >
                <span>Watch on YouTube</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </a>
            </div>
          </div>

          {/* ── RIGHT COLUMN: Flashcard Studio ── */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {viewMode === "focus" ? (
              /* ── FOCUS MODE: Single Card Player with Prev/Next ── */
              <div
                style={{
                  background: "rgba(14, 19, 43, 0.88)",
                  backdropFilter: "blur(20px)",
                  borderRadius: 24,
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  boxShadow: "0 24px 60px -12px rgba(0, 0, 0, 0.6), 0 0 40px rgba(92, 82, 255, 0.12)",
                  padding: 24,
                }}
              >
                {/* Header & Progress Indicator */}
                <div style={{ marginBottom: 18 }}>
                  <div className="flex items-center justify-between" style={{ marginBottom: 10 }}>
                    <div className="flex items-center gap-2">
                      <span
                        className="font-bold text-xs uppercase tracking-wider rounded-full font-mono-accent"
                        style={{
                          background: "rgba(92, 82, 255, 0.15)",
                          border: "1px solid rgba(92, 82, 255, 0.35)",
                          color: "#a5b4fc",
                          padding: "3px 10px",
                          fontSize: "0.72rem",
                        }}
                      >
                        Card {currentIndex + 1} of {cards.length}
                      </span>
                    </div>

                    {/* Timestamp jump button */}
                    {currentCard?.timestamp && (
                      <button
                        type="button"
                        onClick={() => handleSeek(currentCard.timestampSeconds)}
                        title="Jump to video timestamp"
                        className="inline-flex items-center gap-1 text-xs font-semibold rounded-full transition-all cursor-pointer font-mono-accent"
                        style={{
                          background: "rgba(245, 158, 11, 0.15)",
                          color: "#fcd34d",
                          border: "1px solid rgba(245, 158, 11, 0.35)",
                          padding: "3px 10px",
                          fontSize: "0.72rem",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "rgba(245, 158, 11, 0.28)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "rgba(245, 158, 11, 0.15)";
                        }}
                      >
                        <span>⏱️ {currentCard.timestamp}</span>
                        <span style={{ fontSize: "0.6875rem" }}>Jump</span>
                      </button>
                    )}
                  </div>

                  {/* Smooth Progress Bar */}
                  <div
                    style={{
                      height: 6,
                      background: "rgba(255, 255, 255, 0.08)",
                      borderRadius: 999,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${((currentIndex + 1) / cards.length) * 100}%`,
                        background: "linear-gradient(90deg, #5c52ff 0%, #a855f7 100%)",
                        boxShadow: "0 0 12px rgba(92, 82, 255, 0.5)",
                        transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      }}
                    />
                  </div>
                </div>

                {/* Interactive Flip Card Container */}
                <div
                  role="button"
                  tabIndex={0}
                  aria-label={`Flashcard ${currentIndex + 1}: Click to flip. ${
                    isFlipped ? `Answer: ${currentCard.answer}` : `Question: ${currentCard.question}`
                  }`}
                  onClick={toggleFlip}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      toggleFlip();
                    }
                  }}
                  style={{
                    perspective: "1000px",
                    minHeight: 340,
                    cursor: "pointer",
                    outline: "none",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      minHeight: 340,
                      transformStyle: "preserve-3d",
                      transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                      transition: "transform 0.45s cubic-bezier(0.4, 0.2, 0.2, 1)",
                      borderRadius: 20,
                      position: "relative",
                    }}
                  >
                    {/* Front Face (Question) */}
                    <div
                      style={{
                        position: isFlipped ? "absolute" : "relative",
                        inset: 0,
                        backfaceVisibility: "hidden",
                        WebkitBackfaceVisibility: "hidden",
                        borderRadius: 20,
                        background: "linear-gradient(145deg, rgba(20, 27, 60, 0.95) 0%, rgba(14, 19, 43, 0.98) 100%)",
                        border: "1.5px solid rgba(92, 82, 255, 0.28)",
                        boxShadow: "0 12px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
                        padding: "26px 24px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        minHeight: 340,
                        overflowWrap: "break-word",
                        wordBreak: "break-word",
                      }}
                    >
                      <div className="flex items-center justify-between" style={{ marginBottom: 14 }}>
                        <span
                          className="font-bold text-xs rounded-full font-mono-accent"
                          style={{
                            background: "rgba(92, 82, 255, 0.2)",
                            border: "1px solid rgba(92, 82, 255, 0.4)",
                            color: "#a5b4fc",
                            padding: "3px 12px",
                            letterSpacing: "0.04em",
                            textTransform: "uppercase",
                          }}
                        >
                          Question
                        </span>
                      </div>

                      {/* Question Text */}
                      <div
                        style={{
                          flex: 1,
                          display: "flex",
                          alignItems: "center",
                          overflowY: "auto",
                          maxHeight: 220,
                          paddingRight: 4,
                        }}
                      >
                        <p
                          style={{
                            fontFamily: "'Nunito', sans-serif",
                            fontSize: "1.125rem",
                            fontWeight: 700,
                            color: "#ffffff",
                            lineHeight: 1.55,
                          }}
                        >
                          {currentCard.question}
                        </p>
                      </div>

                      {/* Card Bottom Helper */}
                      <div
                        className="flex items-center justify-between"
                        style={{
                          marginTop: 16,
                          paddingTop: 12,
                          borderTop: "1px solid rgba(255, 255, 255, 0.08)",
                          fontSize: "0.75rem",
                          color: "#94a3b8",
                          fontFamily: "'Nunito', sans-serif",
                        }}
                      >
                        <span className="font-mono-accent">Card {currentIndex + 1} of {cards.length}</span>
                      </div>
                    </div>

                    {/* Back Face (Answer) */}
                    <div
                      style={{
                        position: isFlipped ? "relative" : "absolute",
                        inset: 0,
                        backfaceVisibility: "hidden",
                        WebkitBackfaceVisibility: "hidden",
                        transform: "rotateY(180deg)",
                        borderRadius: 20,
                        background: "linear-gradient(145deg, #18153d 0%, #292468 50%, #4338ca 100%)",
                        border: "1.5px solid rgba(92, 82, 255, 0.55)",
                        boxShadow: "0 16px 40px rgba(92, 82, 255, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.18)",
                        padding: "26px 24px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        minHeight: 340,
                        overflowWrap: "break-word",
                        wordBreak: "break-word",
                      }}
                    >
                      <div className="flex items-center justify-between" style={{ marginBottom: 12 }}>
                        <span
                          className="font-bold text-xs rounded-full font-mono-accent"
                          style={{
                            background: "rgba(255, 255, 255, 0.22)",
                            color: "#ffffff",
                            padding: "3px 12px",
                            letterSpacing: "0.04em",
                            textTransform: "uppercase",
                          }}
                        >
                          Answer
                        </span>
                        {currentCard.timestamp && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSeek(currentCard.timestampSeconds);
                            }}
                            className="inline-flex items-center gap-1 text-xs font-semibold rounded-full transition-all cursor-pointer font-mono-accent"
                            style={{
                              background: "rgba(255, 255, 255, 0.22)",
                              color: "#ffffff",
                              border: "none",
                              padding: "3px 10px",
                            }}
                          >
                            ⏱️ Replay at {currentCard.timestamp}
                          </button>
                        )}
                      </div>

                      {/* Answer Text */}
                      <div
                        style={{
                          flex: 1,
                          overflowY: "auto",
                          maxHeight: 220,
                          paddingRight: 6,
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <p
                          style={{
                            fontSize: "0.95rem",
                            color: "#ffffff",
                            lineHeight: 1.65,
                            fontWeight: 500,
                            fontFamily: "'Nunito', sans-serif",
                          }}
                        >
                          {currentCard.answer}
                        </p>
                      </div>

                      {/* Card Bottom Helper */}
                      <div
                        className="flex items-center justify-between"
                        style={{
                          marginTop: 16,
                          paddingTop: 12,
                          borderTop: "1px solid rgba(255, 255, 255, 0.18)",
                          fontSize: "0.75rem",
                          color: "rgba(255, 255, 255, 0.75)",
                          fontFamily: "'Nunito', sans-serif",
                        }}
                      >
                        <span className="font-mono-accent">Card {currentIndex + 1} of {cards.length}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Navigation Controls */}
                <div
                  className="flex items-center justify-between gap-2"
                  style={{ marginTop: 22 }}
                >
                  <button
                    type="button"
                    onClick={handlePrev}
                    disabled={currentIndex === 0}
                    className="inline-flex items-center gap-1.5 font-bold text-xs rounded-full transition-all"
                    style={{
                      padding: "10px 18px",
                      background: currentIndex === 0 ? "rgba(255, 255, 255, 0.03)" : "rgba(255, 255, 255, 0.08)",
                      border: "1px solid " + (currentIndex === 0 ? "rgba(255, 255, 255, 0.05)" : "rgba(255, 255, 255, 0.14)"),
                      color: currentIndex === 0 ? "#475569" : "#ffffff",
                      cursor: currentIndex === 0 ? "not-allowed" : "pointer",
                      fontFamily: "'Nunito', sans-serif",
                    }}
                  >
                    ← Previous
                  </button>

                  <button
                    type="button"
                    onClick={toggleFlip}
                    className="inline-flex items-center gap-1.5 font-bold text-xs rounded-full transition-all shadow-md"
                    style={{
                      padding: "11px 24px",
                      background: "linear-gradient(135deg, #5c52ff 0%, #4338ca 100%)",
                      color: "#ffffff",
                      border: "none",
                      cursor: "pointer",
                      boxShadow: "0 0 24px rgba(92, 82, 255, 0.45)",
                      fontFamily: "'Nunito', sans-serif",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.filter = "brightness(1.15)";
                      e.currentTarget.style.boxShadow = "0 0 30px rgba(92, 82, 255, 0.65)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.filter = "none";
                      e.currentTarget.style.boxShadow = "0 0 24px rgba(92, 82, 255, 0.45)";
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M17 1l4 4-4 4" />
                      <path d="M3 11V9a4 4 0 0 1 4-4h14" />
                      <path d="M7 23l-4-4 4-4" />
                      <path d="M21 13v2a4 4 0 0 1-4 4H3" />
                    </svg>
                    {isFlipped ? "Show Question" : "Flip to Answer"}
                  </button>

                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={currentIndex === cards.length - 1}
                    className="inline-flex items-center gap-1.5 font-bold text-xs rounded-full transition-all"
                    style={{
                      padding: "10px 18px",
                      background: currentIndex === cards.length - 1 ? "rgba(255, 255, 255, 0.03)" : "rgba(255, 255, 255, 0.08)",
                      border: "1px solid " + (currentIndex === cards.length - 1 ? "rgba(255, 255, 255, 0.05)" : "rgba(255, 255, 255, 0.14)"),
                      color: currentIndex === cards.length - 1 ? "#475569" : "#ffffff",
                      cursor: currentIndex === cards.length - 1 ? "not-allowed" : "pointer",
                      fontFamily: "'Nunito', sans-serif",
                    }}
                  >
                    Next →
                  </button>
                </div>

                {/* Sub-actions (Shuffle, etc.) */}
                <div
                  className="flex items-center justify-center gap-4"
                  style={{ marginTop: 18, paddingTop: 14, borderTop: "1px solid rgba(255, 255, 255, 0.08)" }}
                >
                  <button
                    type="button"
                    onClick={handleShuffle}
                    className="text-xs font-semibold transition-colors inline-flex items-center gap-1 cursor-pointer"
                    style={{ background: "none", border: "none", color: "#94a3b8" }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = "#ffffff"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = "#94a3b8"; }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="16 3 21 3 21 8" />
                      <line x1="4" y1="20" x2="21" y2="3" />
                      <polyline points="21 16 21 21 16 21" />
                      <line x1="15" y1="15" x2="21" y2="21" />
                      <line x1="4" y1="4" x2="9" y2="9" />
                    </svg>
                    Shuffle Deck
                  </button>
                  <span style={{ color: "rgba(255, 255, 255, 0.2)" }}>•</span>
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentIndex(0);
                      setIsFlipped(false);
                    }}
                    className="text-xs font-semibold transition-colors inline-flex items-center gap-1 cursor-pointer"
                    style={{ background: "none", border: "none", color: "#94a3b8" }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = "#ffffff"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = "#94a3b8"; }}
                  >
                    Restart from Card 1
                  </button>
                </div>
              </div>
            ) : (
              /* ── GRID MODE: All Cards with Safe Overflow ── */
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between" style={{ marginBottom: 6 }}>
                  <span className="text-xs font-bold" style={{ color: "#94a3b8", fontFamily: "'Nunito', sans-serif" }}>
                    Showing all {cards.length} cards
                  </span>
                  <button
                    type="button"
                    onClick={toggleFlipAllGrid}
                    className="text-xs font-bold transition-colors cursor-pointer"
                    style={{ background: "none", border: "none", color: "#a5b4fc", fontFamily: "'Nunito', sans-serif" }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = "#ffffff"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = "#a5b4fc"; }}
                  >
                    Flip All Answers ⟲
                  </button>
                </div>

                <div
                  className="flex flex-col gap-3.5"
                  style={{ maxHeight: 600, overflowY: "auto", paddingRight: 4 }}
                >
                  {cards.map((card, idx) => {
                    const flipped = !!gridFlipped[idx];
                    return (
                      <div
                        key={idx}
                        role="button"
                        tabIndex={0}
                        onClick={() => toggleGridCard(idx)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") toggleGridCard(idx);
                        }}
                        style={{
                          background: flipped ? "linear-gradient(145deg, #18153d 0%, #292468 100%)" : "rgba(14, 19, 43, 0.85)",
                          border: `1.5px solid ${flipped ? "#5c52ff" : "rgba(255, 255, 255, 0.1)"}`,
                          borderRadius: 18,
                          padding: "18px 20px",
                          cursor: "pointer",
                          boxShadow: flipped ? "0 0 20px rgba(92, 82, 255, 0.25)" : "0 8px 24px rgba(0, 0, 0, 0.3)",
                          transition: "all 0.2s ease",
                          overflowWrap: "break-word",
                          wordBreak: "break-word",
                        }}
                      >
                        <div className="flex items-center justify-between" style={{ marginBottom: 10 }}>
                          <span
                            className="text-xs font-bold rounded-full font-mono-accent"
                            style={{
                              background: flipped ? "rgba(255,255,255,0.2)" : "rgba(92, 82, 255, 0.15)",
                              color: flipped ? "#ffffff" : "#a5b4fc",
                              padding: "2px 10px",
                            }}
                          >
                            Card {idx + 1}
                          </span>
                          {card.timestamp && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSeek(card.timestampSeconds);
                              }}
                              className="text-xs font-semibold rounded-full font-mono-accent"
                              style={{
                                background: flipped ? "rgba(255,255,255,0.15)" : "rgba(245, 158, 11, 0.15)",
                                color: flipped ? "#fde68a" : "#fcd34d",
                                border: "1px solid rgba(245, 158, 11, 0.3)",
                                padding: "2px 8px",
                                cursor: "pointer",
                              }}
                            >
                              ⏱️ {card.timestamp}
                            </button>
                          )}
                        </div>

                        <p
                          style={{
                            fontSize: "0.9375rem",
                            fontWeight: flipped ? 500 : 700,
                            color: "#ffffff",
                            lineHeight: 1.55,
                            fontFamily: "'Nunito', sans-serif",
                          }}
                        >
                          {flipped ? card.answer : card.question}
                        </p>
                        <span
                          style={{
                            fontSize: "0.75rem",
                            color: flipped ? "rgba(255,255,255,0.65)" : "#94a3b8",
                            marginTop: 10,
                            display: "block",
                            fontFamily: "'Nunito', sans-serif",
                          }}
                        >
                          {flipped ? "Tap to view question" : "Tap to reveal answer"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
