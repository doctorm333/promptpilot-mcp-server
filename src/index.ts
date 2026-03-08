#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  listModelsSchema,
  listStylesSchema,
  buildPromptSchema,
  generateImageSchema,
  generateVideoSchema,
  generateAudioSchema,
  checkBalanceSchema,
  generateBatchSchema,
  handleListModels,
  handleListStyles,
  handleBuildPrompt,
  handleGenerateImage,
  handleGenerateVideo,
  handleGenerateAudio,
  handleCheckBalance,
  handleGenerateBatch,
} from "./tools.js";

const server = new McpServer({
  name: "promptpilot",
  version: "1.0.0",
});

server.tool(
  "list_models",
  "List all available models for image, video, and audio generation with their type and pricing",
  listModelsSchema.shape,
  async () => handleListModels()
);

server.tool(
  "list_styles",
  "List all available styles, lighting, camera angles, moods, colors, and quality tags for prompt building",
  listStylesSchema.shape,
  async () => handleListStyles()
);

server.tool(
  "build_prompt",
  "Build an optimized prompt from subject + style/lighting/camera/mood/color/quality options",
  buildPromptSchema.shape,
  async (args) => handleBuildPrompt(args)
);

server.tool(
  "generate_image",
  "Generate an image using Pollinations API. Returns a URL to the generated image.",
  generateImageSchema.shape,
  async (args) => handleGenerateImage(args)
);

server.tool(
  "generate_video",
  "Generate a video using Pollinations API. Returns a URL to the generated video.",
  generateVideoSchema.shape,
  async (args) => handleGenerateVideo(args)
);

server.tool(
  "generate_audio",
  "Generate audio (speech or music) using Pollinations API. Returns a URL to the generated audio.",
  generateAudioSchema.shape,
  async (args) => handleGenerateAudio(args)
);

server.tool(
  "check_balance",
  "Check your Pollinations API balance (pollen). Shows remaining credits for paid models.",
  checkBalanceSchema.shape,
  async () => handleCheckBalance()
);

server.tool(
  "generate_batch",
  "Generate multiple images in one call (up to 10). More efficient than calling generate_image repeatedly.",
  generateBatchSchema.shape,
  async (args) => handleGenerateBatch(args)
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error("MCP server failed:", err);
  process.exit(1);
});
