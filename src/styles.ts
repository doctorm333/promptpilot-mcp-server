export const styleMappings: Record<string, string> = {
  photorealistic: "photorealistic, ultra realistic, photography, 8k resolution",
  cinematic: "cinematic, movie still, dramatic composition, film grain",
  anime: "anime style, Japanese animation, vibrant colors, detailed illustration",
  digitalArt: "digital art, illustration, detailed artwork, artstation",
  oilPainting: "oil painting, classical art, brush strokes, fine art",
  watercolor: "watercolor painting, soft edges, artistic, traditional media",
  "3dRender": "3D render, octane render, blender, CGI, photorealistic 3D",
  pixelArt: "pixel art, retro game style, 16-bit, nostalgic",
  comicBook: "comic book style, graphic novel, bold lines, dynamic",
  cyberpunk: "cyberpunk, neon lights, futuristic, dystopian, blade runner",
  fantasy: "fantasy art, magical, ethereal, enchanting, mystical",
  minimalist: "minimalist, clean, simple, modern design, whitespace",
};

export const lightingMappings: Record<string, string> = {
  natural: "natural lighting, soft shadows, ambient light",
  studio: "studio lighting, professional photography, softbox",
  neon: "neon lighting, glowing lights, vibrant colors, cyberpunk",
  goldenHour: "golden hour lighting, warm tones, sunset, magic hour",
  dramatic: "dramatic lighting, high contrast, chiaroscuro, moody",
  soft: "soft lighting, diffused light, gentle shadows",
  backlit: "backlit, rim light, silhouette, atmospheric",
};

export const cameraMappings: Record<string, string> = {
  closeUp: "close-up shot, detailed, intimate",
  wideAngle: "wide angle shot, expansive view, environmental",
  portrait: "portrait shot, shallow depth of field, bokeh",
  aerial: "aerial view, birds eye view, drone shot",
  macro: "macro photography, extreme close-up, detailed",
  lowAngle: "low angle shot, heroic perspective, imposing",
  highAngle: "high angle shot, overview, diminutive",
};

export const moodMappings: Record<string, string> = {
  happy: "happy, joyful, bright, cheerful atmosphere",
  mysterious: "mysterious, enigmatic, foggy, suspenseful",
  epic: "epic, grandiose, majestic, awe-inspiring",
  calm: "calm, peaceful, serene, tranquil",
  dark: "dark, moody, ominous, foreboding",
  romantic: "romantic, dreamy, soft, intimate",
  energetic: "energetic, dynamic, vibrant, action-packed",
};

export const colorMappings: Record<string, string> = {
  vibrant: "vibrant colors, saturated, bold color palette",
  pastel: "pastel colors, soft tones, muted palette",
  monochrome: "monochrome, black and white, grayscale",
  warm: "warm color palette, oranges, reds, yellows",
  cold: "cold color palette, blues, purples, cyans",
  neon: "neon colors, fluorescent, glowing, vivid",
};

export const qualityTagMappings: Record<string, string> = {
  "8k": "8k resolution, ultra HD",
  detailed: "highly detailed, intricate details",
  award: "award winning photography",
  professional: "professional quality, studio quality",
  masterpiece: "masterpiece, best quality",
};

export function buildPrompt(options: {
  subject: string;
  style?: string;
  lighting?: string;
  camera?: string;
  mood?: string;
  color?: string;
  quality_tags?: string[];
}): string {
  const parts: string[] = [options.subject];

  if (options.style && styleMappings[options.style]) {
    parts.push(styleMappings[options.style]);
  }
  if (options.lighting && lightingMappings[options.lighting]) {
    parts.push(lightingMappings[options.lighting]);
  }
  if (options.camera && cameraMappings[options.camera]) {
    parts.push(cameraMappings[options.camera]);
  }
  if (options.mood && moodMappings[options.mood]) {
    parts.push(moodMappings[options.mood]);
  }
  if (options.color && colorMappings[options.color]) {
    parts.push(colorMappings[options.color]);
  }
  if (options.quality_tags) {
    for (const tag of options.quality_tags) {
      if (qualityTagMappings[tag]) {
        parts.push(qualityTagMappings[tag]);
      }
    }
  }

  return parts.join(", ");
}
