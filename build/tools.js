import { z } from "zod";
import { getModel, getModelsByType } from "./models.js";
import { styleMappings, lightingMappings, cameraMappings, moodMappings, colorMappings, qualityTagMappings, buildPrompt, } from "./styles.js";
const API_KEY = process.env.POLLINATIONS_API_KEY;
function pollinationsHeaders() {
    const headers = {};
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
        .enum(Object.keys(styleMappings))
        .optional()
        .describe("Visual style"),
    lighting: z
        .enum(Object.keys(lightingMappings))
        .optional()
        .describe("Lighting type"),
    camera: z
        .enum(Object.keys(cameraMappings))
        .optional()
        .describe("Camera angle"),
    mood: z
        .enum(Object.keys(moodMappings))
        .optional()
        .describe("Mood/atmosphere"),
    color: z
        .enum(Object.keys(colorMappings))
        .optional()
        .describe("Color palette"),
    quality_tags: z
        .array(z.enum(Object.keys(qualityTagMappings)))
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
// --- Tool handlers ---
export function handleListModels() {
    const imageModels = getModelsByType("image");
    const videoModels = getModelsByType("video");
    const audioModels = getModelsByType("audio");
    const formatModel = (m) => {
        let line = `  ${m.id} — ${m.name} [${m.free ? "FREE" : "PAID"}]`;
        if (m.price)
            line += ` (${m.price})`;
        if (m.description)
            line += ` — ${m.description}`;
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
    return { content: [{ type: "text", text }] };
}
export function handleListStyles() {
    const section = (title, map) => [`${title}:`, ...Object.entries(map).map(([k, v]) => `  ${k} → ${v}`), ""].join("\n");
    const text = [
        section("STYLES", styleMappings),
        section("LIGHTING", lightingMappings),
        section("CAMERA", cameraMappings),
        section("MOOD", moodMappings),
        section("COLOR", colorMappings),
        section("QUALITY TAGS", qualityTagMappings),
    ].join("\n");
    return { content: [{ type: "text", text }] };
}
export function handleBuildPrompt(args) {
    const prompt = buildPrompt(args);
    return {
        content: [{ type: "text", text: `Generated prompt:\n${prompt}` }],
    };
}
export async function handleGenerateImage(args) {
    const model = getModel(args.model);
    if (!model || model.type !== "image") {
        return {
            content: [
                {
                    type: "text",
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
                    type: "text",
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
    if (args.seed !== undefined)
        params.set("seed", String(args.seed));
    if (API_KEY)
        params.set("token", API_KEY);
    const encodedPrompt = encodeURIComponent(args.prompt);
    const url = `https://gen.pollinations.ai/image/${encodedPrompt}?${params}`;
    // Verify the URL works with a HEAD request
    try {
        const resp = await fetch(url, {
            method: "HEAD",
            headers: pollinationsHeaders(),
        });
        if (!resp.ok) {
            return {
                content: [
                    {
                        type: "text",
                        text: `Pollinations API error: ${resp.status} ${resp.statusText}`,
                    },
                ],
                isError: true,
            };
        }
    }
    catch (err) {
        return {
            content: [
                {
                    type: "text",
                    text: `Failed to reach Pollinations API: ${err}`,
                },
            ],
            isError: true,
        };
    }
    return {
        content: [
            {
                type: "text",
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
export async function handleGenerateVideo(args) {
    const model = getModel(args.model);
    if (!model || model.type !== "video") {
        return {
            content: [
                {
                    type: "text",
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
                    type: "text",
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
    if (args.duration !== undefined)
        params.set("duration", String(args.duration));
    if (args.seed !== undefined)
        params.set("seed", String(args.seed));
    if (API_KEY)
        params.set("token", API_KEY);
    const encodedPrompt = encodeURIComponent(args.prompt);
    const url = `https://gen.pollinations.ai/video/${encodedPrompt}?${params}`;
    try {
        const resp = await fetch(url, {
            method: "HEAD",
            headers: pollinationsHeaders(),
        });
        if (!resp.ok) {
            return {
                content: [
                    {
                        type: "text",
                        text: `Pollinations API error: ${resp.status} ${resp.statusText}`,
                    },
                ],
                isError: true,
            };
        }
    }
    catch (err) {
        return {
            content: [
                {
                    type: "text",
                    text: `Failed to reach Pollinations API: ${err}`,
                },
            ],
            isError: true,
        };
    }
    return {
        content: [
            {
                type: "text",
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
export async function handleGenerateAudio(args) {
    const model = getModel(args.model);
    if (!model || model.type !== "audio") {
        return {
            content: [
                {
                    type: "text",
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
                    type: "text",
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
    if (API_KEY)
        params.set("token", API_KEY);
    const encodedPrompt = encodeURIComponent(args.prompt);
    const url = `https://gen.pollinations.ai/audio/${encodedPrompt}?${params}`;
    try {
        const resp = await fetch(url, {
            method: "HEAD",
            headers: pollinationsHeaders(),
        });
        if (!resp.ok) {
            return {
                content: [
                    {
                        type: "text",
                        text: `Pollinations API error: ${resp.status} ${resp.statusText}`,
                    },
                ],
                isError: true,
            };
        }
    }
    catch (err) {
        return {
            content: [
                {
                    type: "text",
                    text: `Failed to reach Pollinations API: ${err}`,
                },
            ],
            isError: true,
        };
    }
    const info = args.model === "elevenlabs"
        ? `Voice: ${args.voice}`
        : "Type: Music generation";
    return {
        content: [
            {
                type: "text",
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
