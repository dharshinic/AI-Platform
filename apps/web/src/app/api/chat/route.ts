import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

/* ─── Types ──────────────────────────────────────────────────────────────── */
interface RequestBody {
  message: string;
  history?: { role: "user" | "model"; parts: { text: string }[] }[];
}

interface SuccessResponse {
  reply: string;
  model: string;
  tokensUsed?: number;
}

interface ErrorResponse {
  error: string;
  code: string;
}

/* ─── System prompt ──────────────────────────────────────────────────────── */
const SYSTEM_PROMPT = `
You are PrepAI — a warm, knowledgeable UPSC mentor and Indian competitive exam coach.
Your students are preparing for UPSC Civil Services, NEET, JEE, SSC CGL/CHSL, TNPSC, IBPS/SBI Banking, RRB, and State PSC exams.

## YOUR PERSONA
- Speak like a friendly senior IAS officer coaching a bright junior
- Be encouraging, patient, and exam-focused at all times
- Never be vague — every answer must be revision-ready

## RESPONSE RULES (follow strictly)
1. **Length** — Keep answers under 250 words unless the user explicitly asks for a detailed note or essay.
2. **Structure** — Always use clear markdown:
   - ## Heading for the main topic
   - **Bold** for key terms, articles, judgments, schemes
   - Bullet points for lists; tables for comparisons
   - > Blockquotes for important quotes or definitions
3. **Accuracy** — Cite exact Article numbers, Amendment numbers, landmark Supreme Court cases, committee names, and government scheme years. Never fabricate.
4. **Exam tip** — End every answer with a 💡 **Exam Tip** line highlighting what is most frequently tested in Prelims or Mains.
5. **Beginner-friendly** — If a concept is complex, give a one-line plain-English summary before the structured breakdown.
6. **Language** — Reply in the same language the student uses. Support English and Hindi. Mix is fine.
7. **Syllabus mapping** — Where relevant, mention which GS Paper (I / II / III / IV) or subject (Polity, Economy, History, Geography, Environment, Ethics) the topic belongs to.
8. **Off-topic** — If the question is completely unrelated to exam prep or general knowledge, politely redirect: "I'm best at helping with exam topics — try asking me about [suggest a related exam subject]."

## FORMATTING EXAMPLES
- Polity question → cite Article, Amendment, case name + year
- History question → mention date, person, significance in one line each
- Economy question → use data carefully; prefer % ranges over specific figures unless widely established
- Current Affairs → acknowledge if it may be beyond your training data and advise checking a reliable source

Remember: every answer should be something a student can copy into their notes and walk into the exam with confidence.
`.trim();

/* ─── Safety settings ────────────────────────────────────────────────────── */
const SAFETY_SETTINGS = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT,        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,       threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
];

/* ─── Generation config — tuned for concise educational answers ──────────── */
const GENERATION_CONFIG = {
  temperature:     0.5,   // Lower = more factual, less hallucination
  topK:            32,
  topP:            0.9,
  maxOutputTokens: 700,   // ~250–300 words; students can ask for more explicitly
};

/* ─── Friendly client-facing error messages keyed by code ───────────────── */
const ERROR_MESSAGES: Record<string, string> = {
  MISSING_API_KEY:  "Server is not configured correctly. Please contact support.",
  INVALID_JSON:     "We couldn't read your message. Please try again.",
  MISSING_MESSAGE:  "Your message was empty. Please type something!",
  MESSAGE_TOO_LONG: "Your message is too long (max 8 000 characters). Please shorten it.",
  NO_CANDIDATES:    "Your message was flagged by safety filters. Please rephrase and try again.",
  EMPTY_RESPONSE:   "PrepAI didn't return a response. Please try again.",
  AUTH_ERROR:       "API authentication failed. Please check the server configuration.",
  RATE_LIMIT:       "PrepAI is getting a lot of requests right now. Please wait a moment and try again.",
  GEMINI_ERROR:     "PrepAI encountered an error. Please try again in a few seconds.",
};

/* ─── POST handler ───────────────────────────────────────────────────────── */
export async function POST(
  req: NextRequest
): Promise<NextResponse<SuccessResponse | ErrorResponse>> {

  /* 1 ── Validate API key */
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("[PrepAI] GEMINI_API_KEY is not set");
    return errorResponse("MISSING_API_KEY", 500);
  }

  /* 2 ── Parse request body */
  let body: RequestBody;
  try {
    body = await req.json();
  } catch {
    return errorResponse("INVALID_JSON", 400);
  }

  const { message, history = [] } = body;

  if (!message || typeof message !== "string" || message.trim().length === 0) {
    return errorResponse("MISSING_MESSAGE", 400);
  }
  if (message.trim().length > 8000) {
    return errorResponse("MESSAGE_TOO_LONG", 400);
  }

  /* 3 ── Initialise Gemini */
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model:             "gemini-1.5-flash",
    systemInstruction: SYSTEM_PROMPT,
    safetySettings:    SAFETY_SETTINGS,
    generationConfig:  GENERATION_CONFIG,
  });

  /* 4 ── Start chat with history */
  const chat = model.startChat({ history });

  /* 5 ── Send message */
  let reply: string;
  let tokensUsed: number | undefined;

  try {
    const result   = await chat.sendMessage(message.trim());
    const response = result.response;

    if (!response.candidates || response.candidates.length === 0) {
      return errorResponse("NO_CANDIDATES", 422);
    }

    reply = response.text();

    if (!reply || reply.trim().length === 0) {
      return errorResponse("EMPTY_RESPONSE", 422);
    }

    /* Token usage — best-effort */
    try {
      tokensUsed = response.usageMetadata?.totalTokenCount;
    } catch { /* non-critical */ }

  } catch (err: unknown) {
    console.error("[PrepAI] Gemini API error:", err);

    const msg = err instanceof Error ? err.message.toLowerCase() : "";
    if (msg.includes("api key") || msg.includes("unauthorized")) return errorResponse("AUTH_ERROR",   401);
    if (msg.includes("quota")   || msg.includes("rate"))          return errorResponse("RATE_LIMIT",  429);

    return errorResponse("GEMINI_ERROR", 502);
  }

  /* 6 ── Success */
  return NextResponse.json(
    { reply, model: "gemini-1.5-flash", tokensUsed },
    { status: 200 }
  );
}

/* ─── GET guard ──────────────────────────────────────────────────────────── */
export async function GET(): Promise<NextResponse<ErrorResponse>> {
  return NextResponse.json(
    { error: "Method not allowed. Use POST.", code: "METHOD_NOT_ALLOWED" },
    { status: 405 }
  );
}

/* ─── Helper ─────────────────────────────────────────────────────────────── */
function errorResponse(
  code: keyof typeof ERROR_MESSAGES,
  status: number
): NextResponse<ErrorResponse> {
  return NextResponse.json(
    { error: ERROR_MESSAGES[code] ?? "An unexpected error occurred.", code },
    { status }
  );
}