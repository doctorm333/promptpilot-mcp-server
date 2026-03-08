import { z } from "zod";
import { models, getModel, getModelsByType } from "./models.js";
import {
  styleMappings,
  lightingMappings,
  cameraMappings,
  moodMappings,
  colorMappings,
  qualityTagMappings,
  buildPrompt,
} from "./styles.js";

const API_KEY = process.env.POLLINATIONS_API_KEY;

function pollinationsHeaders(): Record<string, string> {
  const headers: Record<string, string> = {};
  if (API_KEY) {
    headers["Authorization"] = `Bearer ${API_KEY}`;
  }
  return headers;
}

// --- Tool schemas ---

export const listModelsSchema = z.object({});

export const listStylesSchema = z.object({});

export const buildPromptSchema = z.object({
  subject: z.string().describe("Main subject of the image"),
  style: z
    .enum(Object.keys(styleMappings) as [string, ...string[]])
    .optional()
    .describe("Visual style"),
  lighting: z
    .enum(Object.keys(lightingMappings) as [string, ...string[]])
    .optional()
    .describe("Lighting type"),
  camera: z
    .enum(Object.keys(cameraMappings) as [string, ...string[]])
    .optional()
    .describe("Camera angle"),
  mood: z
    .enum(Object.keys(moodMappings) as [string, ...string[]])
    .optional()
    .describe("Mood/atmosphere"),
  color: z
    .enum(Object.keys(colorMappings) as [string, ...string[]])
    .optional()
    .describe("Color palette"),
  quality_tags: z
    .array(z.enum(Object.keys(qualityTagMappings) as [string, ...string[]]))
    .optional()
    .describe("Quality enhancement tags"),
});

export const generateImageSchema = z.object({
  prompt: z.string().describe("Text prompt for image generation"),
  model: z.string().default("flux").describe("Model ID (default: flux)"),
  width: z.number().min(256).max(2048).default(1024).describe("Image width"),
  height: z.number().min(256).max(2048).default(1024).describe("Image height"),
  enhance: z.boolean().default(true).describe("Enhance prompt with AI"),
  seed: z.number().optional().describe("Seed for reproducibility"),
});

export const generateVideoSchema = z.object({
  prompt: z.string().describe("Text prompt for video generation"),
  model: z.string().default("grok-video").describe("Model ID (default: grok-video)"),
  aspect_ratio: z
    .enum(["1:1", "16:9", "9:16"])
    .default("1:1")
    .describe("Aspect ratio"),
  duration: z.number().optional().describe("Duration in seconds (model-dependent)"),
  seed: z.number().optional().describe("Seed for reproducibility"),
});

export const generateAudioSchema = z.object({
  prompt: z.string().describe("Text for speech or music prompt"),
  model: z
    .enum(["elevenlabs", "elevenmusic"])
    .default("elevenlabs")
    .describe("Audio model"),
  voice: z
    .enum(["alloy", "echo", "fable", "onyx", "nova", "shimmer"])
    .default("nova")
    .describe("Voice (elevenlabs only)"),
});

export const checkBalanceSchema = z.object({});

export const generateBatchSchema = z.object({
  prompts: z
    .array(
      z.object({
        prompt: z.string().describe("Text prompt"),
        model: z.string().default("flux").describe("Model ID"),
        width: z.number().default(1024).optional(),
        height: z.number().default(1024).optional(),
        seed: z.number().optional(),
      })
    )
    .min(1)
    .max(10)
    .describe("Array of image prompts to generate (max 10)"),
});

// --- Tool handlers ---

export function handleListModels() {
  const imageModels = getModelsByType("image");
  const videoModels = getModelsByType("video");
  const audioModels = getModelsByType("audio");

  const formatModel = (m: (typeof models)[0]) => {
    let line = `  ${m.id} — ${m.name} [${m.free ? "FREE" : "PAID"}]`;
    if (m.price) line += ` (${m.price})`;
    if (m.description) line += ` — ${m.description}`;
    return line;
  };

  const text = [
    `IMAGE MODELS (${imageModels.length}):`,
    ...imageModels.map(formatModel),
    "",
    `VIDEO MODELS (${videoModels.length}):`,
    ...videoModels.map(formatModel),
    "",
    `AUDIO MODELS (${audioModels.length}):`,
    ...audioModels.map(formatModel),
  ].join("\n");

  return { content: [{ type: "text" as const, text }] };
}

export function handleListStyles() {
  const section = (title: string, map: Record<string, string>) =>
    [`${title}:`, ...Object.entries(map).map(([k, v]) => `  ${k} → ${v}`), ""].join(
      "\n"
    );

  const text = [
    section("STYLES", styleMappings),
    section("LIGHTING", lightingMappings),
    section("CAMERA", cameraMappings),
    section("MOOD", moodMappings),
    section("COLOR", colorMappings),
    section("QUALITY TAGS", qualityTagMappings),
  ].join("\n");

  return { content: [{ type: "text" as const, text }] };
}

export function handleBuildPrompt(args: z.infer<typeof buildPromptSchema>) {
  const prompt = buildPrompt(args);
  return {
    content: [{ type: "text" as const, text: `Generated prompt:\n${prompt}` }],
  };
}

export async function handleGenerateImage(
  args: z.infer<typeof generateImageSchema>
) {
  const model = getModel(args.model);
  if (!model || model.type !== "image") {
    return {
      content: [
        {
          type: "text" as const,
          text: `Unknown image model: ${args.model}. Use list_models to see available models.`,
        },
      ],
      isError: true,
    };
  }
  if (!model.free && !API_KEY) {
    return {
      content: [
        {
          type: "text" as const,
          text: `Model "${args.model}" requires a Pollinations API key. Set POLLINATIONS_API_KEY env variable.`,
        },
      ],
      isError: true,
    };
  }

  const params = new URLSearchParams({
    model: args.model,
    width: String(args.width),
    height: String(args.height),
    enhance: String(args.enhance),
    nologo: "true",
  });
  if (args.seed !== undefined) params.set("seed", String(args.seed));
  if (API_KEY) params.set("token", API_KEY);

  const encodedPrompt = encodeURIComponent(args.prompt);
  const url = `https://gen.pollinations.ai/image/${encodedPrompt}?${params}`;

  return {
    content: [
      {
        type: "text" as const,
        text: [
          `Image generated successfully!`,
          `Model: ${model.name}`,
          `Size: ${args.width}x${args.height}`,
          `URL: ${url}`,
        ].join("\n"),
      },
    ],
  };
}

export async function handleGenerateVideo(
  args: z.infer<typeof generateVideoSchema>
) {
  const model = getModel(args.model);
  if (!model || model.type !== "video") {
    return {
      content: [
        {
          type: "text" as const,
          text: `Unknown video model: ${args.model}. Use list_models to see available models.`,
        },
      ],
      isError: true,
    };
  }
  if (!model.free && !API_KEY) {
    return {
      content: [
        {
          type: "text" as const,
          text: `Model "${args.model}" requires a Pollinations API key. Set POLLINATIONS_API_KEY env variable.`,
        },
      ],
      isError: true,
    };
  }

  const params = new URLSearchParams({
    model: args.model,
    aspectRatio: args.aspect_ratio,
    nologo: "true",
  });
  if (args.duration !== undefined) params.set("duration", String(args.duration));
  if (args.seed !== undefined) params.set("seed", String(args.seed));
  if (API_KEY) params.set("token", API_KEY);

  const encodedPrompt = encodeURIComponent(args.prompt);
  const url = `https://gen.pollinations.ai/video/${encodedPrompt}?${params}`;

  return {
    content: [
      {
        type: "text" as const,
        text: [
          `Video generation started!`,
          `Model: ${model.name}`,
          `Aspect ratio: ${args.aspect_ratio}`,
          `URL: ${url}`,
          `Note: Video generation may take 30-120 seconds. Open the URL in a browser to download.`,
        ].join("\n"),
      },
    ],
  };
}

export async function handleGenerateAudio(
  args: z.infer<typeof generateAudioSchema>
) {
  const model = getModel(args.model);
  if (!model || model.type !== "audio") {
    return {
      content: [
        {
          type: "text" as const,
          text: `Unknown audio model: ${args.model}. Use list_models to see available models.`,
        },
      ],
      isError: true,
    };
  }
  if (!API_KEY) {
    return {
      content: [
        {
          type: "text" as const,
          text: `Audio models require a Pollinations API key. Set POLLINATIONS_API_KEY env variable.`,
        },
      ],
      isError: true,
    };
  }

  const params = new URLSearchParams({
    model: args.model,
  });
  if (args.model === "elevenlabs") {
    params.set("voice", args.voice);
  }
  if (API_KEY) params.set("token", API_KEY);

  const encodedPrompt = encodeURIComponent(args.prompt);
  const url = `https://gen.pollinations.ai/audio/${encodedPrompt}?${params}`;

  const info =
    args.model === "elevenlabs"
      ? `Voice: ${args.voice}`
      : "Type: Music generation";

  return {
    content: [
      {
        type: "text" as const,
        text: [
          `Audio generated successfully!`,
          `Model: ${model.name}`,
          info,
          `URL: ${url}`,
        ].join("\n"),
      },
    ],
  };
}

export async function handleCheckBalance() {
  if (!API_KEY) {
    return {
      content: [
        {
          type: "text" as const,
          text: "No POLLINATIONS_API_KEY set. Balance check requires an API key.\nFree models (flux, turbo) work without a key.",
        },
      ],
    };
  }

  try {
    const res = await fetch("https://gen.pollinations.ai/account/balance", {
      headers: { Authorization: `Bearer ${API_KEY}` },
    });

    if (!res.ok) {
      return {
        content: [{ type: "text" as const, text: `Balance check failed: HTTP ${res.status}` }],
        isError: true,
      };
    }

    const data = await res.json() as { balance?: number; pollen?: number };
    const balance = data.balance ?? data.pollen ?? 0;

    return {
      content: [
        {
          type: "text" as const,
          text: [
            `Pollinations balance: ${balance} pollen`,
            `API key: ${API_KEY.slice(0, 6)}...${API_KEY.slice(-4)}`,
            "",
            "Free models (flux, turbo, wan2.6) use 0 pollen.",
            "Paid models: gptimage ~5, imagen-4 ~3, grok-imagine ~3, seedance-pro ~20 pollen/gen.",
          ].join("\n"),
        },
      ],
    };
  } catch (err) {
    return {
      content: [{ type: "text" as const, text: `Balance check error: ${err}` }],
      isError: true,
    };
  }
}

export async function handleGenerateBatch(
  args: z.infer<typeof generateBatchSchema>
) {
  const results: string[] = [];

  for (const item of args.prompts) {
    const model = getModel(item.model);
    if (!model || model.type !== "image") {
      results.push(`❌ ${item.prompt.slice(0, 40)}... — unknown model: ${item.model}`);
      continue;
    }
    if (!model.free && !API_KEY) {
      results.push(`❌ ${item.prompt.slice(0, 40)}... — model "${item.model}" requires API key`);
      continue;
    }

    const params = new URLSearchParams({
      model: item.model,
      width: String(item.width ?? 1024),
      height: String(item.height ?? 1024),
      nologo: "true",
      seed: String(item.seed ?? Math.floor(Math.random() * 999999999)),
    });
    if (API_KEY) params.set("token", API_KEY);

    const url = `https://gen.pollinations.ai/image/${encodeURIComponent(item.prompt)}?${params}`;
    results.push(`✅ ${item.prompt.slice(0, 50)}...\n   Model: ${model.name} | URL: ${url}`);
  }

  return {
    content: [
      {
        type: "text" as const,
        text: [`Batch generation (${args.prompts.length} items):`, "", ...results].join("\n"),
      },
    ],
  };
}
