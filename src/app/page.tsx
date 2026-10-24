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
  const [manualTranscript, setManualTranscript] = useState("");
  const [inputTab, setInputTab] = useState<"url" | "notes">("url");
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

    if (inputTab === "url") {
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
    } else {
      if (!manualTranscript.trim() || manualTranscript.trim().length < 30) {
        setError("Please paste at least 30 characters of transcript or study notes.");
        setStatus("error");
        return;
      }
    }

    setIsLoading(true);
    setStatus("loading");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: url.trim(),
          manualTranscript: inputTab === "notes" ? manualTranscript.trim() : undefined,
          mode,
        }),
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
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setError("Network error — please check your connection and try again.");
      setStatus("error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setUrl("");
    setManualTranscript("");
    setError("");
    setStatus("idle");
    setFlashcards([]);
    setVideoId("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--clr-bg)" }}>
      {/* ── SCREEN 2: TWO-COLUMN STUDY STUDIO (REPLACES SCREEN 1 ONCE GENERATED) ── */}
      {status === "success" && flashcards.length > 0 ? (
        <FlashcardsSection
          flashcards={flashcards}
          videoId={videoId}
          mode={mode}
          onReset={handleReset}
        />
      ) : (
        /* ── SCREEN 1: ADD VIDEO URL & SELECT STUDY TYPE ── */
        <>
          <Navbar />
          <HeroSection
            url={url}
            setUrl={setUrl}
            manualTranscript={manualTranscript}
            setManualTranscript={setManualTranscript}
            inputTab={inputTab}
            setInputTab={setInputTab}
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
          <FeaturesSection />
          <HowItWorksSection />
          <Footer />
        </>
      )}
    </div>
  );
}
