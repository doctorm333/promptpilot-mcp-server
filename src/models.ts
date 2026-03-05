export interface Model {
  id: string;
  name: string;
  type: "image" | "video" | "audio";
  free: boolean;
  description: string;
  price?: string;
  aspectRatios?: string[];
  voices?: string[];
  supportsImageInput?: boolean;
}

export const models: Model[] = [
  // IMAGE — Free
  { id: "flux", name: "Flux Schnell", type: "image", free: true, description: "Fast, high-quality image generation" },
  { id: "zimage", name: "Z-Image Turbo", type: "image", free: true, description: "Fast turbo image generation" },
  { id: "imagen-4", name: "Imagen 4", type: "image", free: true, description: "Google Imagen 4 via api.airforce" },
  { id: "grok-imagine", name: "Grok Imagine", type: "image", free: true, description: "xAI Grok image generation" },
  { id: "klein", name: "FLUX.2 Klein 4B", type: "image", free: true, description: "4B parameter FLUX model" },
  { id: "klein-large", name: "FLUX.2 Klein 9B", type: "image", free: true, description: "9B parameter FLUX model" },
  { id: "gptimage", name: "GPT Image 1 Mini", type: "image", free: true, description: "OpenAI mini image generation" },
  { id: "flux-2-dev", name: "FLUX.2 Dev", type: "image", free: true, description: "FLUX.2 Dev via api.airforce" },
  // IMAGE — Paid
  { id: "seedream", name: "Seedream 4.0", type: "image", free: false, description: "Artistic image generation", price: "$0.03/image" },
  { id: "kontext", name: "FLUX.1 Kontext", type: "image", free: false, description: "Context-aware with image input", price: "$0.04/image", supportsImageInput: true },
  { id: "nanobanana", name: "NanoBanana", type: "image", free: false, description: "Google multimodal with image input", price: "$0.03/image", supportsImageInput: true },
  { id: "seedream-pro", name: "Seedream 4.5 Pro", type: "image", free: false, description: "Professional artistic generation", price: "$0.04/image" },
  { id: "gptimage-large", name: "GPT Image 1.5", type: "image", free: false, description: "Enhanced OpenAI image generation", price: "$0.032/image" },
  { id: "nanobanana-pro", name: "NanoBanana Pro", type: "image", free: false, description: "Premium multimodal with image input", price: "$0.12/image", supportsImageInput: true },
  { id: "seedream5", name: "Seedream 5.0 Lite", type: "image", free: false, description: "Latest Seedream generation", price: "$0.035/image" },

  // VIDEO — Free
  { id: "grok-video", name: "Grok Video", type: "video", free: true, description: "xAI video generation", aspectRatios: ["1:1"] },
  // VIDEO — Paid
  { id: "seedance", name: "Seedance Lite", type: "video", free: false, description: "Lightweight video generation", price: "$0.018/video", aspectRatios: ["1:1", "16:9", "9:16"], supportsImageInput: true },
  { id: "ltx-2", name: "LTX-2", type: "video", free: false, description: "Advanced video generation", price: "$0.01/sec", aspectRatios: ["1:1", "16:9", "9:16"], supportsImageInput: true },
  { id: "seedance-pro", name: "Seedance Pro-Fast", type: "video", free: false, description: "Professional fast video", price: "$0.1/video", aspectRatios: ["1:1", "16:9", "9:16"], supportsImageInput: true },
  { id: "wan", name: "Wan 2.6", type: "video", free: false, description: "Advanced with audio support", price: "$0.05/sec", aspectRatios: ["1:1", "16:9", "9:16"], supportsImageInput: true },
  { id: "veo-3.1-fast", name: "Veo 3.1 Fast", type: "video", free: false, description: "Google Veo fast video", price: "$0.15/sec", aspectRatios: ["16:9", "9:16", "1:1"], supportsImageInput: true },

  // AUDIO
  { id: "elevenlabs", name: "ElevenLabs v3 TTS", type: "audio", free: false, description: "High-quality text-to-speech", price: "$0.18/1K chars", voices: ["alloy", "echo", "fable", "onyx", "nova", "shimmer"] },
  { id: "elevenmusic", name: "ElevenLabs Music", type: "audio", free: false, description: "AI music generation", price: "$0.005/sec" },
];

export function getModelsByType(type: "image" | "video" | "audio") {
  return models.filter((m) => m.type === type);
}

export function getModel(id: string) {
  return models.find((m) => m.id === id);
}
