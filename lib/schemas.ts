import { ContentType } from "./types";

// JSON Schemas used as Anthropic tool `input_schema` definitions, forcing the
// model to return structured, directly-renderable content instead of loose
// prose. One schema per ContentType; add a new content type by adding an
// entry here and to lib/types.ts / components/content renderers.

const flagsProp = {
  flags: {
    type: "array",
    items: { type: "string" },
    description:
      "Only include this field if key information was missing from the brief and a " +
      "section had to rely on strategic interpretation. Each entry is a short note for " +
      "the designer describing exactly what is missing and should be verified, e.g. " +
      "'No target audience detail in brief -- positioning inferred from product category " +
      "only.' Omit entirely if nothing needs flagging.",
  },
};

export const CONTENT_SCHEMAS: Record<ContentType, object> = {
  richText: {
    type: "object",
    properties: {
      paragraphs: {
        type: "array",
        items: { type: "string" },
        description: "The generated paragraphs, in order, as plain text (no markdown).",
      },
      ...flagsProp,
    },
    required: ["paragraphs"],
  },

  colorPalette: {
    type: "object",
    properties: {
      colors: {
        type: "array",
        description:
          "One entry per provided color code, same order as provided, with the exact same " +
          "hex value echoed back.",
        items: {
          type: "object",
          properties: {
            hex: { type: "string" },
            name: {
              type: "string",
              description: "A distinctive, brand-specific name for this color.",
            },
            rationale: {
              type: "string",
              description:
                "One short sentence on why this name fits the color and the brand.",
            },
          },
          required: ["hex", "name", "rationale"],
        },
      },
      ...flagsProp,
    },
    required: ["colors"],
  },

  typography: {
    type: "object",
    properties: {
      fonts: {
        type: "array",
        description: "One entry per provided font name, same order as provided.",
        items: {
          type: "object",
          properties: {
            name: { type: "string" },
            role: {
              type: "string",
              description:
                "Very short label for its role in the hierarchy, e.g. 'Primary / Display' " +
                "or 'Secondary / Body'.",
            },
          },
          required: ["name", "role"],
        },
      },
      paragraphs: {
        type: "array",
        items: { type: "string" },
        description: "The typography description, in order, as plain text.",
      },
      ...flagsProp,
    },
    required: ["fonts", "paragraphs"],
  },

  brandAssociations: {
    type: "object",
    properties: {
      associations: {
        type: "array",
        items: { type: "string" },
        description: "Exactly 9 one-to-two-word nouns or adjectives.",
      },
      ...flagsProp,
    },
    required: ["associations"],
  },

  brandCharacteristics: {
    type: "object",
    properties: {
      spectrums: {
        type: "array",
        description:
          "Exactly 5 entries in this fixed order: Mature<->Youthful, " +
          "Playful<->Sophisticated, Economical<->Luxurious, Literal<->Abstract, " +
          "Traditional<->Contemporary.",
        items: {
          type: "object",
          properties: {
            leftLabel: { type: "string" },
            rightLabel: { type: "string" },
            value: {
              type: "number",
              description:
                "0-100 position on the spectrum. 0 = fully leftLabel, 100 = fully " +
                "rightLabel, 50 = balanced. Must reflect real strategic judgment.",
            },
            rationale: {
              type: "string",
              description: "One short sentence justifying this position.",
            },
          },
          required: ["leftLabel", "rightLabel", "value", "rationale"],
        },
      },
      ...flagsProp,
    },
    required: ["spectrums"],
  },

  photographyDirections: {
    type: "object",
    properties: {
      directions: {
        type: "array",
        items: {
          type: "object",
          properties: {
            title: { type: "string" },
            description: { type: "string" },
          },
          required: ["title", "description"],
        },
      },
      ...flagsProp,
    },
    required: ["directions"],
  },

  visionMission: {
    type: "object",
    properties: {
      vision: { type: "string" },
      mission: { type: "string" },
      ...flagsProp,
    },
    required: ["vision", "mission"],
  },

  toneOfVoice: {
    type: "object",
    properties: {
      general: { type: "string" },
      characteristics: {
        type: "array",
        description: "Exactly 6 entries.",
        items: {
          type: "object",
          properties: {
            title: { type: "string" },
            description: { type: "string" },
          },
          required: ["title", "description"],
        },
      },
      ...flagsProp,
    },
    required: ["general", "characteristics"],
  },

  brandLanguage: {
    type: "object",
    properties: {
      tone: { type: "string" },
      personality: { type: "string" },
      languageStyle: { type: "string" },
      onBrand: {
        type: "array",
        description: "Exactly 3 entries.",
        items: {
          type: "object",
          properties: {
            example: { type: "string" },
            whyItWorks: { type: "string" },
          },
          required: ["example", "whyItWorks"],
        },
      },
      offBrand: {
        type: "array",
        description: "Exactly 3 entries.",
        items: {
          type: "object",
          properties: {
            example: { type: "string" },
            whyItDoesntWork: { type: "string" },
          },
          required: ["example", "whyItDoesntWork"],
        },
      },
      ...flagsProp,
    },
    required: ["tone", "personality", "languageStyle", "onBrand", "offBrand"],
  },

  targetAudience: {
    type: "object",
    properties: {
      lifeStage: { type: "string" },
      location: { type: "string" },
      lifestyleMindset: { type: "array", items: { type: "string" }, description: "Exactly 4." },
      needsPainPoints: { type: "array", items: { type: "string" }, description: "Exactly 4." },
      motivations: { type: "array", items: { type: "string" }, description: "Exactly 4." },
      valuesInBrand: { type: "array", items: { type: "string" }, description: "Exactly 4." },
      notLookingFor: { type: "array", items: { type: "string" }, description: "Exactly 4." },
      ...flagsProp,
    },
    required: [
      "lifeStage",
      "location",
      "lifestyleMindset",
      "needsPainPoints",
      "motivations",
      "valuesInBrand",
      "notLookingFor",
    ],
  },

  photographyStrategy: {
    type: "object",
    properties: {
      introduction: { type: "string" },
      moodFeel: { type: "array", items: { type: "string" }, description: "Exactly 3." },
      approach: { type: "array", items: { type: "string" }, description: "Exactly 3." },
      whatToAvoid: { type: "array", items: { type: "string" }, description: "Exactly 3." },
      ...flagsProp,
    },
    required: ["introduction", "moodFeel", "approach", "whatToAvoid"],
  },
};
