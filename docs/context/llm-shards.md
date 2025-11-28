# LLM Integration Knowledge Shards
## TELIS Tier 2 - Micro Reference (Token Budget: ~500)

> Compressed patterns for multi-provider LLM integration
> Provider Priority: Ollama → Claude → OpenAI → Groq

---

## Symbolic Compression

```
@llm.ollama   → Ollama localhost:11434 (FREE, local)
@llm.claude   → Anthropic Claude API (@anthropic-ai/sdk)
@llm.openai   → OpenAI API (openai package)
@llm.groq     → Groq API (groq-sdk, ultra-fast)
```

---

## Provider Quick Reference

| Provider | Endpoint | Auth | npm Package |
|----------|----------|------|-------------|
| Ollama | `localhost:11434` | None | `ollama` |
| Claude | `api.anthropic.com` | API Key | `@anthropic-ai/sdk` |
| OpenAI | `api.openai.com` | API Key | `openai` |
| Groq | `api.groq.com` | API Key | `groq-sdk` |
| xAI | `api.x.ai` | API Key | `openai` (compatible) |

---

## Ollama (Primary - FREE)

### Installation Check
```javascript
async function isOllamaAvailable() {
  try {
    const res = await fetch('http://localhost:11434/api/tags');
    return res.ok;
  } catch {
    return false;
  }
}
```

### Basic Usage
```javascript
import { Ollama } from 'ollama';

const ollama = new Ollama({ host: 'http://localhost:11434' });

const response = await ollama.chat({
  model: 'llama3.2',
  messages: [
    { role: 'system', content: 'You are a music style researcher.' },
    { role: 'user', content: prompt }
  ],
  format: 'json'  // Force JSON output
});

const result = JSON.parse(response.message.content);
```

### Streaming
```javascript
const stream = await ollama.chat({
  model: 'llama3.2',
  messages: [...],
  stream: true
});

for await (const chunk of stream) {
  process.stdout.write(chunk.message.content);
}
```

---

## Claude Opus 4.5 (Quality Fallback)

### Basic Usage
```javascript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

const response = await client.messages.create({
  model: 'claude-opus-4-5-20250101',
  max_tokens: 4096,
  system: 'You are a music style researcher.',
  messages: [
    { role: 'user', content: prompt }
  ]
});

const result = response.content[0].text;
```

### JSON Mode
```javascript
const response = await client.messages.create({
  model: 'claude-opus-4-5-20250101',
  max_tokens: 4096,
  messages: [{
    role: 'user',
    content: `${prompt}\n\nRespond ONLY with valid JSON.`
  }]
});
```

---

## ChatGPT 5.1 (Alternative)

### Basic Usage
```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const response = await client.chat.completions.create({
  model: 'gpt-5.1',
  messages: [
    { role: 'system', content: 'You are a music style researcher.' },
    { role: 'user', content: prompt }
  ],
  response_format: { type: 'json_object' }
});

const result = JSON.parse(response.choices[0].message.content);
```

---

## Groq (Speed Fallback)

### Basic Usage
```javascript
import Groq from 'groq-sdk';

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

const response = await client.chat.completions.create({
  model: 'llama-3.1-70b-versatile',
  messages: [
    { role: 'system', content: 'You are a music style researcher.' },
    { role: 'user', content: prompt }
  ],
  response_format: { type: 'json_object' }
});

const result = JSON.parse(response.choices[0].message.content);
```

---

## Abstraction Layer Pattern

```javascript
// llm/index.js
export async function complete({ prompt, provider, options = {} }) {
  const providers = {
    ollama: ollamaComplete,
    claude: claudeComplete,
    openai: openaiComplete,
    groq: groqComplete
  };
  
  if (!providers[provider]) {
    throw new Error(`Unknown provider: ${provider}`);
  }
  
  return providers[provider](prompt, options);
}

// Fallback chain
export async function completeWithFallback(prompt, options = {}) {
  const chain = ['ollama', 'claude', 'openai', 'groq'];
  
  for (const provider of chain) {
    try {
      return await complete({ prompt, provider, options });
    } catch (error) {
      console.warn(`${provider} failed, trying next...`);
    }
  }
  
  throw new Error('All LLM providers failed');
}
```

---

## Prompt Template for Style Research

```javascript
const STYLE_RESEARCH_PROMPT = `
Research the drumming/groove style of: {{artist}}

Find at least 4 verifiable sources and extract:
1. Swing ratio (0.5 = straight, 0.67 = triplet feel)
2. Typical timing offsets per beat position (ms)
3. Velocity patterns (ghost notes, accents)
4. Note length characteristics

Respond in this exact JSON format:
{
  "artist": "{{artist}}",
  "sources": ["url1", "url2", "url3", "url4"],
  "confidence": 0.0-1.0,
  "timing": {
    "swing_ratio": 0.5-0.75,
    "push_pull_ms": [0, 0, 0, 0],
    "micro_timing_variance": 0-20
  },
  "velocity": {
    "curve": "linear|exponential|logarithmic",
    "ghost_threshold": 0-127,
    "accent_boost": 1.0-1.5
  },
  "articulation": {
    "note_length_factor": 0.5-1.5,
    "overlap_tolerance_ms": 0-10
  }
}
`;
```

---

## Error Handling Pattern

### LLM Error Codes
| Code | Meaning | Suggestion |
|------|---------|------------|
| `LLM_UNAVAILABLE` | No provider configured | Configure in Settings |
| `LLM_TIMEOUT` | Request exceeded 30s | Retry or check connection |
| `LLM_RATE_LIMITED` | API rate limit hit | Wait or switch provider |
| `LOW_CONFIDENCE` | < 4 sources found | Proceed with warning |

### Safe Completion Pattern
```javascript
async function safeComplete(prompt, provider) {
  try {
    const result = await complete({ prompt, provider });
    return { success: true, data: result };
  } catch (error) {
    const code = categorizeError(error);  // LLM_TIMEOUT, etc.
    return { 
      success: false, 
      error: {
        code,
        message: error.message,
        suggestion: getSuggestion(code)
      }
    };
  }
}

function categorizeError(error) {
  if (error.code === 'ECONNREFUSED') return 'LLM_UNAVAILABLE';
  if (error.message?.includes('timeout')) return 'LLM_TIMEOUT';
  if (error.status === 429) return 'LLM_RATE_LIMITED';
  return 'INTERNAL_ERROR';
}
```

---

## Environment Variables

```bash
# .env
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...
GROQ_API_KEY=gsk_...
XAI_API_KEY=xai-...
```

---

## Gotchas

1. **Ollama must run**: Check `fetch('http://localhost:11434/api/tags')` before API calls
2. **JSON mode differs**: Ollama uses `format: 'json'`, OpenAI/Groq use `response_format: { type: 'json_object' }`, Claude needs prompt instruction
3. **Model names vary**: `llama3.2` (Ollama), `claude-sonnet-4-20250514` (Claude), `gpt-4o-mini` (OpenAI), `llama-3.1-70b-versatile` (Groq)
4. **Rate limits**: Implement exponential backoff; Groq has aggressive limits
5. **Env vars**: `ANTHROPIC_API_KEY`, `OPENAI_API_KEY`, `GROQ_API_KEY`

---

_TELIS Tier 2 Shard | ~500 tokens | Last updated: 2025-11-28_

