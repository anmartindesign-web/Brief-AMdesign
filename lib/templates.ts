import { ChecklistSection, PageConfig, TemplateConfig } from "./types";

// ---------------------------------------------------------------------------
// Shared checklist blocks (Medium extends Minimal, Premium extends Medium)
// ---------------------------------------------------------------------------

const MINIMAL_CHECKLIST: ChecklistSection[] = [
  {
    title: "Header",
    items: ["Check that the current logo is updated in the header."],
  },
  {
    title: "Pages",
    items: [
      "Check that all page numbers are correct.",
      "Check that logo versions are correct throughout the document.",
      "Check that all project-specific elements have been updated.",
    ],
  },
  {
    title: "Typography",
    items: [
      "Check that all font names are updated.",
      "Check that no old font names remain.",
      "Check that font links are correct.",
    ],
  },
  {
    title: "Final",
    items: [
      "Check for old brand names.",
      "Check for placeholder text.",
      "Check for elements from previous projects.",
      "Review all generated content before final export.",
    ],
  },
];

const VISUAL_SYSTEM_CHECKLIST: ChecklistSection = {
  title: "Visual System",
  items: [
    "Graphic elements correspond to the current brand.",
    "Textures correspond to the current brand.",
    "No graphic elements from previous projects remain.",
    "Visual elements support the current brand strategy.",
  ],
};

const PREMIUM_STRATEGIC_REVIEW_CHECKLIST: ChecklistSection = {
  title: "Strategic Content Review",
  items: [
    "Vision reviewed.",
    "Mission reviewed.",
    "Brand Characteristics reviewed.",
    "Brand Message reviewed.",
    "Tone of Voice reviewed.",
    "Brand Language reviewed.",
    "Brand Associations reviewed.",
    "Target Audience reviewed.",
    "Logo Concept reviewed.",
    "Color Palettes reviewed.",
    "Typography reviewed.",
    "Photography Strategy reviewed.",
    "Photography Directions reviewed.",
  ],
};

// ---------------------------------------------------------------------------
// Reusable requirement fragments (keep the strategic spec in one place)
// ---------------------------------------------------------------------------

const LOGO_CONCEPT_REQUIREMENTS =
  "Write approximately 867 characters total, structured as exactly 3 paragraphs. " +
  "Paragraph 1: the main idea behind the logo. Paragraph 2: the relationship between the " +
  "brand name and the logo. Paragraph 3: the meaning of the symbol and the overall visual " +
  "language. Connect the visual solution to the brand strategy -- explain why the visual " +
  "idea makes sense for this brand, not merely what it looks like.";

const TYPOGRAPHY_REQUIREMENTS =
  "Write approximately 400 characters total across approximately 2 short paragraphs. " +
  "Describe the character of the typography, its role within the visual identity, and why " +
  "it works for this brand. Do not invent technical facts about the fonts beyond what is " +
  "reasonable from their names and known classification.";

const BRAND_MESSAGE_REQUIREMENTS =
  "Write approximately 400-600 characters across approximately 2 paragraphs. Communicate " +
  "the central idea and value of the brand in a strategically meaningful way.";

const BRAND_ASSOCIATIONS_REQUIREMENTS =
  "Generate exactly 9 brand associations. Each must be one word, or at most two words, " +
  "using nouns or adjectives. Describe how the brand should be perceived, not the product " +
  "itself.";

const BRAND_CHARACTERISTICS_REQUIREMENTS =
  "Determine the brand's position on exactly these five spectrums, in this order: " +
  "Mature <-> Youthful, Playful <-> Sophisticated, Economical <-> Luxurious, " +
  "Literal <-> Abstract, Traditional <-> Contemporary. Base each position on the brand " +
  "strategy, audience, positioning and visual identity -- do not default to the middle and " +
  "do not choose values randomly. Each value must meaningfully differentiate this brand.";

const photographyDirectionsRequirements = (count: number) =>
  `Generate exactly ${count} photography directions. For each: a title of 3-4 words maximum, ` +
  "and a description of approximately 20-25 words. Each direction must be strategically " +
  "relevant to this specific brand -- avoid generic photography descriptions.";

// ---------------------------------------------------------------------------
// MINIMAL v1 -- ~22 pages, 3 generated pages
// ---------------------------------------------------------------------------

const MINIMAL_V1_PAGES: PageConfig[] = [
  {
    id: "logoConcept",
    pageNumber: "03",
    pageName: "Logo Concept",
    contentType: "richText",
    usesLogo: true,
    requirements: LOGO_CONCEPT_REQUIREMENTS,
  },
  {
    id: "primaryColorPalette",
    pageNumber: "10",
    pageName: "Primary Color Palette",
    contentType: "colorPalette",
    colorInput: { paletteKey: "primary", count: 5 },
    requirements:
      "For each provided color code, identify the color and generate a distinctive, brand-" +
      "specific name grounded in the brand's personality and visual world. Use the provided " +
      "HEX code as the factual basis and never alter it. Avoid generic names when a more " +
      "distinctive but appropriate name is possible, and keep the naming system coherent " +
      "across the palette.",
  },
  {
    id: "typography",
    pageNumber: "12",
    pageName: "Typography",
    contentType: "typography",
    fontInput: { count: 2 },
    requirements: TYPOGRAPHY_REQUIREMENTS,
  },
];

const MINIMAL_V1: TemplateConfig = {
  key: "MINIMAL_V1",
  brandBookType: "MINIMAL",
  version: "v1",
  label: "Minimal",
  approxPageCount: 22,
  description:
    "A lean, essentials-only brand book. Only the logo concept, primary palette and " +
    "typography need strategic copy -- every other page is a static template page.",
  pages: MINIMAL_V1_PAGES,
  checklist: MINIMAL_CHECKLIST,
};

// ---------------------------------------------------------------------------
// MEDIUM v1 -- ~35 pages, 8 generated pages
// ---------------------------------------------------------------------------

const MEDIUM_V1_PAGES: PageConfig[] = [
  {
    id: "logoConcept",
    pageNumber: "05",
    pageName: "Logo Concept",
    contentType: "richText",
    usesLogo: true,
    requirements: LOGO_CONCEPT_REQUIREMENTS,
  },
  {
    id: "brandMessage",
    pageNumber: "06",
    pageName: "Brand Message",
    contentType: "richText",
    requirements: BRAND_MESSAGE_REQUIREMENTS,
  },
  {
    id: "brandAssociations",
    pageNumber: "07",
    pageName: "Brand Associations",
    contentType: "brandAssociations",
    requirements: BRAND_ASSOCIATIONS_REQUIREMENTS,
  },
  {
    id: "brandCharacteristics",
    pageNumber: "08",
    pageName: "Brand Characteristics",
    contentType: "brandCharacteristics",
    requirements: BRAND_CHARACTERISTICS_REQUIREMENTS,
  },
  {
    id: "primaryColorPalette",
    pageNumber: "15",
    pageName: "Primary Color Palette",
    contentType: "colorPalette",
    colorInput: { paletteKey: "primary", count: 5 },
    requirements:
      "For each provided color code, identify the color and generate a distinctive, brand-" +
      "specific name grounded in the brand's personality and visual world. Never alter the " +
      "provided HEX codes.",
  },
  {
    id: "secondaryColorPalette",
    pageNumber: "16",
    pageName: "Secondary Color Palette",
    contentType: "colorPalette",
    colorInput: { paletteKey: "secondary", count: 3 },
    requirements:
      "Same naming logic as the primary palette: generate suitable, distinctive brand-" +
      "specific names for the provided secondary colors, consistent with the primary " +
      "palette's naming system. Never alter the provided HEX codes.",
  },
  {
    id: "typography",
    pageNumber: "18",
    pageName: "Typography",
    contentType: "typography",
    fontInput: { count: 2 },
    requirements: TYPOGRAPHY_REQUIREMENTS,
  },
  {
    id: "photography",
    pageNumber: "21",
    pageName: "Photography",
    contentType: "photographyDirections",
    requirements: photographyDirectionsRequirements(3),
  },
];

const MEDIUM_V1: TemplateConfig = {
  key: "MEDIUM_V1",
  brandBookType: "MEDIUM",
  version: "v1",
  label: "Medium",
  approxPageCount: 35,
  description:
    "A fuller strategic package: logo concept, brand message, associations, brand " +
    "characteristics, both color palettes, typography and photography direction.",
  pages: MEDIUM_V1_PAGES,
  checklist: [...MINIMAL_CHECKLIST, VISUAL_SYSTEM_CHECKLIST],
};

// ---------------------------------------------------------------------------
// PREMIUM v1 -- ~52 pages, 13 generated pages
// ---------------------------------------------------------------------------

const PREMIUM_V1_PAGES: PageConfig[] = [
  {
    id: "visionMission",
    pageNumber: "05",
    pageName: "Vision & Mission",
    contentType: "visionMission",
    requirements:
      "Generate a Vision (one paragraph, approximately 45-50 words maximum) and a Mission " +
      "(one paragraph, approximately 45-50 words maximum). Both must be strategically " +
      "specific to this brand -- never generic corporate statements.",
  },
  {
    id: "brandCharacteristics",
    pageNumber: "06",
    pageName: "Brand Characteristics",
    contentType: "brandCharacteristics",
    requirements: BRAND_CHARACTERISTICS_REQUIREMENTS,
  },
  {
    id: "brandMessage",
    pageNumber: "07",
    pageName: "Brand Message",
    contentType: "richText",
    requirements: BRAND_MESSAGE_REQUIREMENTS,
  },
  {
    id: "toneOfVoice",
    pageNumber: "08",
    pageName: "Tone of Voice",
    contentType: "toneOfVoice",
    requirements:
      "Generate a General Tone of Voice description of approximately 40 words, following " +
      "the logic 'The brand speaks with...' (rephrase naturally if a different formulation " +
      "reads better). Then generate exactly 6 Tone of Voice characteristics, each with a " +
      "short, memorable title (e.g. 'Calm and Confident') and a description of " +
      "approximately 13-15 words explaining how that characteristic appears in actual " +
      "communication -- practical and specific, not abstract.",
  },
  {
    id: "brandLanguage",
    pageNumber: "09",
    pageName: "Brand Language",
    contentType: "brandLanguage",
    requirements:
      "Generate Tone, Personality and Language Style, each approximately 10-15 words " +
      "maximum. Then generate exactly 3 on-brand language examples (a short realistic " +
      "phrase plus 1-2 sentences on why it works) and exactly 3 off-brand language " +
      "examples (a short phrase plus 1-2 sentences on why it doesn't work, demonstrating " +
      "language that conflicts with this brand's actual personality and positioning).",
  },
  {
    id: "brandAssociations",
    pageNumber: "10",
    pageName: "Brand Associations",
    contentType: "brandAssociations",
    requirements: BRAND_ASSOCIATIONS_REQUIREMENTS,
  },
  {
    id: "targetAudience",
    pageNumber: "11",
    pageName: "Target Audience",
    contentType: "targetAudience",
    requirements:
      "Generate: Life Stage (max 2 short lines, approximately 8-10 words); Location (one " +
      "concise phrase); Lifestyle & Mindset (exactly 4 points, approximately 5-7 words " +
      "each); Needs & Pain Points (exactly 4 points, approximately 5-7 words each); " +
      "Motivations (exactly 4 points, approximately 5-7 words each); What They Value in a " +
      "Brand (exactly 4 points, approximately 5-7 words each); What They Are Not Looking " +
      "For (exactly 4 points, approximately 5-7 words each). Avoid generic demographic " +
      "description -- focus on meaningful behavioral, psychological and purchasing " +
      "characteristics.",
  },
  {
    id: "logoConcept",
    pageNumber: "13",
    pageName: "Logo Concept",
    contentType: "richText",
    usesLogo: true,
    requirements: LOGO_CONCEPT_REQUIREMENTS,
  },
  {
    id: "primaryColorPalette",
    pageNumber: "22",
    pageName: "Primary Color Palette",
    contentType: "colorPalette",
    colorInput: { paletteKey: "primary", count: 5 },
    requirements:
      "For each provided color code, identify the color and generate a distinctive, brand-" +
      "specific name grounded in the brand's personality and visual world. Never alter the " +
      "provided HEX codes.",
  },
  {
    id: "secondaryColorPalette",
    pageNumber: "24",
    pageName: "Secondary Color Palette",
    contentType: "colorPalette",
    colorInput: { paletteKey: "secondary", count: 3 },
    requirements:
      "Same naming logic as the primary palette: generate suitable, distinctive brand-" +
      "specific names for the provided secondary colors, consistent with the primary " +
      "palette's naming system. Never alter the provided HEX codes.",
  },
  {
    id: "typography",
    pageNumber: "28",
    pageName: "Typography",
    contentType: "typography",
    fontInput: { count: 2 },
    requirements: TYPOGRAPHY_REQUIREMENTS,
  },
  {
    id: "photographyStrategy",
    pageNumber: "41",
    pageName: "Photography Strategy",
    contentType: "photographyStrategy",
    requirements:
      "Generate an Introduction of approximately 30-40 words explaining the strategic role " +
      "of photography in expressing the brand, following the idea 'Photography plays a key " +
      "role in expressing the [...] of the brand' (do not copy this sentence mechanically " +
      "if another formulation is more natural). Then generate exactly 3 Mood & Feel points " +
      "(approximately 5-10 words each), exactly 3 Approach points (short, practical " +
      "phrases) and exactly 3 What to Avoid points (short, practical phrases). All " +
      "recommendations must be specific to this brand.",
  },
  {
    id: "photography",
    pageNumber: "42",
    pageName: "Photography",
    contentType: "photographyDirections",
    requirements: photographyDirectionsRequirements(3),
  },
];

const PREMIUM_V1: TemplateConfig = {
  key: "PREMIUM_V1",
  brandBookType: "PREMIUM",
  version: "v1",
  label: "Premium",
  approxPageCount: 52,
  description:
    "The full strategic package -- vision & mission, tone of voice, brand language, " +
    "target audience, photography strategy and more -- layered on top of the additional " +
    "static visualization and application pages.",
  pages: PREMIUM_V1_PAGES,
  checklist: [
    ...MINIMAL_CHECKLIST,
    VISUAL_SYSTEM_CHECKLIST,
    PREMIUM_STRATEGIC_REVIEW_CHECKLIST,
  ],
};

// ---------------------------------------------------------------------------
// Registry -- keyed so future template versions can be added without
// touching any UI code (e.g. register "MINIMAL_V2" and point the type
// selector at it).
// ---------------------------------------------------------------------------

export const TEMPLATE_REGISTRY: Record<string, TemplateConfig> = {
  MINIMAL_V1,
  MEDIUM_V1,
  PREMIUM_V1,
};

/** The currently active template version for each brand book type. */
export const ACTIVE_TEMPLATE_KEY: Record<BrandBookTypeKey, string> = {
  MINIMAL: "MINIMAL_V1",
  MEDIUM: "MEDIUM_V1",
  PREMIUM: "PREMIUM_V1",
};

type BrandBookTypeKey = "MINIMAL" | "MEDIUM" | "PREMIUM";

export function getActiveTemplate(type: BrandBookTypeKey): TemplateConfig {
  return TEMPLATE_REGISTRY[ACTIVE_TEMPLATE_KEY[type]];
}

export function getTemplateByKey(key: string): TemplateConfig | undefined {
  return TEMPLATE_REGISTRY[key];
}

export function getPageConfig(
  templateKey: string,
  pageId: string,
): PageConfig | undefined {
  return getTemplateByKey(templateKey)?.pages.find((p) => p.id === pageId);
}
