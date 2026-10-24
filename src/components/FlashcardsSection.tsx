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
    <section
      id="flashcards-results"
      aria-labelledby="flashcards-headline"
      style={{
        background: "linear-gradient(180deg, #f8f9fc 0%, #eef2ff 100%)",
        padding: "56px 20px 88px",
      }}
    >
      <div style={{ maxWidth: 1240, margin: "0 auto" }}>
        {/* ── Top Navigation / Mode Bar ── */}
        <div
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          style={{ marginBottom: 32 }}
        >
          <div>
            <div className="flex items-center gap-2" style={{ marginBottom: 6 }}>
              <span
                className="inline-flex items-center gap-1.5 text-xs font-semibold rounded-full"
                style={{
                  background: "#eef2ff",
                  border: "1px solid #c7d2fe",
                  color: "#4f46e5",
                  padding: "4px 12px",
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                }}
              >
                {mode === "intensive" ? "🧠 Intensive Study" : "⚡ Basic Study"}
              </span>
              <span style={{ fontSize: "0.8125rem", color: "#6b7280" }}>
                {cards.length} cards generated
              </span>
            </div>
            <h2
              id="flashcards-headline"
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "clamp(1.5rem, 3.5vw, 2.15rem)",
                fontWeight: 700,
                color: "#111827",
                lineHeight: 1.25,
              }}
            >
              Stage 3: Study & Revise
            </h2>
          </div>

          {/* Action pills */}
          <div className="flex items-center gap-2.5">
            {/* View switcher */}
            <div
              className="inline-flex items-center rounded-xl p-1"
              style={{ background: "#ffffff", border: "1px solid #e5e7eb" }}
            >
              <button
                type="button"
                onClick={() => setViewMode("focus")}
                className="text-xs font-semibold rounded-lg transition-all"
                style={{
                  padding: "6px 14px",
                  background: viewMode === "focus" ? "#4f46e5" : "transparent",
                  color: viewMode === "focus" ? "#ffffff" : "#4b5563",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Focus Mode
              </button>
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className="text-xs font-semibold rounded-lg transition-all"
                style={{
                  padding: "6px 14px",
                  background: viewMode === "grid" ? "#4f46e5" : "transparent",
                  color: viewMode === "grid" ? "#ffffff" : "#4b5563",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Grid View
              </button>
            </div>

            {/* Reset / New Video */}
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-1.5 text-xs font-semibold rounded-xl transition-all"
              style={{
                background: "#ffffff",
                border: "1px solid #e5e7eb",
                color: "#374151",
                padding: "8px 16px",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#9ca3af";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#e5e7eb";
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
              </svg>
              New Video
            </button>
          </div>
        </div>

        {/* ── TWO-COLUMN STUDY LAYOUT ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ── LEFT COLUMN: YouTube Video Player ── */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div
              id="study-video-player"
              style={{
                background: "#000000",
                borderRadius: 16,
                overflow: "hidden",
                boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
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
                  style={{ color: "#9ca3af", fontSize: "0.9375rem" }}
                >
                  No video selected
                </div>
              )}
            </div>

            {/* Video player toolbar */}
            <div
              className="flex items-center justify-between rounded-xl"
              style={{
                background: "#ffffff",
                border: "1px solid #e5e7eb",
                padding: "12px 18px",
              }}
            >
              <div className="flex items-center gap-2" style={{ fontSize: "0.8125rem", color: "#4b5563" }}>
                <span style={{ fontSize: "1rem" }}>💡</span>
                <span>
                  Click any card&apos;s <strong style={{ color: "#4f46e5" }}>⏱️ timestamp</strong> to jump to that moment in the video.
                </span>
              </div>
              <a
                href={externalVideoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-semibold text-xs transition-colors shrink-0"
                style={{ color: "#4f46e5", textDecoration: "none" }}
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
                  background: "#ffffff",
                  borderRadius: 16,
                  border: "1.5px solid #e5e7eb",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                  padding: 24,
                }}
              >
                {/* Header & Progress Indicator */}
                <div style={{ marginBottom: 18 }}>
                  <div className="flex items-center justify-between" style={{ marginBottom: 10 }}>
                    <div className="flex items-center gap-2">
                      <span
                        className="font-bold text-xs uppercase tracking-wider rounded-md"
                        style={{
                          background: "#eef2ff",
                          color: "#4f46e5",
                          padding: "2px 8px",
                        }}
                      >
                        Card {currentIndex + 1} of {cards.length}
                      </span>
                      {currentCard?.topic && (
                        <span
                          className="text-xs font-medium truncate max-w-[170px]"
                          style={{
                            color: "#6b7280",
                            background: "#f3f4f6",
                            padding: "2px 8px",
                            borderRadius: 6,
                          }}
                        >
                          {currentCard.topic}
                        </span>
                      )}
                    </div>

                    {/* Timestamp jump button */}
                    {currentCard?.timestamp && (
                      <button
                        type="button"
                        onClick={() => handleSeek(currentCard.timestampSeconds)}
                        title="Jump to video timestamp"
                        className="inline-flex items-center gap-1 text-xs font-semibold rounded-md transition-all cursor-pointer"
                        style={{
                          background: "#fef3c7",
                          color: "#92400e",
                          border: "1px solid #fde68a",
                          padding: "3px 8px",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "#fde68a";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "#fef3c7";
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
                      height: 5,
                      background: "#f3f4f6",
                      borderRadius: 999,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${((currentIndex + 1) / cards.length) * 100}%`,
                        background: "linear-gradient(90deg, #4f46e5 0%, #7c3aed 100%)",
                        transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      }}
                    />
                  </div>
                </div>

                {/* Interactive Flip Card Container with NO TEXT BLEEDING */}
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
                      borderRadius: 14,
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
                        borderRadius: 14,
                        background: "#ffffff",
                        border: "2px solid #e0e7ff",
                        boxShadow: "0 4px 16px rgba(79,70,229,0.08)",
                        padding: "24px 22px",
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
                          className="font-bold text-xs rounded-full"
                          style={{
                            background: "#eef2ff",
                            color: "#4f46e5",
                            padding: "3px 10px",
                          }}
                        >
                          Question
                        </span>
                        <span style={{ fontSize: "0.75rem", color: "#9ca3af" }}>
                          Tap card to reveal answer ⟲
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
                            fontFamily: "'Space Grotesk', sans-serif",
                            fontSize: "1.0625rem",
                            fontWeight: 600,
                            color: "#111827",
                            lineHeight: 1.5,
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
                          borderTop: "1px solid #f3f4f6",
                          fontSize: "0.75rem",
                          color: "#9ca3af",
                        }}
                      >
                        <span>Card {currentIndex + 1} of {cards.length}</span>
                        <span className="font-medium" style={{ color: "#4f46e5" }}>
                          Click to Flip →
                        </span>
                      </div>
                    </div>

                    {/* Back Face (Answer) - Fully scrollable, ZERO bleeding */}
                    <div
                      style={{
                        position: isFlipped ? "relative" : "absolute",
                        inset: 0,
                        backfaceVisibility: "hidden",
                        WebkitBackfaceVisibility: "hidden",
                        transform: "rotateY(180deg)",
                        borderRadius: 14,
                        background: "linear-gradient(145deg, #3730a3 0%, #4f46e5 100%)",
                        boxShadow: "0 6px 20px rgba(79,70,229,0.25)",
                        padding: "24px 22px",
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
                          className="font-bold text-xs rounded-full"
                          style={{
                            background: "rgba(255,255,255,0.18)",
                            color: "#ffffff",
                            padding: "3px 10px",
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
                            className="inline-flex items-center gap-1 text-xs font-semibold rounded-md transition-all cursor-pointer"
                            style={{
                              background: "rgba(255,255,255,0.22)",
                              color: "#ffffff",
                              border: "none",
                              padding: "3px 8px",
                            }}
                          >
                            ⏱️ Replay video at {currentCard.timestamp}
                          </button>
                        )}
                      </div>

                      {/* Answer Text - Safe scrollable container */}
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
                            fontSize: "0.9375rem",
                            color: "#ffffff",
                            lineHeight: 1.6,
                            fontWeight: 400,
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
                          borderTop: "1px solid rgba(255,255,255,0.15)",
                          fontSize: "0.75rem",
                          color: "rgba(255,255,255,0.7)",
                        }}
                      >
                        <span>Explanation</span>
                        <span style={{ color: "#ffffff", fontWeight: 500 }}>
                          Tap to view question ⟲
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Navigation Controls */}
                <div
                  className="flex items-center justify-between gap-2"
                  style={{ marginTop: 20 }}
                >
                  <button
                    type="button"
                    onClick={handlePrev}
                    disabled={currentIndex === 0}
                    className="inline-flex items-center gap-1.5 font-semibold text-xs rounded-xl transition-all"
                    style={{
                      padding: "10px 16px",
                      background: currentIndex === 0 ? "#f3f4f6" : "#ffffff",
                      border: "1.5px solid #e5e7eb",
                      color: currentIndex === 0 ? "#9ca3af" : "#374151",
                      cursor: currentIndex === 0 ? "not-allowed" : "pointer",
                    }}
                  >
                    ← Previous
                  </button>

                  <button
                    type="button"
                    onClick={toggleFlip}
                    className="inline-flex items-center gap-1.5 font-semibold text-xs rounded-xl transition-all"
                    style={{
                      padding: "10px 20px",
                      background: "#4f46e5",
                      color: "#ffffff",
                      border: "none",
                      cursor: "pointer",
                      boxShadow: "0 2px 8px rgba(79,70,229,0.25)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#4338ca";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "#4f46e5";
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
                    className="inline-flex items-center gap-1.5 font-semibold text-xs rounded-xl transition-all"
                    style={{
                      padding: "10px 16px",
                      background: currentIndex === cards.length - 1 ? "#f3f4f6" : "#ffffff",
                      border: "1.5px solid #e5e7eb",
                      color: currentIndex === cards.length - 1 ? "#9ca3af" : "#374151",
                      cursor: currentIndex === cards.length - 1 ? "not-allowed" : "pointer",
                    }}
                  >
                    Next →
                  </button>
                </div>

                {/* Sub-actions (Shuffle, etc.) */}
                <div
                  className="flex items-center justify-center gap-4"
                  style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid #f3f4f6" }}
                >
                  <button
                    type="button"
                    onClick={handleShuffle}
                    className="text-xs font-semibold text-gray-500 hover:text-indigo-600 transition-colors inline-flex items-center gap-1 cursor-pointer"
                    style={{ background: "none", border: "none" }}
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
                  <span style={{ color: "#d1d5db" }}>•</span>
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentIndex(0);
                      setIsFlipped(false);
                    }}
                    className="text-xs font-semibold text-gray-500 hover:text-indigo-600 transition-colors inline-flex items-center gap-1 cursor-pointer"
                    style={{ background: "none", border: "none" }}
                  >
                    Restart from Card 1
                  </button>
                </div>
              </div>
            ) : (
              /* ── GRID MODE: All Cards with Safe Overflow ── */
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between" style={{ marginBottom: 4 }}>
                  <span className="text-xs font-semibold" style={{ color: "#4b5563" }}>
                    Showing all {cards.length} cards
                  </span>
                  <button
                    type="button"
                    onClick={toggleFlipAllGrid}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 underline cursor-pointer"
                    style={{ background: "none", border: "none" }}
                  >
                    Flip All Answers
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
                          background: flipped ? "#312e81" : "#ffffff",
                          border: `1.5px solid ${flipped ? "#4f46e5" : "#e5e7eb"}`,
                          borderRadius: 12,
                          padding: "16px 18px",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                          overflowWrap: "break-word",
                          wordBreak: "break-word",
                        }}
                      >
                        <div className="flex items-center justify-between" style={{ marginBottom: 8 }}>
                          <span
                            className="text-xs font-bold rounded-md"
                            style={{
                              background: flipped ? "rgba(255,255,255,0.2)" : "#eef2ff",
                              color: flipped ? "#ffffff" : "#4f46e5",
                              padding: "2px 8px",
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
                              className="text-xs font-semibold rounded"
                              style={{
                                background: flipped ? "rgba(255,255,255,0.15)" : "#fef3c7",
                                color: flipped ? "#fde68a" : "#92400e",
                                border: "none",
                                padding: "2px 6px",
                                cursor: "pointer",
                              }}
                            >
                              ⏱️ {card.timestamp}
                            </button>
                          )}
                        </div>

                        <p
                          style={{
                            fontSize: "0.875rem",
                            fontWeight: flipped ? 400 : 600,
                            color: flipped ? "#ffffff" : "#111827",
                            lineHeight: 1.5,
                          }}
                        >
                          {flipped ? card.answer : card.question}
                        </p>
                        <span
                          style={{
                            fontSize: "0.75rem",
                            color: flipped ? "rgba(255,255,255,0.6)" : "#9ca3af",
                            marginTop: 8,
                            display: "block",
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
      </div>
    </section>
  );
}
