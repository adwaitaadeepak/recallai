"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import Footer from "@/components/Footer";

/** What state the generator is in after a button press. */
export type GenerateStatus =
  | "idle"       // nothing has happened yet
  | "loading"    // request in flight
  | "not_ready"  // validated URL but backend not yet implemented
  | "error";     // URL validation failed

export default function Home() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState<GenerateStatus>("idle");

  const isValidYouTubeUrl = (value: string): boolean => {
    // Accepts: youtube.com/watch?v=, youtube.com/shorts/, youtu.be/, youtube.com/embed/
    const pattern =
      /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|shorts\/|embed\/)|youtu\.be\/)[\w\-]{11}/;
    return pattern.test(value.trim());
  };

  const handleGenerate = () => {
    // Reset previous status
    setError("");
    setStatus("idle");

    if (!url.trim()) {
      setError("Please paste a YouTube URL before generating.");
      setStatus("error");
      return;
    }

    if (!isValidYouTubeUrl(url)) {
      setError(
        "That doesn't look like a valid YouTube URL. Try something like https://www.youtube.com/watch?v=…"
      );
      setStatus("error");
      return;
    }

    // URL is valid — show loading, then surface the "not yet implemented" message
    setIsLoading(true);
    setStatus("loading");

    // Simulate the async step that will eventually call the AI backend.
    // We resolve immediately to "not_ready" because transcript extraction
    // is not yet implemented. No fake flashcards are generated.
    setTimeout(() => {
      setIsLoading(false);
      setStatus("not_ready");
    }, 1200);
  };

  const handleReset = () => {
    setUrl("");
    setError("");
    setStatus("idle");
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--clr-bg)" }}>
      <Navbar />
      <HeroSection
        url={url}
        setUrl={setUrl}
        error={error}
        setError={setError}
        isLoading={isLoading}
        status={status}
        onGenerate={handleGenerate}
        onReset={handleReset}
      />
      <FeaturesSection />
      <HowItWorksSection />
      <Footer />
    </div>
  );
}
