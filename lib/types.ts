// Core domain types for the Brand Book Content Generator.
// This file defines the shapes shared between the template configuration
// system (lib/templates.ts), the AI generation layer (lib/ai.ts,
// lib/schemas.ts) and the UI (components/*).

export type BrandBookType = "MINIMAL" | "MEDIUM" | "PREMIUM";

/**
 * Every distinct shape of AI-generated content the app knows how to render,
 * edit and regenerate. Adding a new brand book template rarely requires a
 * new ContentType -- most pages reuse one of these.
 */
export type ContentType =
  | "richText"
  | "colorPalette"
  | "typography"
  | "brandAssociations"
  | "brandCharacteristics"
  | "photographyDirections"
  | "visionMission"
  | "toneOfVoice"
  | "brandLanguage"
  | "targetAudience"
  | "photographyStrategy";

export interface PageConfig {
  /** Stable unique id, independent of page number (e.g. "logoConcept"). */
  id: string;
  /** Printed page number in the physical template, preserved as-is. */
  pageNumber: string;
  pageName: string;
  contentType: ContentType;
  /** Whether this page's generation should analyze the uploaded logo image. */
  usesLogo?: boolean;
  /** Structured, designer-provided colors this page needs named (not invented). */
  colorInput?: { paletteKey: "primary" | "secondary"; count: number };
  /** Structured, designer-provided font names this page needs described. */
  fontInput?: { count: number };
  /** Natural-language generation brief handed to the model for this page. */
  requirements: string;
  /** Extra strategic framing specific to this page. */
  specialInstructions?: string;
}

export interface ChecklistSection {
  title: string;
  items: string[];
}

export interface TemplateConfig {
  /** e.g. "MINIMAL_V1" -- lets future versions coexist (MINIMAL_V2, ...). */
  key: string;
  brandBookType: BrandBookType;
  version: string;
  label: string;
  approxPageCount: number;
  description: string;
  pages: PageConfig[];
  /** Checklist shown on Screen 5, already flattened for this template. */
  checklist: ChecklistSection[];
}

// ---------------------------------------------------------------------------
// Structured designer-provided inputs (never invented by the AI)
// ---------------------------------------------------------------------------

export interface ColorInput {
  hex: string;
}

export interface FontInput {
  name: string;
}

export interface ProjectInputs {
  brief: string;
  logo: { dataUrl: string; mediaType: string; kind: "image" | "pdf" } | null;
  primaryColors: ColorInput[];
  secondaryColors: ColorInput[];
  fonts: FontInput[];
}

// ---------------------------------------------------------------------------
// Generated content payloads, one variant per ContentType
// ---------------------------------------------------------------------------

export interface RichTextContent {
  type: "richText";
  paragraphs: string[];
  flags?: string[];
}

export interface ColorPaletteContent {
  type: "colorPalette";
  colors: { hex: string; name: string; rationale: string }[];
  flags?: string[];
}

export interface TypographyContent {
  type: "typography";
  fonts: { name: string; role: string }[];
  paragraphs: string[];
  flags?: string[];
}

export interface BrandAssociationsContent {
  type: "brandAssociations";
  associations: string[];
  flags?: string[];
}

export interface BrandCharacteristicsContent {
  type: "brandCharacteristics";
  spectrums: {
    leftLabel: string;
    rightLabel: string;
    value: number; // 0-100, 0 = fully left label, 100 = fully right label
    rationale: string;
  }[];
  flags?: string[];
}

export interface PhotographyDirectionsContent {
  type: "photographyDirections";
  directions: { title: string; description: string }[];
  flags?: string[];
}

export interface VisionMissionContent {
  type: "visionMission";
  vision: string;
  mission: string;
  flags?: string[];
}

export interface ToneOfVoiceContent {
  type: "toneOfVoice";
  general: string;
  characteristics: { title: string; description: string }[];
  flags?: string[];
}

export interface BrandLanguageContent {
  type: "brandLanguage";
  tone: string;
  personality: string;
  languageStyle: string;
  onBrand: { example: string; whyItWorks: string }[];
  offBrand: { example: string; whyItDoesntWork: string }[];
  flags?: string[];
}

export interface TargetAudienceContent {
  type: "targetAudience";
  lifeStage: string;
  location: string;
  lifestyleMindset: string[];
  needsPainPoints: string[];
  motivations: string[];
  valuesInBrand: string[];
  notLookingFor: string[];
  flags?: string[];
}

export interface PhotographyStrategyContent {
  type: "photographyStrategy";
  introduction: string;
  moodFeel: string[];
  approach: string[];
  whatToAvoid: string[];
  flags?: string[];
}

export type GeneratedContent =
  | RichTextContent
  | ColorPaletteContent
  | TypographyContent
  | BrandAssociationsContent
  | BrandCharacteristicsContent
  | PhotographyDirectionsContent
  | VisionMissionContent
  | ToneOfVoiceContent
  | BrandLanguageContent
  | TargetAudienceContent
  | PhotographyStrategyContent;

export interface GeneratedPage {
  pageId: string;
  pageNumber: string;
  pageName: string;
  contentType: ContentType;
  content: GeneratedContent;
  /** True once the designer has hand-edited the content post-generation. */
  edited: boolean;
  status: "idle" | "generating" | "error";
  error?: string;
}
