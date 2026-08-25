import { GoogleGenAI, Part } from "@google/genai";
import { CONTENT_SCHEMAS } from "./schemas";
import { getPageConfig, getTemplateByKey } from "./templates";
import { ContentType, GeneratedContent, PageConfig, ProjectInputs } from "./types";

const MODEL = process.env.GEMINI_MODEL || "gemini-flash-latest";

let client: GoogleGenAI | null = null;
function getClient(): GoogleGenAI {
  if (!client) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error(
        "GEMINI_API_KEY is not configured. Add it to your environment to enable generation.",
      );
    }
    client = new GoogleGenAI({ apiKey });
  }
  return client;
}

// ---------------------------------------------------------------------------
// System prompt -- establishes the AI's strategic role and non-negotiable
// rules. Shared across every generation call.
// ---------------------------------------------------------------------------

const SYSTEM_PROMPT = `You are the strategic content engine inside an internal production tool used by \
professional brand design studios. For every request you must think simultaneously as a Senior \
Brand Strategist, a Marketing Strategist, a Brand Consultant, a Creative Director and a \
Professional Brand Copywriter. You are not a generic text generator, and your output must never \
read like one.

Before writing anything, silently analyze the material you are given -- the client brief and, \
when provided, the logo/visual identity -- to form your own strategic understanding of: the \
business, the product or service, the target audience, the market/category, the positioning, the \
brand personality, the differentiators, the emotional and functional benefits, the desired \
perception, the visual identity, and how the logo, typography and color choices relate back to \
the brand strategy. Nobody will tell you which of these to extract -- you determine that \
yourself from what is actually in the brief. Do not follow a rigid methodology or checklist \
format in the writing itself; use professional strategic judgment about what matters most for \
this particular brand.

Non-negotiable information rule: never invent factual information about the company, founder, \
product, market, customers, statistics, awards, history, competitors or business claims. When \
information is missing, use reasonable strategic interpretation where possible, but never present \
an assumption as if it were a stated fact. If missing information makes a section impossible to \
complete accurately, still produce the best strategically sound content you can and use the \
"flags" field to note precisely what is missing and should be verified by the designer.

Visual analysis rule (when a logo image is provided): observe what is actually visible -- symbol, \
shape, geometry, typographic treatment, letterforms, composition, negative space, visual balance, \
overall character. Use these observations together with the brief to explain the relationship \
between the visual solution and the brand strategy. Never claim a hidden meaning the design \
cannot reasonably support.

Color rule: you will be given real HEX codes that must never be altered. For each, identify the \
color's true visual character, then create a distinctive but believable name that reflects the \
brand's personality and world -- avoid generic names ("Deep Blue") when something more specific \
and coherent with the rest of the palette is possible. Names across a palette should feel like \
one coherent naming system, not unrelated one-offs.

Typography rule: you will be given real font names that must never be altered or fabricated. \
Reason from what is reasonably knowable about the named fonts (serif/sans/display character, \
general personality, typical hierarchy and readability role) and connect that to the brand. Do \
not state precise technical specifications you cannot know from the name alone.

Brand characteristics rule: slider positions must be a genuine strategic interpretation of this \
brand's audience, positioning, product, personality, visual identity, category and desired \
perception. Do not default every brand toward the middle of every spectrum -- push confidently \
toward one side wherever the brief and visual identity support it, and keep values believable \
and consistent with everything else you produce for this brand.

Writing quality rule: every section must read as if it were written specifically for this one \
brand. Avoid generic marketing language, empty adjectives, cliches, repetitive wording, \
artificially sophisticated language, unsupported claims, overly poetic description, generic color \
psychology, and generic photography recommendations. Prioritize strategic precision over filling \
space -- respect the requested lengths and counts exactly.

You must always respond with a single JSON object that matches the provided response schema \
exactly. Never include any explanation, preamble, markdown formatting, or chain-of-thought in \
your response -- only the strategic content itself, as raw JSON.`;

// ---------------------------------------------------------------------------
// Prompt construction
// ---------------------------------------------------------------------------

function colorListText(colors: { hex: string }[], label: string): string {
  if (colors.length === 0) return `No ${label} color codes were provided.`;
  return `${label} color codes (do not alter these, in this exact order): ${colors
    .map((c) => c.hex)
    .join(", ")}`;
}

function fontListText(fonts: { name: string }[]): string {
  if (fonts.length === 0) return "No font names were provided.";
  return `Font names (do not alter or invent facts beyond these, in this exact order): ${fonts
    .map((f) => f.name)
    .join(", ")}`;
}

function buildUserPrompt(
  page: PageConfig,
  inputs: ProjectInputs,
  variationSeed?: string,
): string {
  const parts: string[] = [];

  parts.push(`BRAND BOOK PAGE: Page ${page.pageNumber} -- "${page.pageName}"`);
  parts.push(`CONTENT REQUIREMENTS:\n${page.requirements}`);
  if (page.specialInstructions) {
    parts.push(`ADDITIONAL INSTRUCTIONS:\n${page.specialInstructions}`);
  }

  parts.push(`CLIENT BRIEF:\n"""\n${inputs.brief.trim() || "(no brief text provided)"}\n"""`);

  if (page.colorInput) {
    const colors =
      page.colorInput.paletteKey === "primary" ? inputs.primaryColors : inputs.secondaryColors;
    parts.push(colorListText(colors, page.colorInput.paletteKey));
  }

  if (page.fontInput) {
    parts.push(fontListText(inputs.fonts));
  }

  if (page.usesLogo) {
    parts.push(
      inputs.logo
        ? "The project logo is attached as an image (or document) with this message -- analyze it visually as instructed."
        : "No logo file was uploaded. Base the logo concept only on how the brand name and any described visual direction in the brief connect to the brand strategy, and flag that no logo image was available to analyze visually.",
    );
  }

  if (variationSeed) {
    parts.push(
      `This is a regeneration. Produce a genuinely different version from before -- vary the ` +
        `angle, wording and emphasis while respecting the exact same requirements, length and ` +
        `format. Do not just paraphrase the previous version. Variation token: ${variationSeed}.`,
    );
  }

  return parts.join("\n\n");
}

// ---------------------------------------------------------------------------
// Generation
// ---------------------------------------------------------------------------

export interface GenerateOptions {
  templateKey: string;
  pageId: string;
  inputs: ProjectInputs;
  regenerate?: boolean;
}

export async function generatePageContent({
  templateKey,
  pageId,
  inputs,
  regenerate,
}: GenerateOptions): Promise<GeneratedContent> {
  const template = getTemplateByKey(templateKey);
  if (!template) throw new Error(`Unknown template: ${templateKey}`);
  const page = getPageConfig(templateKey, pageId);
  if (!page) throw new Error(`Unknown page "${pageId}" for template ${templateKey}`);

  const variationSeed = regenerate ? Math.random().toString(36).slice(2, 8) : undefined;
  const promptText = buildUserPrompt(page, inputs, variationSeed);

  const parts: Part[] = [{ text: promptText }];

  if (page.usesLogo && inputs.logo) {
    const base64 = stripDataUrlPrefix(inputs.logo.dataUrl);
    const mimeType = inputs.logo.kind === "pdf" ? "application/pdf" : inputs.logo.mediaType;
    parts.push({ inlineData: { data: base64, mimeType } });
  }

  const schema = CONTENT_SCHEMAS[page.contentType];

  const response = await getClient().models.generateContent({
    model: MODEL,
    contents: [{ role: "user", parts }],
    config: {
      systemInstruction: SYSTEM_PROMPT,
      temperature: regenerate ? 1 : 0.7,
      maxOutputTokens: 4096,
      responseMimeType: "application/json",
      responseJsonSchema: schema,
    },
  });

  const text = response.text;
  if (!text) {
    throw new Error("The model did not return structured content. Please try again.");
  }

  let parsed: object;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error("The model returned malformed content. Please try again.");
  }

  return { type: page.contentType, ...parsed } as GeneratedContent;
}

// ---------------------------------------------------------------------------
// Brief extraction (PDF -> plain text), run once at upload time
// ---------------------------------------------------------------------------

export async function extractBriefFromPdf(
  base64: string,
  mediaType: string = "application/pdf",
): Promise<string> {
  const response = await getClient().models.generateContent({
    model: MODEL,
    contents: [
      {
        role: "user",
        parts: [
          { inlineData: { data: base64, mimeType: mediaType } },
          { text: "Transcribe this document's full text content." },
        ],
      },
    ],
    config: {
      systemInstruction:
        "You transcribe documents into clean plain text for downstream processing. Return only " +
        "the full textual content of the document, preserving meaning and structure with simple " +
        "line breaks. Do not summarize, do not add commentary, do not invent content that is not " +
        "in the document.",
      maxOutputTokens: 8192,
    },
  });

  return response.text?.trim() || "";
}

function stripDataUrlPrefix(dataUrl: string): string {
  const commaIndex = dataUrl.indexOf(",");
  return commaIndex >= 0 && dataUrl.startsWith("data:") ? dataUrl.slice(commaIndex + 1) : dataUrl;
}

export type { ContentType };
