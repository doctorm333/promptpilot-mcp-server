# PromptPilot MCP Server

Generate images, video, and audio directly in Claude Code, Cursor, Windsurf, or any MCP-compatible AI agent.

**20+ models** — Flux, GPT-Image-1, Imagen 4, Grok Imagine, Seedance, ElevenLabs TTS, and more.
**Free models** work without an API key. Paid models require a [Pollinations](https://pollinations.ai) key.

---

## Installation

### Claude Code / Claude Desktop

```json
{
  "mcpServers": {
    "promptpilot": {
      "command": "npx",
      "args": ["-y", "promptpilot-mcp-server"]
    }
  }
}
```

With Pollinations API key (for paid models):
```json
{
  "mcpServers": {
    "promptpilot": {
      "command": "npx",
      "args": ["-y", "promptpilot-mcp-server"],
      "env": {
        "POLLINATIONS_API_KEY": "sk_your_key_here"
      }
    }
  }
}
```

### Cursor

Add to `~/.cursor/mcp.json`:
```json
{
  "mcpServers": {
    "promptpilot": {
      "command": "npx",
      "args": ["-y", "promptpilot-mcp-server"]
    }
  }
}
```

### Windsurf

Add to `~/.codeium/windsurf/mcp_config.json`:
```json
{
  "mcpServers": {
    "promptpilot": {
      "command": "npx",
      "args": ["-y", "promptpilot-mcp-server"]
    }
  }
}
```

### VS Code (GitHub Copilot)

Add to `.vscode/mcp.json` in your workspace:
```json
{
  "servers": {
    "promptpilot": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "promptpilot-mcp-server"]
    }
  }
}
```

### Docker

```bash
docker run -i --rm \
  -e POLLINATIONS_API_KEY=sk_your_key_here \
  mcp/promptpilot-mcp-server
```

---

## Tools (8 total)

| Tool | Description |
|------|-------------|
| `list_models` | List all image/video/audio models with pricing |
| `list_styles` | List styles, lighting, camera, mood, color presets |
| `build_prompt` | Build optimized prompt from structured inputs |
| `generate_image` | Generate image (returns URL) |
| `generate_video` | Generate video (returns URL) |
| `generate_audio` | Generate speech or music (returns URL) |
| `check_balance` | Check Pollinations API balance |
| `generate_batch` | Generate up to 10 images in one call |

---

## Examples

**Generate an image:**
> "Generate a cyberpunk cityscape at night using the flux model"

**Batch generation:**
> "Generate 5 product photos with different backgrounds"

**Build + generate:**
> "Build me a portrait prompt with dramatic lighting and golden hour mood, then generate it"

**Check what's available:**
> "What video models do you have and what are their prices?"

---

## REST API

PromptPilot also offers a REST API for programmatic access from any language:

```bash
# Get your token at https://promptpilot.club/profile (REST API tab)

curl https://promptpilot.club/api/v1/generate \
  -H "Authorization: Bearer pp_your_token" \
  -H "Content-Type: application/json" \
  -d '{"prompt": "red panda in bamboo forest", "model": "flux", "fields": "url,model"}'
```

Endpoints:
- `POST /api/v1/generate` — generate image/video/audio
- `GET /api/v1/models` — list models with prices
- `GET /api/v1/balance` — check balance
- `GET /api/v1/schema` — OpenAPI schema
- `GET /api/v1/AGENT_CONTEXT.md` — quick reference for agents

---

## Links

- [promptpilot.club](https://promptpilot.club) — Web UI
- [Pollinations AI](https://pollinations.ai) — Underlying model provider
- [npm package](https://www.npmjs.com/package/promptpilot-mcp-server)
- [GitHub](https://github.com/doctorm333/promptpilot-mcp-server)

## License

MIT
