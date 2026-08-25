import { NextRequest, NextResponse } from "next/server";
import { extractBriefFromPdf } from "@/lib/ai";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  let body: { base64?: string; mediaType?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!body.base64) {
    return NextResponse.json({ error: "base64 is required." }, { status: 400 });
  }

  try {
    const text = await extractBriefFromPdf(body.base64, body.mediaType);
    return NextResponse.json({ text });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Extraction failed.";
    console.error("[extract-brief] failed:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
