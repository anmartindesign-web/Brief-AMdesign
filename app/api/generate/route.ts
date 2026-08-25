import { NextRequest, NextResponse } from "next/server";
import { generatePageContent } from "@/lib/ai";
import { ProjectInputs } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 60;

interface GenerateRequestBody {
  templateKey: string;
  pageId: string;
  inputs: ProjectInputs;
  regenerate?: boolean;
}

export async function POST(req: NextRequest) {
  let body: GenerateRequestBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { templateKey, pageId, inputs, regenerate } = body;
  if (!templateKey || !pageId || !inputs) {
    return NextResponse.json(
      { error: "templateKey, pageId and inputs are required." },
      { status: 400 },
    );
  }

  try {
    const content = await generatePageContent({ templateKey, pageId, inputs, regenerate });
    return NextResponse.json({ content });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Generation failed.";
    console.error(`[generate] ${templateKey}/${pageId} failed:`, err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
