import { GeneratedContent } from "./types";

// Produces the plain-text version of a generated section for the Copy action —
// exactly what a designer would paste into the actual template.
export function getCopyText(content: GeneratedContent): string {
  switch (content.type) {
    case "richText":
      return content.paragraphs.join("\n\n");

    case "colorPalette":
      return content.colors.map((c) => `${c.name} — ${c.hex}`).join("\n");

    case "typography":
      return [
        content.fonts.map((f) => `${f.name} (${f.role})`).join("\n"),
        "",
        content.paragraphs.join("\n\n"),
      ].join("\n");

    case "brandAssociations":
      return content.associations.join(", ");

    case "brandCharacteristics":
      return content.spectrums
        .map((s) => `${s.leftLabel} — ${s.rightLabel}: ${s.value}/100`)
        .join("\n");

    case "photographyDirections":
      return content.directions.map((d) => `${d.title}\n${d.description}`).join("\n\n");

    case "visionMission":
      return `Vision\n${content.vision}\n\nMission\n${content.mission}`;

    case "toneOfVoice":
      return [
        content.general,
        "",
        ...content.characteristics.map((c) => `${c.title} — ${c.description}`),
      ].join("\n");

    case "brandLanguage":
      return [
        `Tone: ${content.tone}`,
        `Personality: ${content.personality}`,
        `Language Style: ${content.languageStyle}`,
        "",
        "On-brand:",
        ...content.onBrand.map((e) => `"${e.example}" — ${e.whyItWorks}`),
        "",
        "Off-brand:",
        ...content.offBrand.map((e) => `"${e.example}" — ${e.whyItDoesntWork}`),
      ].join("\n");

    case "targetAudience":
      return [
        `Life Stage: ${content.lifeStage}`,
        `Location: ${content.location}`,
        "",
        "Lifestyle & Mindset:",
        ...content.lifestyleMindset.map((s) => `- ${s}`),
        "",
        "Needs & Pain Points:",
        ...content.needsPainPoints.map((s) => `- ${s}`),
        "",
        "Motivations:",
        ...content.motivations.map((s) => `- ${s}`),
        "",
        "What They Value in a Brand:",
        ...content.valuesInBrand.map((s) => `- ${s}`),
        "",
        "What They Are Not Looking For:",
        ...content.notLookingFor.map((s) => `- ${s}`),
      ].join("\n");

    case "photographyStrategy":
      return [
        content.introduction,
        "",
        "Mood & Feel:",
        ...content.moodFeel.map((s) => `- ${s}`),
        "",
        "Approach:",
        ...content.approach.map((s) => `- ${s}`),
        "",
        "What to Avoid:",
        ...content.whatToAvoid.map((s) => `- ${s}`),
      ].join("\n");

    default:
      return "";
  }
}

export function characterCount(content: GeneratedContent): number | null {
  switch (content.type) {
    case "richText":
      return content.paragraphs.join(" ").length;
    case "typography":
      return content.paragraphs.join(" ").length;
    default:
      return null;
  }
}
