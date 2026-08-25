import { ContentType, GeneratedContent } from "./types";

// Placeholder content shown (briefly, in a skeleton state) before a page's
// first generation call resolves. Never rendered as real content — PageCard
// always shows a loading skeleton while status is "generating".
export function emptyContent(type: ContentType): GeneratedContent {
  switch (type) {
    case "richText":
      return { type, paragraphs: [] };
    case "colorPalette":
      return { type, colors: [] };
    case "typography":
      return { type, fonts: [], paragraphs: [] };
    case "brandAssociations":
      return { type, associations: [] };
    case "brandCharacteristics":
      return { type, spectrums: [] };
    case "photographyDirections":
      return { type, directions: [] };
    case "visionMission":
      return { type, vision: "", mission: "" };
    case "toneOfVoice":
      return { type, general: "", characteristics: [] };
    case "brandLanguage":
      return { type, tone: "", personality: "", languageStyle: "", onBrand: [], offBrand: [] };
    case "targetAudience":
      return {
        type,
        lifeStage: "",
        location: "",
        lifestyleMindset: [],
        needsPainPoints: [],
        motivations: [],
        valuesInBrand: [],
        notLookingFor: [],
      };
    case "photographyStrategy":
      return { type, introduction: "", moodFeel: [], approach: [], whatToAvoid: [] };
  }
}

export function emptyProjectInputs() {
  return {
    brief: "",
    logo: null,
    primaryColors: [],
    secondaryColors: [],
    fonts: [],
  };
}
