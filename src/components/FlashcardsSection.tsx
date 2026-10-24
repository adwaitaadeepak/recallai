"use client";

import { useState } from "react";
import type { Flashcard } from "@/app/api/generate/route";

interface FlashcardsSectionProps {
  flashcards: Flashcard[];
  videoId: string;
  onReset: () => void;
}

export default function FlashcardsSection({
  flashcards,
  videoId,
  onReset,
}: FlashcardsSectionProps) {
  const [flipped, setFlipped] = useState<Record<number, boolean>>({});
  const [activeCard, setActiveCard] = useState<number | null>(null);

  const toggle = (idx: number) => {
    setFlipped((prev) => ({ ...prev, [idx]: !prev[idx] }));
    setActiveCard(idx);
  };

  const flipAll = () => {
    const allFlipped = flashcards.every((_, i) => flipped[i]);
    const next: Record<number, boolean> = {};
    flashcards.forEach((_, i) => { next[i] = !allFlipped; });
    setFlipped(next);
  };

  const videoUrl = videoId ? `https://www.youtube.com/watch?v=${videoId}` : "#";

  return (
    <section
      id="flashcards-results"
      aria-labelledby="flashcards-headline"
      style={{
        background: "linear-gradient(180deg, #f8f9fc 0%, #eef2ff 100%)",
        padding: "64px 24px 80px",
      }}
    >
      <div style={{ maxWidth: 860, margin: "0 auto" }}>

        {/* ── Header ── */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <span
            className="inline-flex items-center gap-1.5 text-xs font-semibold rounded-full"
            style={{
              background: "#eef2ff",
              border: "1px solid #c7d2fe",
              color: "#4f46e5",
              padding: "4px 14px",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              marginBottom: 16,
              display: "inline-flex",
            }}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            {flashcards.length} Flashcards Generated
          </span>

          <h2
            id="flashcards-headline"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
              fontWeight: 700,
              color: "#111827",
              marginBottom: 12,
              lineHeight: 1.2,
            }}
          >
            Your Study Cards Are Ready
          </h2>
          <p style={{ color: "#6b7280", fontSize: "1rem", marginBottom: 28 }}>
            Tap any card to reveal the answer. Click{" "}
            <strong style={{ color: "#4f46e5" }}>Flip All</strong> to show or hide all answers.
          </p>

          {/* Action bar */}
          <div className="flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={flipAll}
              className="inline-flex items-center gap-2 font-semibold rounded-xl transition-all"
              style={{
                background: "#4f46e5",
                color: "#fff",
                border: "none",
                padding: "10px 22px",
                fontSize: "0.9rem",
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(79,70,229,0.25)",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#4338ca"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "#4f46e5"; }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M17 1l4 4-4 4" /><path d="M3 11V9a4 4 0 0 1 4-4h14" />
                <path d="M7 23l-4-4 4-4" /><path d="M21 13v2a4 4 0 0 1-4 4H3" />
              </svg>
              Flip All
            </button>

            <a
              href={videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-semibold rounded-xl transition-all"
              style={{
                background: "#fff",
                color: "#374151",
                border: "1.5px solid #e5e7eb",
                padding: "10px 22px",
                fontSize: "0.9rem",
                textDecoration: "none",
                boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#4f46e5"; e.currentTarget.style.color = "#4f46e5"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.color = "#374151"; }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <rect x="2" y="5" width="20" height="14" rx="3" fill="#FF0000" />
                <polygon points="10,9 10,15 16,12" fill="white" />
              </svg>
              Watch Video
            </a>

            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-2 font-semibold rounded-xl transition-all"
              style={{
                background: "#fff",
                color: "#374151",
                border: "1.5px solid #e5e7eb",
                padding: "10px 22px",
                fontSize: "0.9rem",
                cursor: "pointer",
                boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#6b7280"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e5e7eb"; }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
              </svg>
              New Video
            </button>
          </div>
        </div>

        {/* ── Flashcards grid ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 20,
          }}
        >
          {flashcards.map((card, idx) => {
            const isFlipped = !!flipped[idx];
            const isActive = activeCard === idx;

            return (
              <div
                key={idx}
                role="button"
                tabIndex={0}
                aria-pressed={isFlipped}
                aria-label={`Flashcard ${idx + 1}: ${card.question}`}
                onClick={() => toggle(idx)}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") toggle(idx); }}
                style={{
                  perspective: "1000px",
                  height: 200,
                  cursor: "pointer",
                  outline: "none",
                }}
              >
                {/* Card wrapper that flips */}
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    height: "100%",
                    transformStyle: "preserve-3d",
                    transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                    transition: "transform 0.45s cubic-bezier(0.4, 0.2, 0.2, 1)",
                    borderRadius: 14,
                    boxShadow: isActive
                      ? "0 8px 30px rgba(79,70,229,0.18)"
                      : "0 2px 8px rgba(0,0,0,0.08)",
                  }}
                >
                  {/* Front face */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      backfaceVisibility: "hidden",
                      borderRadius: 14,
                      background: "#ffffff",
                      border: "1.5px solid #e5e7eb",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      padding: "20px 22px",
                    }}
                  >
                    {/* Card number badge */}
                    <span
                      style={{
                        fontSize: "0.7rem",
                        fontWeight: 700,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        color: "#4f46e5",
                        background: "#eef2ff",
                        borderRadius: 20,
                        padding: "2px 10px",
                        alignSelf: "flex-start",
                      }}
                    >
                      Q {idx + 1}
                    </span>

                    <p
                      style={{
                        fontFamily: "'Space Grotesk', sans-serif",
                        fontWeight: 600,
                        fontSize: "0.9375rem",
                        color: "#111827",
                        lineHeight: 1.45,
                        flex: 1,
                        display: "flex",
                        alignItems: "center",
                        marginTop: 12,
                      }}
                    >
                      {card.question}
                    </p>

                    <p style={{ fontSize: "0.75rem", color: "#9ca3af", marginTop: 12 }}>
                      Tap to reveal answer →
                    </p>
                  </div>

                  {/* Back face */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      backfaceVisibility: "hidden",
                      borderRadius: 14,
                      background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                      border: "1.5px solid #4f46e5",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      padding: "20px 22px",
                      transform: "rotateY(180deg)",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.7rem",
                        fontWeight: 700,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        color: "rgba(255,255,255,0.7)",
                        background: "rgba(255,255,255,0.15)",
                        borderRadius: 20,
                        padding: "2px 10px",
                        alignSelf: "flex-start",
                      }}
                    >
                      Answer
                    </span>

                    <p
                      style={{
                        fontSize: "0.9rem",
                        color: "#ffffff",
                        lineHeight: 1.55,
                        flex: 1,
                        display: "flex",
                        alignItems: "center",
                        marginTop: 12,
                      }}
                    >
                      {card.answer}
                    </p>

                    <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.55)", marginTop: 12 }}>
                      Tap to see question
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Footer tip ── */}
        <p
          style={{
            textAlign: "center",
            marginTop: 40,
            fontSize: "0.85rem",
            color: "#9ca3af",
          }}
        >
          Pro tip: Study each card until you can answer without peeking 💡
        </p>
      </div>
    </section>
  );
}
