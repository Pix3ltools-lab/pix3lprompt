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

export interface Preset {
  id: string;
  label: string;
}

export type StyleChip = Preset;
export type LightingPreset = Preset;

export interface Template {
  id: number;
  name: string;
  subject: string;
  preview: string;
  styles: string[];
  lighting: string[];
  cameraAngles?: string[];
  colorPalette?: string[];
  medium?: string[];
  quality?: string[];
  framing?: string[];
  mood?: string[];
  aspectRatio: string;
  details: string;
  category: "image" | "video" | "audio";
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

export const cameraAnglePresets: Preset[] = [
  { id: "close-up", label: "Close-Up" },
  { id: "wide-shot", label: "Wide Shot" },
  { id: "birds-eye", label: "Bird's Eye" },
  { id: "low-angle", label: "Low Angle" },
  { id: "dutch-angle", label: "Dutch Angle" },
  { id: "over-the-shoulder", label: "Over the Shoulder" },
  { id: "pov", label: "POV" },
  { id: "macro", label: "Macro" },
  { id: "medium-shot", label: "Medium Shot" },
  { id: "aerial", label: "Aerial" },
];

export const colorPalettePresets: Preset[] = [
  { id: "warm-tones", label: "Warm Tones" },
  { id: "cool-tones", label: "Cool Tones" },
  { id: "monochrome", label: "Monochrome" },
  { id: "pastel", label: "Pastel" },
  { id: "desaturated", label: "Desaturated" },
  { id: "high-contrast", label: "High Contrast" },
  { id: "earth-tones", label: "Earth Tones" },
  { id: "neon-colors", label: "Neon Colors" },
  { id: "sepia", label: "Sepia" },
  { id: "vibrant", label: "Vibrant" },
];

export const mediumPresets: Preset[] = [
  { id: "film-grain", label: "Film Grain" },
  { id: "canvas-texture", label: "Canvas Texture" },
  { id: "paper-texture", label: "Paper Texture" },
  { id: "glitch", label: "Glitch" },
  { id: "halftone", label: "Halftone" },
  { id: "soft-focus", label: "Soft Focus" },
  { id: "double-exposure", label: "Double Exposure" },
  { id: "long-exposure", label: "Long Exposure" },
  { id: "tilt-shift", label: "Tilt Shift" },
  { id: "noise-grain", label: "Noise / Grain" },
];

export const qualityPresets: Preset[] = [
  { id: "8k", label: "8K" },
  { id: "highly-detailed", label: "Highly Detailed" },
  { id: "masterpiece", label: "Masterpiece" },
  { id: "award-winning", label: "Award Winning" },
  { id: "professional", label: "Professional" },
  { id: "raw-photo", label: "RAW Photo" },
  { id: "ultra-sharp", label: "Ultra Sharp" },
  { id: "hdr", label: "HDR" },
];

export const framingPresets: Preset[] = [
  { id: "rule-of-thirds", label: "Rule of Thirds" },
  { id: "centered", label: "Centered" },
  { id: "symmetrical", label: "Symmetrical" },
  { id: "golden-ratio", label: "Golden Ratio" },
  { id: "negative-space", label: "Negative Space" },
  { id: "full-body", label: "Full Body" },
  { id: "headshot", label: "Headshot" },
  { id: "portrait-framing", label: "Portrait" },
  { id: "panoramic", label: "Panoramic" },
];

export const moodPresets: Preset[] = [
  { id: "dreamy", label: "Dreamy" },
  { id: "dark", label: "Dark" },
  { id: "nostalgic", label: "Nostalgic" },
  { id: "serene", label: "Serene" },
  { id: "chaotic", label: "Chaotic" },
  { id: "mysterious", label: "Mysterious" },
  { id: "whimsical", label: "Whimsical" },
  { id: "epic", label: "Epic" },
  { id: "melancholic", label: "Melancholic" },
  { id: "romantic", label: "Romantic" },
];

export const templates: Template[] = [
  // ── Image Templates ──────────────────────────────────────────────
  {
    id: 1,
    name: "Cinematic Portrait",
    subject: "A portrait with shallow depth of field",
    preview:
      "A portrait with cinematic lighting, shallow depth of field, dramatic shadows",
    styles: ["cinematic"],
    lighting: ["dramatic-shadows", "rim-light"],
    cameraAngles: ["close-up"],
    medium: ["film-grain"],
    quality: ["ultra-sharp"],
    framing: ["portrait-framing"],
    mood: ["mysterious"],
    aspectRatio: "3:2",
    details: "bokeh background",
    category: "image",
  },
  {
    id: 2,
    name: "Fantasy Landscape",
    subject: "An epic fantasy landscape with mountains and waterfalls",
    preview:
      "An epic fantasy landscape with mountains, waterfalls, and magical atmosphere",
    styles: ["concept-art"],
    lighting: ["volumetric", "golden-hour"],
    cameraAngles: ["wide-shot"],
    quality: ["highly-detailed"],
    framing: ["panoramic"],
    mood: ["epic"],
    aspectRatio: "16:9",
    details: "magical atmosphere",
    category: "image",
  },
  {
    id: 3,
    name: "Product Shot",
    subject: "Clean product photography on white background",
    preview:
      "Clean product photography on white background, studio lighting, sharp focus",
    styles: ["photorealistic"],
    lighting: ["studio-lighting"],
    quality: ["ultra-sharp", "professional"],
    framing: ["centered"],
    aspectRatio: "1:1",
    details: "commercial quality",
    category: "image",
  },
  {
    id: 4,
    name: "Abstract Art",
    subject: "Abstract composition with bold colors and geometric shapes",
    preview:
      "Abstract composition with bold colors, geometric shapes, modern art style",
    styles: ["minimalist"],
    lighting: ["ethereal"],
    colorPalette: ["vibrant"],
    framing: ["centered", "negative-space"],
    mood: ["serene"],
    aspectRatio: "1:1",
    details: "modern art, clean lines",
    category: "image",
  },
  {
    id: 5,
    name: "Neon Cyberpunk City",
    subject: "Cyberpunk cityscape with rain-slicked streets",
    preview:
      "Cyberpunk cityscape with neon lights, rain-slicked streets, futuristic architecture",
    styles: ["cyberpunk"],
    lighting: ["neon-glow", "foggy"],
    cameraAngles: ["low-angle"],
    colorPalette: ["neon-colors"],
    framing: ["panoramic"],
    mood: ["dark"],
    aspectRatio: "21:9",
    details: "futuristic architecture, reflections",
    category: "image",
  },
  {
    id: 6,
    name: "Watercolor Nature",
    subject: "Delicate painting of flowers in a garden",
    preview:
      "Delicate watercolor painting of flowers in a garden, soft pastel colors",
    styles: ["watercolor"],
    lighting: ["natural-light"],
    colorPalette: ["pastel"],
    medium: ["paper-texture"],
    mood: ["serene"],
    aspectRatio: "4:5",
    details: "delicate brushstrokes",
    category: "image",
  },
  {
    id: 7,
    name: "Anime Character",
    subject: "Full-body anime character standing in a dramatic pose",
    preview:
      "Full-body anime character in dramatic pose, cel-shading, vibrant colors",
    styles: ["anime"],
    lighting: ["rim-light"],
    colorPalette: ["vibrant"],
    framing: ["full-body"],
    mood: ["epic"],
    aspectRatio: "9:16",
    details: "cel-shading, clean linework",
    category: "image",
  },
  {
    id: 8,
    name: "Architectural Viz",
    subject: "Modern minimalist house surrounded by nature",
    preview:
      "Modern minimalist house surrounded by lush nature, clean geometry",
    styles: ["3d-render", "minimalist"],
    lighting: ["natural-light"],
    cameraAngles: ["wide-shot"],
    quality: ["ultra-sharp"],
    framing: ["rule-of-thirds"],
    aspectRatio: "16:9",
    details: "architectural photography, clean geometry",
    category: "image",
  },
  {
    id: 9,
    name: "Food Photography",
    subject: "Gourmet dish on a rustic wooden table",
    preview:
      "Gourmet dish on a rustic wooden table, studio lighting, shallow depth of field",
    styles: ["photorealistic"],
    lighting: ["studio-lighting", "backlit"],
    cameraAngles: ["birds-eye"],
    colorPalette: ["warm-tones"],
    medium: ["soft-focus"],
    quality: ["professional"],
    aspectRatio: "4:5",
    details: "food styling",
    category: "image",
  },
  {
    id: 10,
    name: "Retro Poster",
    subject: "Vintage travel poster of a coastal town",
    preview:
      "Vintage travel poster of a coastal town, screen print, limited color palette",
    styles: ["retro", "pop-art"],
    lighting: ["golden-hour"],
    medium: ["halftone"],
    mood: ["nostalgic"],
    aspectRatio: "9:16",
    details: "screen print, bold typography",
    category: "image",
  },
  {
    id: 11,
    name: "Dark Gothic Scene",
    subject: "Ancient cathedral interior with stained glass",
    preview:
      "Ancient cathedral interior with stained glass, candlelight, moody atmosphere",
    styles: ["gothic"],
    lighting: ["candlelight", "volumetric"],
    cameraAngles: ["low-angle"],
    colorPalette: ["desaturated"],
    quality: ["highly-detailed"],
    mood: ["dark", "mysterious"],
    aspectRatio: "3:2",
    details: "stone texture",
    category: "image",
  },
  {
    id: 12,
    name: "Isometric Game Asset",
    subject: "Tiny medieval village with market square",
    preview:
      "Tiny medieval village with market square, isometric view, miniature scene",
    styles: ["low-poly", "pixel-art"],
    lighting: ["natural-light"],
    cameraAngles: ["birds-eye"],
    colorPalette: ["vibrant"],
    framing: ["centered"],
    mood: ["whimsical"],
    aspectRatio: "1:1",
    details: "isometric view, game asset, miniature scene",
    category: "image",
  },
  {
    id: 13,
    name: "Sci-Fi Book Cover",
    subject: "Astronaut standing before a massive alien structure",
    preview:
      "Astronaut before a massive alien structure, epic scale, sci-fi atmosphere",
    styles: ["concept-art", "cinematic"],
    lighting: ["backlit", "ethereal"],
    cameraAngles: ["low-angle"],
    quality: ["8k", "highly-detailed"],
    mood: ["epic", "mysterious"],
    aspectRatio: "9:16",
    details: "lens flare, sci-fi atmosphere",
    category: "image",
  },
  {
    id: 14,
    name: "Oil Portrait Master",
    subject: "Renaissance-style portrait of a woman with flowers",
    preview:
      "Renaissance-style portrait of a woman with flowers, visible brushstrokes",
    styles: ["oil-painting", "art-nouveau"],
    lighting: ["dramatic-shadows"],
    colorPalette: ["warm-tones"],
    medium: ["canvas-texture"],
    quality: ["masterpiece"],
    framing: ["portrait-framing", "golden-ratio"],
    aspectRatio: "3:2",
    details: "visible brushstrokes, rich textures",
    category: "image",
  },
  {
    id: 15,
    name: "Dreamy Double Exposure",
    subject: "Silhouette of a wolf merged with a forest landscape",
    preview:
      "Silhouette of a wolf merged with a forest, double exposure, ethereal mood",
    styles: ["surrealist"],
    lighting: ["moonlight", "foggy"],
    medium: ["double-exposure"],
    quality: ["highly-detailed"],
    mood: ["dreamy", "mysterious"],
    aspectRatio: "16:9",
    details: "ethereal mood, fine detail",
    category: "image",
  },
  {
    id: 16,
    name: "Street Photography",
    subject: "Rainy Tokyo alley at night with neon reflections",
    preview:
      "Rainy Tokyo alley at night, neon reflections, wet asphalt, street level",
    styles: ["photorealistic", "cyberpunk"],
    lighting: ["neon-glow", "harsh-flash"],
    cameraAngles: ["pov"],
    colorPalette: ["neon-colors", "high-contrast"],
    medium: ["film-grain"],
    mood: ["dark"],
    aspectRatio: "9:16",
    details: "wet asphalt reflections, motion blur",
    category: "image",
  },
  // ── Video Templates ──────────────────────────────────────────────
  {
    id: 17,
    name: "Cinematic Drone Shot",
    subject: "Aerial view of waves crashing on rocky coastline",
    preview:
      "Aerial view of waves crashing on rocky coastline, slow motion, golden hour",
    styles: ["cinematic"],
    lighting: ["golden-hour"],
    cameraAngles: ["aerial"],
    colorPalette: ["warm-tones"],
    quality: ["8k"],
    framing: ["panoramic"],
    mood: ["epic", "serene"],
    aspectRatio: "21:9",
    details: "slow motion, camera pulling back, ocean spray",
    category: "video",
  },
  {
    id: 18,
    name: "Music Video Loop",
    subject: "Abstract particles morphing in rhythm",
    preview:
      "Abstract particles morphing in rhythm, seamless loop, vibrant gradients",
    styles: ["vaporwave"],
    lighting: ["neon-glow", "ethereal"],
    colorPalette: ["neon-colors"],
    mood: ["dreamy"],
    aspectRatio: "16:9",
    details: "seamless loop, pulsating motion, vibrant gradients",
    category: "video",
  },
  // ── Audio Templates ──────────────────────────────────────────────
  {
    id: 19,
    name: "Lo-Fi Beat",
    subject: "Chill lo-fi hip hop beat, vinyl crackle, mellow piano chords",
    preview:
      "Chill lo-fi hip hop beat with vinyl crackle, jazzy samples, relaxed tempo",
    styles: [],
    lighting: [],
    aspectRatio: "1:1",
    details: "rainy day mood, jazzy samples, relaxed tempo",
    category: "audio",
  },
  {
    id: 20,
    name: "Epic Trailer Music",
    subject: "Orchestral cinematic trailer music, building tension",
    preview:
      "Orchestral cinematic trailer music, brass section, percussion crescendo",
    styles: [],
    lighting: [],
    aspectRatio: "1:1",
    details: "brass section, percussion crescendo, heroic theme",
    category: "audio",
  },
];
