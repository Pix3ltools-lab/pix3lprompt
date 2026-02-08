export interface ModelConfig {
  id: string;
  label: string;
  group: "image" | "video" | "audio";
  /** Suffix appended to the assembled prompt (e.g. "--v 6.1") */
  suffix: string;
  /** How aspect ratio is formatted in the prompt */
  arFormat: (ratio: string) => string;
  /** How negative prompt is formatted */
  negFormat: (neg: string) => string;
  /** Placeholder hint for the subject field */
  placeholder: string;
}

function mjAr(ratio: string): string {
  return `--ar ${ratio}`;
}

function plainAr(ratio: string): string {
  return ratio;
}

function mjNeg(neg: string): string {
  return neg ? `--no ${neg}` : "";
}

function plainNeg(neg: string): string {
  return neg ? `Negative prompt: ${neg}` : "";
}

export const modelConfigs: ModelConfig[] = [
  // Image - Midjourney
  {
    id: "midjourney-v7",
    label: "Midjourney v7",
    group: "image",
    suffix: "--v 7",
    arFormat: mjAr,
    negFormat: mjNeg,
    placeholder: "Describe your image...",
  },
  {
    id: "midjourney-v6.1",
    label: "Midjourney v6.1",
    group: "image",
    suffix: "--v 6.1",
    arFormat: mjAr,
    negFormat: mjNeg,
    placeholder: "Describe your image...",
  },
  // Image - Flux
  {
    id: "flux-pro",
    label: "Flux.1 Pro",
    group: "image",
    suffix: "",
    arFormat: plainAr,
    negFormat: plainNeg,
    placeholder: "Describe your image in natural language...",
  },
  {
    id: "flux-dev",
    label: "Flux.1 Dev",
    group: "image",
    suffix: "",
    arFormat: plainAr,
    negFormat: plainNeg,
    placeholder: "Describe your image in natural language...",
  },
  // Image - Stable Diffusion
  {
    id: "sd-3.5",
    label: "SD 3.5",
    group: "image",
    suffix: "",
    arFormat: plainAr,
    negFormat: plainNeg,
    placeholder: "Describe your image with comma-separated keywords...",
  },
  {
    id: "sdxl",
    label: "SDXL",
    group: "image",
    suffix: "",
    arFormat: plainAr,
    negFormat: plainNeg,
    placeholder: "Describe your image with comma-separated keywords...",
  },
  // Image - Others
  {
    id: "leonardo-phoenix",
    label: "Leonardo Phoenix",
    group: "image",
    suffix: "",
    arFormat: plainAr,
    negFormat: plainNeg,
    placeholder: "Describe your image...",
  },
  {
    id: "dall-e-3",
    label: "DALL-E 3",
    group: "image",
    suffix: "",
    arFormat: plainAr,
    negFormat: (neg) => (neg ? `I don't want: ${neg}` : ""),
    placeholder: "Describe your image in natural language...",
  },
  {
    id: "ideogram-2",
    label: "Ideogram 2",
    group: "image",
    suffix: "",
    arFormat: plainAr,
    negFormat: plainNeg,
    placeholder: "Describe your image...",
  },
  // Video
  {
    id: "kling-2.0",
    label: "Kling 2.0",
    group: "video",
    suffix: "",
    arFormat: plainAr,
    negFormat: plainNeg,
    placeholder: "Describe your video scene...",
  },
  {
    id: "runway-gen3",
    label: "Runway Gen-3",
    group: "video",
    suffix: "",
    arFormat: plainAr,
    negFormat: plainNeg,
    placeholder: "Describe the camera movement and scene...",
  },
  {
    id: "pika-2.0",
    label: "Pika 2.0",
    group: "video",
    suffix: "",
    arFormat: plainAr,
    negFormat: plainNeg,
    placeholder: "Describe your video...",
  },
  {
    id: "luma-dream-machine",
    label: "Luma Dream Machine",
    group: "video",
    suffix: "",
    arFormat: plainAr,
    negFormat: plainNeg,
    placeholder: "Describe your video scene...",
  },
  // Audio
  {
    id: "suno-v4",
    label: "Suno v4",
    group: "audio",
    suffix: "",
    arFormat: () => "",
    negFormat: () => "",
    placeholder: "Describe the music genre, mood, instruments...",
  },
  {
    id: "udio",
    label: "Udio",
    group: "audio",
    suffix: "",
    arFormat: () => "",
    negFormat: () => "",
    placeholder: "Describe the music style and mood...",
  },
];

export function getModelConfig(id: string): ModelConfig {
  return (
    modelConfigs.find((m) => m.id === id) ?? modelConfigs[0]
  );
}

export const modelGroups = [
  {
    label: "Image",
    models: modelConfigs.filter((m) => m.group === "image"),
  },
  {
    label: "Video",
    models: modelConfigs.filter((m) => m.group === "video"),
  },
  {
    label: "Audio",
    models: modelConfigs.filter((m) => m.group === "audio"),
  },
];
