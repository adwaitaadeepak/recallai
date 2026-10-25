export default function Footer() {
  return (
    <footer
      className="border-t px-6 py-8"
      style={{ borderColor: "rgba(255, 255, 255, 0.08)", background: "#050814" }}
    >
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">

        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div
            className="w-[28px] h-[28px] rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20"
            style={{ background: "linear-gradient(135deg, #5c52ff 0%, #4338ca 100%)" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
          </div>
          <span
            className="text-sm font-bold tracking-tight"
            style={{ fontFamily: "'Unbounded', sans-serif", color: "#ffffff" }}
          >
            Recall<span style={{ color: "#5c52ff" }}>AI</span>
          </span>
        </div>

        <p className="text-xs text-[#94a3b8] text-center" style={{ fontFamily: "'Nunito', sans-serif" }}>
          © 2026 RecallAI · Built to help you learn faster
        </p>

        <div className="flex items-center gap-5">
          {["Privacy", "Terms", "Contact"].map((link) => (
            <a
              key={link}
              href="#"
              className="text-xs text-[#94a3b8] hover:text-[#ffffff] transition-colors font-medium"
              style={{ fontFamily: "'Nunito', sans-serif" }}
            >
              {link}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
