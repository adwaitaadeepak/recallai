const steps = [
  {
    number: "01",
    title: "Paste a YouTube URL",
    description: "Copy any YouTube video link — lecture, tutorial, documentary, or podcast — and paste it into the input above.",
  },
  {
    number: "02",
    title: "AI Analyses the Video",
    description: "RecallAI extracts the transcript and uses large language models to identify the ideas and facts worth remembering.",
  },
  {
    number: "03",
    title: "Study Your Flashcards",
    description: "Review cards in the interactive video-synced study studio, flip to test your recall, or export to CSV in one click.",
  },
];

export default function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      aria-labelledby="how-heading"
      style={{ background: "#080c1e", padding: "80px 24px" }}
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
            How It Works
          </span>
          <h2
            id="how-heading"
            className="font-bold tracking-tight"
            style={{
              fontFamily: "'Unbounded', sans-serif",
              fontSize: "clamp(1.5rem, 3vw, 2.1rem)",
              color: "#ffffff",
              marginBottom: 12,
            }}
          >
            Three steps to better retention
          </h2>
          <p style={{ color: "#94a3b8", fontSize: "1rem", maxWidth: 440, margin: "0 auto", lineHeight: 1.6, fontFamily: "'Nunito', sans-serif" }}>
            From URL to flashcard deck in under 30 seconds. No account. No friction.
          </p>
        </div>

        {/* Steps grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-3"
          style={{ gap: 18, marginBottom: 48 }}
        >
          {steps.map((step) => (
            <div
              key={step.number}
              style={{
                background: "rgba(14, 19, 43, 0.7)",
                backdropFilter: "blur(14px)",
                border: "1px solid rgba(255, 255, 255, 0.09)",
                borderRadius: 20,
                padding: 28,
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
              }}
            >
              {/* Step number circle */}
              <div
                className="flex items-center justify-center rounded-full font-bold"
                style={{
                  width: 40,
                  height: 40,
                  background: "rgba(92, 82, 255, 0.18)",
                  border: "1.5px solid #5c52ff",
                  color: "#c7d2fe",
                  fontSize: "0.875rem",
                  fontFamily: "'Sometype Mono', monospace",
                  marginBottom: 20,
                  flexShrink: 0,
                  boxShadow: "0 0 16px rgba(92, 82, 255, 0.35)",
                }}
              >
                {step.number}
              </div>

              <h3
                className="font-semibold"
                style={{
                  fontFamily: "'Unbounded', sans-serif",
                  fontSize: "0.95rem",
                  color: "#ffffff",
                  marginBottom: 10,
                }}
              >
                {step.title}
              </h3>
              <p style={{ color: "#94a3b8", fontSize: "0.875rem", lineHeight: 1.6, margin: 0, fontFamily: "'Nunito', sans-serif" }}>
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA strip */}
        <div
          className="text-center rounded-3xl"
          style={{
            background: "radial-gradient(ellipse at 50% 50%, rgba(92, 82, 255, 0.22) 0%, rgba(14, 19, 43, 0.85) 100%)",
            border: "1px solid rgba(92, 82, 255, 0.35)",
            boxShadow: "0 24px 60px -12px rgba(0, 0, 0, 0.6), 0 0 40px rgba(92, 82, 255, 0.15)",
            padding: "52px 32px",
          }}
        >
          <h3
            className="font-bold"
            style={{
              fontFamily: "'Unbounded', sans-serif",
              fontSize: "1.35rem",
              color: "#ffffff",
              marginBottom: 10,
            }}
          >
            Ready to study smarter?
          </h3>
          <p style={{ color: "#94a3b8", fontSize: "0.95rem", marginBottom: 26, fontFamily: "'Nunito', sans-serif" }}>
            Paste any YouTube URL and see RecallAI in action.
          </p>
          <a
            href="#generate"
            className="inline-flex items-center gap-2 font-bold text-white rounded-full no-underline transition-all"
            style={{
              background: "linear-gradient(135deg, #5c52ff 0%, #4338ca 100%)",
              padding: "13px 32px",
              fontSize: "0.9375rem",
              boxShadow: "0 0 25px rgba(92, 82, 255, 0.45)",
              fontFamily: "'Nunito', sans-serif",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.filter = "brightness(1.15)";
              e.currentTarget.style.boxShadow = "0 0 32px rgba(92, 82, 255, 0.65)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.filter = "none";
              e.currentTarget.style.boxShadow = "0 0 25px rgba(92, 82, 255, 0.45)";
            }}
          >
            Generate My First Deck
          </a>
        </div>
      </div>
    </section>
  );
}
