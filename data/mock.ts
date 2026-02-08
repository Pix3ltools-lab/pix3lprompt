// Mock data for Phase 1 layout shell

export interface MockPrompt {
  id: number;
  subject: string;
  styles: string[];
  lighting: string[];
  assembledPrompt: string;
  targetModel: string;
  rating: number | null;
  createdAt: string;
}

export interface StyleChip {
  id: string;
  label: string;
}

export interface LightingPreset {
  id: string;
  label: string;
}

export interface Template {
  id: number;
  name: string;
  subject: string;
  preview: string;
  styles: string[];
  lighting: string[];
  aspectRatio: string;
  details: string;
  category: "quick-start" | "favorites";
}

export const mockPrompts: MockPrompt[] = [
  {
    id: 1,
    subject: "A futuristic cityscape at sunset",
    styles: ["cyberpunk", "cinematic"],
    lighting: ["golden hour", "neon glow"],
    assembledPrompt:
      "A futuristic cityscape at sunset, cyberpunk, cinematic, golden hour, neon glow, highly detailed, 8k --ar 16:9 --v 6.1",
    targetModel: "Midjourney v6.1",
    rating: 5,
    createdAt: "2025-01-15T10:30:00Z",
  },
  {
    id: 2,
    subject: "Portrait of a samurai warrior",
    styles: ["anime", "concept art"],
    lighting: ["dramatic shadows", "rim light"],
    assembledPrompt:
      "Portrait of a samurai warrior, anime style, concept art, dramatic shadows, rim light, sharp focus --ar 3:2 --v 6.1 --stylize 750",
    targetModel: "Midjourney v6.1",
    rating: 4,
    createdAt: "2025-01-14T15:45:00Z",
  },
  {
    id: 3,
    subject: "Enchanted forest with bioluminescent plants",
    styles: ["watercolor", "surrealist"],
    lighting: ["bioluminescent", "foggy"],
    assembledPrompt:
      "Enchanted forest with bioluminescent plants, watercolor, surrealist, bioluminescent glow, foggy atmosphere, ethereal --ar 1:1",
    targetModel: "Flux.1 Pro",
    rating: 3,
    createdAt: "2025-01-13T08:20:00Z",
  },
  {
    id: 4,
    subject: "Steampunk airship flying over mountains",
    styles: ["steampunk", "3D render"],
    lighting: ["volumetric", "backlit"],
    assembledPrompt:
      "Steampunk airship flying over mountains, steampunk, 3D render, volumetric lighting, backlit, epic scale, cinematic composition --ar 21:9",
    targetModel: "SDXL",
    rating: null,
    createdAt: "2025-01-12T20:10:00Z",
  },
  {
    id: 5,
    subject: "Abstract geometric patterns in space",
    styles: ["minimalist", "vaporwave"],
    lighting: ["neon glow", "ethereal"],
    assembledPrompt:
      "Abstract geometric patterns floating in deep space, minimalist, vaporwave aesthetic, neon glow, ethereal light --ar 1:1 --stylize 500",
    targetModel: "Midjourney v7",
    rating: 4,
    createdAt: "2025-01-11T12:00:00Z",
  },
];

export const styleChips: StyleChip[] = [
  { id: "photorealistic", label: "Photorealistic" },
  { id: "anime", label: "Anime" },
  { id: "cyberpunk", label: "Cyberpunk" },
  { id: "watercolor", label: "Watercolor" },
  { id: "cinematic", label: "Cinematic" },
  { id: "vaporwave", label: "Vaporwave" },
  { id: "oil-painting", label: "Oil Painting" },
  { id: "pixel-art", label: "Pixel Art" },
  { id: "3d-render", label: "3D Render" },
  { id: "concept-art", label: "Concept Art" },
  { id: "sketch", label: "Sketch" },
  { id: "surrealist", label: "Surrealist" },
  { id: "minimalist", label: "Minimalist" },
  { id: "retro", label: "Retro" },
  { id: "gothic", label: "Gothic" },
  { id: "steampunk", label: "Steampunk" },
  { id: "art-nouveau", label: "Art Nouveau" },
  { id: "pop-art", label: "Pop Art" },
  { id: "impressionist", label: "Impressionist" },
  { id: "low-poly", label: "Low Poly" },
];

export const lightingPresets: LightingPreset[] = [
  { id: "golden-hour", label: "Golden Hour" },
  { id: "neon-glow", label: "Neon Glow" },
  { id: "dramatic-shadows", label: "Dramatic Shadows" },
  { id: "foggy", label: "Foggy" },
  { id: "ethereal", label: "Ethereal" },
  { id: "rim-light", label: "Rim Light" },
  { id: "studio-lighting", label: "Studio Lighting" },
  { id: "natural-light", label: "Natural Light" },
  { id: "backlit", label: "Backlit" },
  { id: "moonlight", label: "Moonlight" },
  { id: "volumetric", label: "Volumetric" },
  { id: "harsh-flash", label: "Harsh Flash" },
  { id: "candlelight", label: "Candlelight" },
  { id: "bioluminescent", label: "Bioluminescent" },
];

export const templates: Template[] = [
  {
    id: 1,
    name: "Cinematic Portrait",
    subject: "A portrait with shallow depth of field",
    preview:
      "A portrait with cinematic lighting, shallow depth of field, dramatic shadows",
    styles: ["cinematic"],
    lighting: ["dramatic-shadows", "rim-light"],
    aspectRatio: "3:2",
    details: "sharp focus, film grain, bokeh background",
    category: "quick-start",
  },
  {
    id: 2,
    name: "Fantasy Landscape",
    subject: "An epic fantasy landscape with mountains and waterfalls",
    preview:
      "An epic fantasy landscape with mountains, waterfalls, and magical atmosphere",
    styles: ["concept-art"],
    lighting: ["volumetric", "golden-hour"],
    aspectRatio: "16:9",
    details: "highly detailed, epic scale, magical atmosphere",
    category: "quick-start",
  },
  {
    id: 3,
    name: "Product Shot",
    subject: "Clean product photography on white background",
    preview:
      "Clean product photography on white background, studio lighting, sharp focus",
    styles: ["photorealistic"],
    lighting: ["studio-lighting"],
    aspectRatio: "1:1",
    details: "sharp focus, high resolution, commercial quality",
    category: "quick-start",
  },
  {
    id: 4,
    name: "Abstract Art",
    subject: "Abstract composition with bold colors and geometric shapes",
    preview:
      "Abstract composition with bold colors, geometric shapes, modern art style",
    styles: ["minimalist"],
    lighting: ["ethereal"],
    aspectRatio: "1:1",
    details: "modern art, bold palette, clean lines",
    category: "quick-start",
  },
  {
    id: 5,
    name: "Neon Cyberpunk City",
    subject: "Cyberpunk cityscape with rain-slicked streets",
    preview:
      "Cyberpunk cityscape with neon lights, rain-slicked streets, futuristic architecture",
    styles: ["cyberpunk"],
    lighting: ["neon-glow", "foggy"],
    aspectRatio: "21:9",
    details: "futuristic architecture, reflections, cinematic composition",
    category: "favorites",
  },
  {
    id: 6,
    name: "Watercolor Nature",
    subject: "Delicate painting of flowers in a garden",
    preview:
      "Delicate watercolor painting of flowers in a garden, soft pastel colors",
    styles: ["watercolor"],
    lighting: ["natural-light"],
    aspectRatio: "4:5",
    details: "soft pastel colors, delicate brushstrokes, paper texture",
    category: "favorites",
  },
];
