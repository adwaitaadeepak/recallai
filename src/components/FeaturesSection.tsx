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
    description: "Download your deck as CSV or import directly into Anki, Notion, or your favourite study app.",
    accentBg: "#f0f9ff",
    accentColor: "#0284c7",
  },
  {
    emoji: "⏱️",
    title: "Save Hours",
    description: "Stop re-watching videos to jog your memory. Every key insight is captured and ready to review.",
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
    emoji: "🔒",
    title: "Private by Default",
    description: "Your decks are yours alone. We never store video content or share your data with third parties.",
    accentBg: "#fdf2f8",
    accentColor: "#db2777",
  },
];

export default function FeaturesSection() {
  return (
    <section
      id="features"
      aria-labelledby="features-heading"
      style={{ background: "#ffffff", padding: "72px 24px" }}
    >
      <div style={{ maxWidth: 1040, margin: "0 auto" }}>

        {/* Header */}
        <div className="text-center" style={{ marginBottom: 48 }}>
          <span
            className="inline-flex items-center rounded-full text-xs font-semibold"
            style={{
              background: "#eef2ff",
              border: "1px solid #c7d2fe",
              color: "#4f46e5",
              padding: "4px 14px",
              letterSpacing: "0.06em",
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
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "clamp(1.6rem, 3vw, 2.1rem)",
              color: "#111827",
              marginBottom: 12,
            }}
          >
            Everything you need to learn smarter
          </h2>
          <p style={{ color: "#6b7280", fontSize: "1rem", maxWidth: 480, margin: "0 auto", lineHeight: 1.6 }}>
            RecallAI handles the heavy lifting so you can focus on understanding — not note-taking.
          </p>
        </div>

        {/* Grid */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          style={{ gap: 16 }}
        >
          {features.map((feat) => (
            <div
              key={feat.title}
              className="transition-all duration-200"
              style={{
                background: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: 14,
                padding: 24,
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                cursor: "default",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 20px rgba(79,70,229,0.1)";
                (e.currentTarget as HTMLDivElement).style.borderColor = "#c7d2fe";
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.boxShadow = "0 1px 3px rgba(0,0,0,0.05)";
                (e.currentTarget as HTMLDivElement).style.borderColor = "#e5e7eb";
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
              }}
            >
              {/* Icon box */}
              <div
                className="flex items-center justify-center rounded-xl"
                style={{
                  width: 44,
                  height: 44,
                  background: feat.accentBg,
                  fontSize: 20,
                  marginBottom: 14,
                }}
                aria-hidden="true"
              >
                {feat.emoji}
              </div>

              <h3
                className="font-semibold"
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "0.9375rem",
                  color: "#111827",
                  marginBottom: 8,
                }}
              >
                {feat.title}
              </h3>
              <p style={{ color: "#6b7280", fontSize: "0.875rem", lineHeight: 1.6 }}>
                {feat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
