import type { AiProvider, PromptContext, Suggestion } from "./provider";

const styleAlternatives: Record<string, string> = {
  cinematic: "moody cinematic",
  anime: "manga illustration",
  photorealistic: "hyperrealistic photography",
  watercolor: "ink wash painting",
  cyberpunk: "neon noir",
  "concept art": "matte painting",
  "3d render": "CGI render",
  "oil painting": "acrylic painting",
  minimalist: "abstract geometric",
  vaporwave: "retrowave",
};

const lightingAlternatives: Record<string, string> = {
  "golden hour": "blue hour",
  "neon glow": "bioluminescent",
  "dramatic shadows": "chiaroscuro",
  foggy: "misty haze",
  ethereal: "dreamlike glow",
  "rim light": "silhouette lighting",
  "studio lighting": "softbox lighting",
  "natural light": "overcast diffused light",
  backlit: "contre-jour",
  moonlight: "starlight",
};

const qualityModifiers = [
  "highly detailed",
  "8k",
  "sharp focus",
  "professional",
  "masterpiece",
];

const defaultNegatives: Record<string, string> = {
  midjourney: "blurry, deformed, watermark, text, low quality",
  flux: "blurry, watermark, text, signature, low resolution",
  sd: "blurry, deformed, bad anatomy, watermark, text, low quality, extra limbs, duplicate",
  dall: "blurry, watermark, text",
  default: "blurry, deformed, watermark, text, low quality",
};

function getNegativeForModel(targetModel: string): string {
  const key = Object.keys(defaultNegatives).find((k) =>
    targetModel.toLowerCase().includes(k)
  );
  return defaultNegatives[key ?? "default"];
}

export class LocalRulesProvider implements AiProvider {
  name = "Local Rules";

  async optimize(prompt: string, context: PromptContext): Promise<string> {
    let parts = prompt
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean);

    // Remove duplicates (case-insensitive)
    const seen = new Set<string>();
    parts = parts.filter((p) => {
      const lower = p.toLowerCase();
      if (seen.has(lower)) return false;
      seen.add(lower);
      return true;
    });

    // Remove avoid keywords
    if (context.avoidKeywords.length > 0) {
      const avoid = new Set(context.avoidKeywords.map((k) => k.toLowerCase()));
      parts = parts.filter((p) => !avoid.has(p.toLowerCase()));
    }

    // Add weight to first 3 keywords (Midjourney style)
    const isMidjourney = context.targetModel.toLowerCase().includes("midjourney");
    if (isMidjourney) {
      parts = parts.map((p, i) => (i < 3 ? `${p}::1.2` : p));
    }

    let result = parts.join(", ");

    // Clean up double spaces and commas
    result = result.replace(/\s{2,}/g, " ").replace(/,\s*,/g, ",");

    return result;
  }

  async generateVariations(
    prompt: string,
    count: number,
    context: PromptContext
  ): Promise<string[]> {
    const keywords = prompt
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean);

    const variations: string[] = [];

    // Variation 1: Add quality modifiers
    const qualityAdded = [
      ...keywords,
      ...qualityModifiers.filter(
        (m) => !keywords.some((k) => k.toLowerCase().includes(m))
      ),
    ];
    variations.push(qualityAdded.join(", "));

    // Variation 2: Swap styles
    const styleSwapped = keywords.map((k) => {
      const alt = styleAlternatives[k.toLowerCase()];
      return alt ?? k;
    });
    variations.push(styleSwapped.join(", "));

    // Variation 3: Swap lighting
    const lightSwapped = keywords.map((k) => {
      const alt = lightingAlternatives[k.toLowerCase()];
      return alt ?? k;
    });
    variations.push(lightSwapped.join(", "));

    // Variation 4: Minimal version (keep first 3 keywords)
    const minimal = keywords.slice(0, 3);
    variations.push(minimal.join(", "));

    return variations.slice(0, count);
  }

  async suggestImprovements(
    prompt: string,
    rating: number,
    notes: string
  ): Promise<Suggestion[]> {
    const suggestions: Suggestion[] = [];
    const lower = prompt.toLowerCase();

    if (rating <= 2) {
      if (!lower.includes("detailed") && !lower.includes("8k")) {
        suggestions.push({
          type: "add",
          target: "quality",
          suggestion: "Add 'highly detailed, 8k' for better quality",
          reason: "Low-rated prompts often lack quality modifiers",
        });
      }
      if (!lower.includes("--no") && !lower.includes("negative")) {
        suggestions.push({
          type: "add",
          target: "negative prompt",
          suggestion: "Add negative prompt to avoid common artifacts",
          reason: "Missing negative prompt can lead to unwanted artifacts",
        });
      }
    }

    if (!lower.includes("lighting") && !lower.includes("light")) {
      suggestions.push({
        type: "add",
        target: "lighting",
        suggestion: "Add a lighting keyword (e.g., 'golden hour', 'studio lighting')",
        reason: "Lighting significantly improves image quality",
      });
    }

    if (notes.toLowerCase().includes("blur")) {
      suggestions.push({
        type: "add",
        target: "negative prompt",
        suggestion: "Add 'blurry, out of focus' to negative prompt",
        reason: "User noted blurriness in the result",
      });
    }

    return suggestions;
  }
}
