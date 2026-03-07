# PromptPilot MCP Server

MCP (Model Context Protocol) server for [PromptPilot.club](https://promptpilot.club) — generate images, video, and audio via [Pollinations AI](https://pollinations.ai) directly from Claude Code, Cursor, or any MCP-compatible client.

## Quick Start

Add to your Claude Code settings (`~/.claude/settings.json`):

```json
{
  "mcpServers": {
    "promptpilot": {
      "command": "npx",
      "args": ["-y", "github:doctorm333/promptpilot-mcp-server"]
    }
  }
}
```

Free models (Flux, Grok Video, etc.) work without an API key. For paid models, add your [Pollinations API key](https://pollinations.ai):

```json
{
  "mcpServers": {
    "promptpilot": {
      "command": "npx",
      "args": ["-y", "github:doctorm333/promptpilot-mcp-server"],
      "env": {
        "POLLINATIONS_API_KEY": "your-key-here"
      }
    }
  }
}
```

## Tools

### `list_models`
List all available models with type (image/video/audio) and pricing.

### `list_styles`
List all styles, lighting, camera angles, moods, colors, and quality tags.

### `build_prompt`
Build an optimized prompt from a subject + style options.

```
build_prompt({subject: "mountain lake", style: "cinematic", lighting: "goldenHour"})
→ "mountain lake, cinematic, movie still, dramatic composition, film grain, golden hour lighting, warm tones, sunset, magic hour"
```

### `generate_image`
Generate an image. Returns a URL.

| Parameter | Default | Description |
|-----------|---------|-------------|
| `prompt` | required | Text prompt |
| `model` | `flux` | Model ID |
| `width` | `1024` | 256–2048 |
| `height` | `1024` | 256–2048 |
| `enhance` | `true` | AI prompt enhancement |
| `seed` | — | Reproducibility seed |

### `generate_video`
Generate a video. Returns a URL.

| Parameter | Default | Description |
|-----------|---------|-------------|
| `prompt` | required | Text prompt |
| `model` | `grok-video` | Model ID |
| `aspect_ratio` | `1:1` | `1:1`, `16:9`, `9:16` |
| `duration` | — | Seconds (model-dependent) |
| `seed` | — | Reproducibility seed |

### `generate_audio`
Generate speech or music. Returns a URL.

| Parameter | Default | Description |
|-----------|---------|-------------|
| `prompt` | required | Text or music prompt |
| `model` | `elevenlabs` | `elevenlabs` or `elevenmusic` |
| `voice` | `nova` | Voice for elevenlabs: alloy, echo, fable, onyx, nova, shimmer |

## Available Models

### Image (8 free)
`flux`, `zimage`, `imagen-4`, `grok-imagine`, `klein`, `klein-large`, `gptimage`, `flux-2-dev`

### Image (7 paid)
`seedream`, `kontext`, `nanobanana`, `seedream-pro`, `gptimage-large`, `nanobanana-pro`, `seedream5`

### Video (1 free)
`grok-video`

### Video (5 paid)
`seedance`, `ltx-2`, `seedance-pro`, `wan`, `veo-3.1-fast`

### Audio (2 paid)
`elevenlabs`, `elevenmusic`

## License

MIT
