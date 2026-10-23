export default function Footer() {
  return (
    <footer
      className="border-t px-6 py-8"
      style={{ borderColor: "var(--clr-border)", background: "var(--clr-surface)" }}
    >
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">

        {/* Logo */}
        <div className="flex items-center gap-2">
          <div
            className="w-[26px] h-[26px] rounded-[6px] flex items-center justify-center"
            style={{ background: "var(--clr-accent)" }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z" />
              <path d="M12 6v6l4 2" />
            </svg>
          </div>
          <span
            className="text-sm font-semibold text-[var(--clr-text)]"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Recall<span style={{ color: "var(--clr-accent)" }}>AI</span>
          </span>
        </div>

        <p className="text-xs text-[var(--clr-muted)] text-center">
          © 2026 RecallAI · Built to help you learn faster
        </p>

        <div className="flex items-center gap-5">
          {["Privacy", "Terms", "Contact"].map((link) => (
            <a
              key={link}
              href="#"
              className="text-xs text-[var(--clr-muted)] hover:text-[var(--clr-text)] transition-colors"
            >
              {link}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
