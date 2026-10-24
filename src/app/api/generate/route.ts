import { YoutubeTranscript } from "youtube-transcript";
import { GoogleGenerativeAI } from "@google/generative-ai";

export interface Flashcard {
  question: string;
  answer: string;
}

export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    if (!url || typeof url !== "string") {
      return Response.json({ error: "Missing or invalid URL." }, { status: 400 });
    }

    // ── Extract video ID ──────────────────────────────────────────────────────
    const videoId = extractVideoId(url);
    if (!videoId) {
      return Response.json({ error: "Could not extract a video ID from the provided URL." }, { status: 400 });
    }

    // ── Fetch transcript ──────────────────────────────────────────────────────
    let transcriptChunks: { text: string }[];
    try {
      transcriptChunks = await YoutubeTranscript.fetchTranscript(videoId);
    } catch (err) {
      console.error("Transcript error:", err);
      return Response.json(
        {
          error:
            "Could not fetch the transcript for this video. Make sure the video has subtitles/captions enabled.",
        },
        { status: 422 }
      );
    }

    const transcript = transcriptChunks.map((c) => c.text).join(" ").trim();

    if (!transcript || transcript.length < 50) {
      return Response.json(
        { error: "The transcript is too short or empty to generate flashcards." },
        { status: 422 }
      );
    }

    // Limit transcript to ~12 000 chars to keep within token limits
    const trimmedTranscript = transcript.slice(0, 12000);

    // ── Generate flashcards with Gemini ───────────────────────────────────────
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "your_gemini_api_key_here") {
      return Response.json(
        { error: "Gemini API key is not configured. Please add GEMINI_API_KEY to .env.local." },
        { status: 503 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const candidateModels = [
      "gemini-3.5-flash-lite",
      "gemini-3.5-flash",
      "gemini-flash-lite-latest",
      "gemini-3.8-flash"
    ];

    const prompt = `You are an expert educator. Based on the following YouTube video transcript, create exactly 8 high-quality flashcards that capture the most important concepts, facts, and ideas.

Return your response as a JSON array with this exact structure (no markdown, no code blocks, just raw JSON):
[
  { "question": "...", "answer": "..." },
  ...
]

Rules:
- Questions and answers MUST ALWAYS be written in English, regardless of the video's original language (translate concepts accurately into English).
- Questions should be specific and test understanding, not just recall
- Answers should be concise but complete (1-3 sentences)
- Cover the breadth of the content, not just the beginning
- Use clear, simple language

TRANSCRIPT:
${trimmedTranscript}`;

    let responseText = "";
    let lastError: unknown = null;

    for (const modelName of candidateModels) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        responseText = result.response.text().trim();
        if (responseText) break;
      } catch (err) {
        lastError = err;
        console.warn(`Model ${modelName} failed, trying next candidate if available...`, err);
      }
    }

    if (!responseText) {
      throw lastError || new Error("Failed to generate content with available Gemini models.");
    }

    // Parse the JSON response
    let flashcards: Flashcard[];
    try {
      // Strip markdown code fences if Gemini wraps it
      let jsonStr = responseText
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();

      // If there's still text before or after the array, extract the JSON array substring
      const arrayMatch = jsonStr.match(/\[\s*\{[\s\S]*\}\s*\]/);
      if (arrayMatch) {
        jsonStr = arrayMatch[0];
      }

      flashcards = JSON.parse(jsonStr);
      if (!Array.isArray(flashcards) || flashcards.length === 0) {
        throw new Error("Not a valid array");
      }
    } catch (parseErr) {
      console.error("Failed to parse Gemini response:", responseText, parseErr);
      return Response.json(
        { error: "The AI returned an unexpected format. Please try again." },
        { status: 500 }
      );
    }

    return Response.json({ flashcards, videoId });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "An unknown error occurred.";
    console.error("API route error:", message);
    return Response.json({ error: message }, { status: 500 });
  }
}

// ── Helper ────────────────────────────────────────────────────────────────────
function extractVideoId(urlStr: string): string | null {
  try {
    const trimmed = urlStr.trim();
    if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;

    const fullUrl = trimmed.startsWith("http://") || trimmed.startsWith("https://")
      ? trimmed
      : `https://${trimmed}`;
    const parsed = new URL(fullUrl);

    if (parsed.hostname.includes("youtube.com")) {
      const v = parsed.searchParams.get("v");
      if (v && /^[a-zA-Z0-9_-]{11}$/.test(v)) return v;
      const pathParts = parsed.pathname.split("/").filter(Boolean);
      if ((pathParts[0] === "shorts" || pathParts[0] === "embed") && pathParts[1]) {
        return pathParts[1].substring(0, 11);
      }
    }
    if (parsed.hostname.includes("youtu.be")) {
      const id = parsed.pathname.replace(/^\//, "").split(/[\/\?]/)[0];
      if (/^[a-zA-Z0-9_-]{11}$/.test(id)) return id;
    }
  } catch {
    // fallback to regex below
  }

  const match = urlStr.match(/(?:v=|\/shorts\/|\/embed\/|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}

