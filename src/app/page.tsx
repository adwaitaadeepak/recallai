"use client";

import { useState } from "react";
import type { Flashcard, StudyMode } from "@/app/api/generate/route";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FlashcardsSection from "@/components/FlashcardsSection";
import FeaturesSection from "@/components/FeaturesSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import Footer from "@/components/Footer";

/** What state the generator is in after a button press. */
export type GenerateStatus =
  | "idle"       // nothing has happened yet
  | "loading"    // request in flight
  | "success"    // flashcards returned
  | "error";     // URL validation or API error

export default function Home() {
  const [url, setUrl] = useState("");
  const [mode, setMode] = useState<StudyMode>("basic");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState<GenerateStatus>("idle");
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [videoId, setVideoId] = useState<string>("");

  const isValidYouTubeUrl = (value: string): boolean => {
    const trimmed = value.trim();
    if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return true;
    return /(?:youtube\.com\/(?:watch\?.*v=|shorts\/|embed\/)|youtu\.be\/)[\w\-]{11}/.test(trimmed);
  };

  const handleGenerate = async () => {
    setError("");
    setStatus("idle");
    setFlashcards([]);

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

    setIsLoading(true);
    setStatus("loading");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim(), mode }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      setFlashcards(data.flashcards);
      setVideoId(data.videoId ?? "");
      setStatus("success");

      // Auto-scroll down smoothly to the study flashcards
      setTimeout(() => {
        document.getElementById("flashcards-results")?.scrollIntoView({ behavior: "smooth" });
      }, 150);
    } catch {
      setError("Network error — please check your connection and try again.");
      setStatus("error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setUrl("");
    setError("");
    setStatus("idle");
    setFlashcards([]);
    setVideoId("");
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
        mode={mode}
        setMode={setMode}
        flashcardCount={flashcards.length}
        onGenerate={handleGenerate}
        onReset={handleReset}
      />
      {status === "success" && flashcards.length > 0 && (
        <FlashcardsSection
          flashcards={flashcards}
          videoId={videoId}
          mode={mode}
          onReset={handleReset}
        />
      )}
      {status !== "success" && (
        <>
          <FeaturesSection />
          <HowItWorksSection />
        </>
      )}
      <Footer />
    </div>
  );
}
