const steps = [
  {
    number: "01",
    title: "Paste a YouTube URL",
    description: "Copy any YouTube video link — lecture, tutorial, documentary, or podcast — and paste it into the input above.",
    note: "Supports youtube.com and youtu.be",
  },
  {
    number: "02",
    title: "AI Analyses the Video",
    description: "RecallAI extracts the transcript and uses large language models to identify the ideas and facts worth remembering.",
    note: "Powered by state-of-the-art LLMs",
  },
  {
    number: "03",
    title: "Study Your Flashcards",
    description: "Get a clean Q&A deck built for spaced repetition. Download it or import it into your favourite study tool.",
    note: "Export to Anki, CSV, or Notion",
  },
];

export default function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      aria-labelledby="how-heading"
      style={{ background: "#f8f9fc", padding: "72px 24px" }}
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
            How It Works
          </span>
          <h2
            id="how-heading"
            className="font-bold tracking-tight"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "clamp(1.6rem, 3vw, 2.1rem)",
              color: "#111827",
              marginBottom: 12,
            }}
          >
            Three steps to better retention
          </h2>
          <p style={{ color: "#6b7280", fontSize: "1rem", maxWidth: 420, margin: "0 auto", lineHeight: 1.6 }}>
            From URL to flashcard deck in under 30 seconds. No account. No friction.
          </p>
        </div>

        {/* Steps grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-3"
          style={{ gap: 16, marginBottom: 48 }}
        >
          {steps.map((step) => (
            <div
              key={step.number}
              style={{
                background: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: 14,
                padding: 28,
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              }}
            >
              {/* Step number circle */}
              <div
                className="flex items-center justify-center rounded-full font-bold"
                style={{
                  width: 36,
                  height: 36,
                  background: "#eef2ff",
                  border: "2px solid #c7d2fe",
                  color: "#4f46e5",
                  fontSize: "0.8125rem",
                  fontFamily: "'Space Grotesk', sans-serif",
                  marginBottom: 18,
                  flexShrink: 0,
                }}
              >
                {step.number}
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
                {step.title}
              </h3>
              <p style={{ color: "#6b7280", fontSize: "0.875rem", lineHeight: 1.6, marginBottom: 12 }}>
                {step.description}
              </p>
              <span style={{ fontSize: "0.8125rem", color: "#4f46e5", fontWeight: 500 }}>
                {step.note}
              </span>
            </div>
          ))}
        </div>

        {/* CTA strip */}
        <div
          className="text-center rounded-2xl"
          style={{
            background: "#eef2ff",
            border: "1px solid #c7d2fe",
            padding: "48px 32px",
          }}
        >
          <h3
            className="font-bold"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "1.375rem",
              color: "#111827",
              marginBottom: 10,
            }}
          >
            Ready to study smarter?
          </h3>
          <p style={{ color: "#6b7280", fontSize: "0.9375rem", marginBottom: 24 }}>
            Paste any YouTube URL and see RecallAI in action.
          </p>
          <a
            href="#generate"
            className="inline-flex items-center gap-2 font-semibold text-white rounded-xl no-underline transition-all"
            style={{
              background: "#4f46e5",
              padding: "12px 28px",
              fontSize: "0.9375rem",
              boxShadow: "0 2px 8px rgba(79,70,229,0.3)",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "#4338ca"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(79,70,229,0.4)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#4f46e5"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(79,70,229,0.3)"; }}
          >
            Generate My First Deck
          </a>
        </div>
      </div>
    </section>
  );
}
