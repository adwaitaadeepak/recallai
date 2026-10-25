const features = [
  {
    emoji: "⚡",
    title: "Instant Extraction",
    description: "Our AI reads the video transcript and pulls out key concepts, definitions, and facts in seconds.",
    accentBg: "#eef2ff",
    accentColor: "#4f46e5",
  },
  {
    emoji: "🃏",
    title: "Smart Flashcards",
    description: "Question-and-answer pairs crafted for active recall — the proven way to move knowledge into long-term memory.",
    accentBg: "#f5f3ff",
    accentColor: "#7c3aed",
  },
  {
    emoji: "⬇️",
    title: "Export & Study",
    description: "Download your deck as CSV with one click to import directly into Anki, Notion, Quizlet, or Excel.",
    accentBg: "#f0f9ff",
    accentColor: "#0284c7",
  },
  {
    emoji: "⏱️",
    title: "Save Hours",
    description: "Stop re-watching long videos to jog your memory. Every key insight is captured and ready to review.",
    accentBg: "#f0fdf4",
    accentColor: "#059669",
  },
  {
    emoji: "📚",
    title: "Any Subject",
    description: "University lectures, coding tutorials, documentaries, TED Talks — RecallAI works across all topics.",
    accentBg: "#fffbeb",
    accentColor: "#d97706",
  },
  {
    emoji: "🎯",
    title: "Timestamp Seeking",
    description: "Jump to the exact second in the video where each flashcard answer is explained with one click.",
    accentBg: "#fdf2f8",
    accentColor: "#db2777",
  },
];

export default function FeaturesSection() {
  return (
    <section
      id="features"
      aria-labelledby="features-heading"
      style={{ background: "#0b1026", padding: "80px 24px" }}
    >
      <div style={{ maxWidth: 1040, margin: "0 auto" }}>

        {/* Header */}
        <div className="text-center" style={{ marginBottom: 48 }}>
          <span
            className="inline-flex items-center rounded-full text-xs font-bold font-mono-accent"
            style={{
              background: "rgba(92, 82, 255, 0.12)",
              border: "1px solid rgba(92, 82, 255, 0.35)",
              color: "#a5b4fc",
              padding: "5px 16px",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              marginBottom: 16,
            }}
          >
            Why RecallAI
          </span>
          <h2
            id="features-heading"
            className="font-bold tracking-tight"
            style={{
              fontFamily: "'Unbounded', sans-serif",
              fontSize: "clamp(1.5rem, 3vw, 2.1rem)",
              color: "#ffffff",
              marginBottom: 12,
            }}
          >
            Everything you need to learn smarter
          </h2>
          <p style={{ color: "#94a3b8", fontSize: "1rem", maxWidth: 500, margin: "0 auto", lineHeight: 1.6, fontFamily: "'Nunito', sans-serif" }}>
            RecallAI handles the heavy lifting so you can focus on understanding — not note-taking.
          </p>
        </div>

        {/* Grid */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          style={{ gap: 18 }}
        >
          {features.map((feat) => (
            <div
              key={feat.title}
              className="transition-all duration-200"
              style={{
                background: "rgba(14, 19, 43, 0.7)",
                backdropFilter: "blur(14px)",
                border: "1px solid rgba(255, 255, 255, 0.09)",
                borderRadius: 20,
                padding: 26,
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
                cursor: "default",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLDivElement).style.boxShadow = "0 12px 36px rgba(92, 82, 255, 0.22)";
                (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(92, 82, 255, 0.4)";
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 32px rgba(0, 0, 0, 0.3)";
                (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255, 255, 255, 0.09)";
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
              }}
            >
              {/* Icon box */}
              <div
                className="flex items-center justify-center rounded-2xl"
                style={{
                  width: 48,
                  height: 48,
                  background: "rgba(92, 82, 255, 0.12)",
                  border: "1px solid rgba(92, 82, 255, 0.25)",
                  fontSize: 22,
                  marginBottom: 16,
                }}
                aria-hidden="true"
              >
                {feat.emoji}
              </div>

              <h3
                className="font-semibold"
                style={{
                  fontFamily: "'Unbounded', sans-serif",
                  fontSize: "0.95rem",
                  color: "#ffffff",
                  marginBottom: 8,
                }}
              >
                {feat.title}
              </h3>
              <p style={{ color: "#94a3b8", fontSize: "0.875rem", lineHeight: 1.6, fontFamily: "'Nunito', sans-serif" }}>
                {feat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
