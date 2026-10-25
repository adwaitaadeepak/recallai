import { YoutubeTranscript } from "youtube-transcript";
import { GoogleGenerativeAI } from "@google/generative-ai";

export type StudyMode = "basic" | "intensive";

export interface Flashcard {
  question: string;
  answer: string;
  topic?: string;
  timestamp?: string;
  timestampSeconds?: number;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { url } = body;
    const mode: StudyMode = body.mode === "intensive" ? "intensive" : "basic";

    let timestampedTranscript = "";
    let videoId: string | null = null;

    if (!url || typeof url !== "string") {
      return Response.json({ error: "Missing or invalid URL." }, { status: 400 });
    }

    // ── Extract video ID ──────────────────────────────────────────────────────
    videoId = extractVideoId(url);
    if (!videoId) {
      return Response.json({ error: "Could not extract a video ID from the provided URL." }, { status: 400 });
    }

    // ── Fetch transcript ──────────────────────────────────────────────────────
    let transcriptChunks: { text: string; offset: number; duration?: number }[] | null = null;

      // 1. Try Supadata API first with mode=auto (native captions first, automatic AI Whisper audio fallback if captions missing)
      const supadataKey = process.env.SUPADATA_API_KEY;
      if (supadataKey && supadataKey !== "your_supadata_api_key_here") {
        try {
          const ytUrl = `https://www.youtube.com/watch?v=${videoId}`;
          const supaRes = await fetch(
            `https://api.supadata.ai/v1/transcript?url=${encodeURIComponent(ytUrl)}&mode=auto`,
            {
              headers: {
                "x-api-key": supadataKey,
                "Content-Type": "application/json",
              },
            }
          );

          if (supaRes.status === 202) {
            // 202 Accepted: AI Whisper audio transcription job queued for uncaptioned video — poll for result
            const supaData = await supaRes.json();
            const jobId = supaData.jobId;
            if (jobId) {
              // Poll for completion (up to ~75 seconds for AI Whisper audio transcription)
              for (let attempt = 0; attempt < 30; attempt++) {
                await new Promise((resolve) => setTimeout(resolve, 2500));
                const pollRes = await fetch(`https://api.supadata.ai/v1/transcript/${jobId}`, {
                  headers: {
                    "x-api-key": supadataKey,
                    "Content-Type": "application/json",
                  },
                });
                if (pollRes.ok) {
                  const pollData = await pollRes.json();
                  if (pollData.status === "completed" && Array.isArray(pollData.content)) {
                    transcriptChunks = pollData.content;
                    break;
                  } else if (pollData.status === "failed") {
                    console.warn("Supadata AI transcription job failed.");
                    break;
                  }
                }
              }
            }
          } else if (supaRes.ok) {
            // 200: transcript returned immediately (video has native captions)
            const supaData = await supaRes.json();
            if (Array.isArray(supaData.content) && supaData.content.length > 0) {
              transcriptChunks = supaData.content;
            }
          } else {
            console.warn("Supadata API returned status:", supaRes.status);
          }
        } catch (supaErr) {
          console.warn("Supadata fetch failed, falling back to direct scraper:", supaErr);
        }
      }

      // 2. Fall back to standard YoutubeTranscript scraper if Supadata wasn't used or returned no items
      if (!transcriptChunks || transcriptChunks.length === 0) {
        try {
          transcriptChunks = await YoutubeTranscript.fetchTranscript(videoId);
        } catch (err) {
          console.error("Transcript error:", err);
          const supadataConfigured = !!(process.env.SUPADATA_API_KEY && process.env.SUPADATA_API_KEY !== "your_supadata_api_key_here");
          return Response.json(
            {
              error: supadataConfigured
                ? "Could not fetch a transcript for this video — captions are disabled and AI audio transcription also failed. Try a different video."
                : "Could not fetch transcript for this video. Captions may be disabled on YouTube. Set a SUPADATA_API_KEY to enable automatic AI audio transcription for videos without captions.",
            },
            { status: 422 }
          );
        }
      }

      if (!transcriptChunks || transcriptChunks.length === 0) {
        return Response.json(
          { error: "The transcript is empty or unavailable for this video." },
          { status: 422 }
        );
      }

      // Build timestamped transcript lines (grouped every ~20s) so Gemini can cite accurate video timestamps
      function formatTimestamp(ms: number): string {
        const totalSeconds = Math.max(0, Math.floor(ms / 1000));
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
      }

      let lastOffset = -30000;
      for (const chunk of transcriptChunks) {
        if (chunk.offset - lastOffset >= 20000) {
          timestampedTranscript += `\n[${formatTimestamp(chunk.offset)}] ${chunk.text}`;
          lastOffset = chunk.offset;
        } else {
          timestampedTranscript += ` ${chunk.text}`;
        }
      }
      timestampedTranscript = timestampedTranscript.trim();

    if (timestampedTranscript.length < 50) {
      return Response.json(
        { error: "The transcript is too short to generate flashcards." },
        { status: 422 }
      );
    }

    // Dynamic transcript limit: Basic: 18,000 chars; Intensive: up to 65,000 chars
    const transcriptLimit = mode === "intensive" ? 65000 : 18000;
    const trimmedTranscript = timestampedTranscript.slice(0, transcriptLimit);

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

    const prompt = mode === "intensive"
      ? `You are an expert educator and curriculum designer conducting a content-aware, in-depth mastery analysis of a video.
Analyze the following timestamped video transcript to:
1. Identify all meaningful topics, key subtopics, architectural principles, trade-offs, and practical applications.
2. Dynamically determine the appropriate number of flashcards needed based on content complexity and topic coverage (aiming for approximately 2 well-crafted questions per meaningful topic/subtopic). Do NOT base the count solely on duration.
3. Generate a balanced mix of question types:
   - Conceptual: core definitions and key terminology
   - Explanatory: how and why mechanisms work under the hood
   - Comparison-based: trade-offs, differences between approaches
   - Application-based: real-world scenarios and practical decisions

Rules:
- Questions and answers MUST ALWAYS be written in clear English, regardless of the video's original language.
- Do NOT artificially restrict to 8 cards. Generate as many as needed to thoroughly cover all topics (capped at a maximum of 40 flashcards).
- Include the approximate "timestamp" (MM:SS) and "timestampSeconds" (integer seconds) from the transcript tags where this concept is discussed.
- Questions must test deep understanding, not surface trivia.
- Answers should be comprehensive, accurate, and easy to read (2-4 sentences explaining the 'why' and context).
- Cover the entire video material thoroughly, avoiding duplicate or repetitive questions.
- Return your response as a JSON array with this exact structure (no markdown, no code blocks, just raw JSON):
[
  {
    "question": "...",
    "answer": "...",
    "topic": "Specific Topic Name",
    "timestamp": "MM:SS",
    "timestampSeconds": 125
  }
]

TRANSCRIPT:
${trimmedTranscript}`
      : `You are an expert educator creating a quick revision study set.
Analyze the following timestamped video transcript to identify the top core concepts and takeaways.
Generate approximately 5 to 10 (target ~8) concise, high-priority flashcards for rapid revision.

Rules:
- Questions and answers MUST ALWAYS be written in clear English, regardless of the video's original language.
- Questions should be clear, concise, and beginner-friendly for quick review.
- Answers should be direct, punchy, and clear (1-2 sentences).
- Prioritize only the most essential fundamental concepts.
- Include the approximate "timestamp" (MM:SS) and "timestampSeconds" (integer seconds) from the transcript tags where this concept is discussed.
- Generate between 5 and 10 flashcards total.
- Avoid duplicate questions.
- Return your response as a JSON array with this exact structure (no markdown, no code blocks, just raw JSON):
[
  {
    "question": "...",
    "answer": "...",
    "topic": "Topic Name",
    "timestamp": "MM:SS",
    "timestampSeconds": 45
  }
]

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

      // Hard cap at 40 flashcards to control response time & complexity
      if (flashcards.length > 40) {
        flashcards = flashcards.slice(0, 40);
      }
    } catch (parseErr) {
      console.error("Failed to parse Gemini response:", responseText, parseErr);
      return Response.json(
        { error: "The AI returned an unexpected format. Please try again." },
        { status: 500 }
      );
    }

    return Response.json({ flashcards, videoId, mode });
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

