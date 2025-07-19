import { NextResponse } from 'next/server';
import mammoth from 'mammoth';
import pdf from 'pdf-parse/lib/pdf-parse';
import winston from 'winston';

const TOGETHER_API_KEY = process.env.TOGETHER_API_KEY!;
const TOGETHER_ENDPOINT = 'https://api.together.xyz/v1/chat/completions';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
  transports: [new winston.transports.Console()],
});

const systemPrompt = `
You are an expert legal analyst and assistant.

Your task is to **analyze a Terms of Service (ToS) document** and produce a **clear, actionable, concise report in **exactly valid JSON format and nothing else.**

🎯 **Output rules:**
- Output only **valid JSON**, no markdown, no comments, no code block markers.
- The JSON object must have **exactly these keys and no others:**

{
  "summary": "string — a concise summary of the most important points of the Terms of Service, written in clear, user-friendly language, maximum 5–7 sentences.",
  "red_flags": [
    "string — unique potential risks, problematic clauses, or areas of concern for users. Include any clauses that limit user rights, privacy risks, arbitration clauses, etc. Each as a clear, actionable sentence."
  ],
  "financial_clauses": [
    "string — unique clauses that impose fees, penalties, monetary obligations, automatic renewals, early termination charges, or other financial terms. Each as a clear, actionable sentence."
  ],
  "recommendations": [
    "string — unique, actionable best practices or next steps for users to protect themselves, avoid risks, or better understand their rights. Each as a clear, actionable sentence."
  ]
}

🎯 **Guidelines:**
- Use **plain, accessible language** — avoid legal jargon unless absolutely necessary.
- Deduplicate points — if the same issue appears more than once in the document, include it only once, phrased clearly.
- Prioritize — include only the most relevant points, ideally no more than 5–7 per list.
- If no \`red_flags\`, \`financial_clauses\`, or \`recommendations\` are found, return an empty array \`[]\` for that field — never omit, never use null.
- Always produce **well-formed, syntactically correct JSON** — validate your output before returning.

🎯 **Tone:**
- Objective, factual, and user-focused.
- Do not speculate — include only what is clearly stated or strongly implied in the document.

🎯 **Fallbacks:**
If a section (summary, red_flags, financial_clauses, recommendations) cannot be populated, still include the key and fallback to:
- \`summary\`: "No summary provided."
- \`red_flags\`: []
- \`financial_clauses\`: []
- \`recommendations\`: []

---

Here is the Terms of Service document to analyze:
`;

export async function POST(req: Request) {
  const startTime = Date.now();
  logger.info(`[API] Request started`, { timestamp: new Date().toISOString() });

  const formData = await req.formData();
  const text = formData.get('text')?.toString().trim();
  const url = formData.get('url')?.toString().trim();
  const file = formData.get('file') as File | null;

  let content = '';

  if (text) {
    logger.info(`[API] Input type: text`);
    content = text;
  } else if (url) {
    logger.info(`[API] Input type: URL`);
    const res = await fetch(url);
    content = await res.text();
  } else if (file) {
    logger.info(`[API] Input type: file (${file.name})`);
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = file.name.toLowerCase();

    if (fileName.endsWith('.pdf')) {
      const result = await pdf(buffer);
      content = result.text;
    } else if (fileName.endsWith('.docx')) {
      const result = await mammoth.extractRawText({ buffer });
      content = result.value;
    } else {
      content = buffer.toString('utf-8');
    }
  } else {
    logger.error(`[API] No valid input`);
    return NextResponse.json({ error: 'No valid input provided.' }, { status: 400 });
  }

  const { sanitized, logs } = sanitize(content);
  logger.info(`[API] Redacted items:`, logs);
  logger.info(`[API] Content sanitized`, { length: sanitized.length });

  if (sanitized.length > 60000) {
    logger.warn(`[API] Content may exceed token limit`);
  }

  const chunks = splitIntoChunks(sanitized);
  logger.info(`[API] Chunk count: ${chunks.length}`);

  const partials = [];
  for (const [i, chunk] of chunks.entries()) {
    logger.info(`[API] Analyzing chunk ${i + 1}/${chunks.length}`);
    const result = await analyzeChunk(chunk);
    partials.push(result);
  }

  const merged = mergeResults(partials);

  const endTime = Date.now();
  logger.info(`[API] Analysis completed in ${(endTime - startTime) / 1000}s`);

  return NextResponse.json({ analysis: merged, redacted: logs });
}

function sanitize(text: string) {
  const patterns = [
    /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi,
    /\b\d{3}[-.\s]?\d{2}[-.\s]?\d{4}\b/g,
    /\b\d{10,}\b/g,
    /\b\d{1,3}(?:\.\d{1,3}){3}\b/g,
  ];

  const logs: string[] = [];
  let sanitized = text;

  patterns.forEach((pattern) => {
    sanitized = sanitized.replace(pattern, (match) => {
      logs.push(match);
      return '[REDACTED]';
    });
  });

  return { sanitized, logs };
}

function splitIntoChunks(text: string, maxChars = 12000): string[] {
  const chunks: string[] = [];
  let start = 0;

  while (start < text.length) {
    let end = start + maxChars;
    const nextPeriod = text.lastIndexOf('.', end);
    if (nextPeriod > start) end = nextPeriod + 1;
    chunks.push(text.slice(start, end).trim());
    start = end;
  }

  return chunks;
}

async function analyzeChunk(content: string) {
  const res = await fetch(TOGETHER_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${TOGETHER_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'meta-llama/Llama-3-70b-chat-hf',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content },
      ],
      temperature: 0,
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    logger.error(`[Together] API error`, err);
    throw new Error('Together API error');
  }

  const data = await res.json();
  const output = data.choices?.[0]?.message?.content ?? '';
  try {
    return JSON.parse(output);
  } catch {
    logger.warn(`[Together] Failed to parse JSON`);
    return {
      summary: '',
      red_flags: [],
      financial_clauses: [],
      recommendations: [],
    };
  }
}

function mergeResults(results: any[]) {
  const dedup = (arr: string[]) => [...new Set(arr)];
  return {
    summary: results.map(r => r.summary).join(' '),
    red_flags: dedup(results.flatMap(r => r.red_flags || [])),
    financial_clauses: dedup(results.flatMap(r => r.financial_clauses || [])),
    recommendations: dedup(results.flatMap(r => r.recommendations || [])),
  };
}