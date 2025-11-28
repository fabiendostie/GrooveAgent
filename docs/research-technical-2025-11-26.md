# Technical Research Report: GrooveAgent v1.0 Stack Validation

**Date:** 2025-11-26  
**Prepared for:** Fab  
**Project:** GrooveAgent - Max for Live MIDI Style Transfer Plugin  
**Research Type:** Technical Architecture Validation

---

## Executive Summary

This research validates the technical architecture decisions made during brainstorming and fills in specific implementation details for GrooveAgent v1.0.

### Key Recommendation

**Primary Architecture:** Node.js-based Pure JavaScript stack with multi-provider LLM support

**Rationale:** Aligns with KISS principles, eliminates Python bundling complexity, provides maximum flexibility for LLM provider choice.

**Key Benefits:**
- Zero external runtime dependencies (no Python)
- Multi-provider LLM support (Ollama free + commercial fallbacks)
- Simpler installation and cross-platform compatibility
- Smaller package size

---

## 1. Research Objectives

### Technical Questions Investigated

1. **JS MIDI Libraries** — Can JavaScript handle all MIDI transformation math (timing, velocity, ghost notes)?
2. **Node.js + M4L Integration** — How robust is `node.script` for production use?
3. **LLM Integration Options** — Ollama, OpenAI, Anthropic, Groq, Claude, xAI comparison
4. **Web Search APIs** — How to gather 4+ verifiable sources for style research

### Project Context

- **Project Type:** Max for Live MIDI Effect Plugin
- **Field:** Greenfield development
- **Decided Architecture:** M4L UI → Node.js (node.script) → LLM APIs → JS MIDI math
- **Key Constraint:** KISS principles, simple install, zero external dependencies

---

## 2. Technology Options Evaluated

### 2.1 JavaScript MIDI Libraries

| Library | npm Package | Purpose | Maturity | Recommendation |
|---------|-------------|---------|----------|----------------|
| **@tonejs/midi** | `@tonejs/midi` | MIDI file parsing/writing | High | ✅ Primary choice |
| **midi-writer-js** | `midi-writer-js` | MIDI file creation | High | ✅ For output |
| **JZZ** | `jzz` | Real-time MIDI I/O | High | Consider for future |
| **midi-parser-js** | `midi-parser-js` | MIDI parsing | Medium | Alternative |

**Assessment:** JavaScript libraries are **fully capable** of handling GrooveAgent's MIDI transformation needs:
- ✅ Timing manipulation (swing, shuffle, humanization)
- ✅ Velocity curve adjustments
- ✅ Note duration modifications
- ✅ Ghost note insertion
- ✅ Quantization and de-quantization

**Note:** GrooveAgent doesn't need to parse/write MIDI files — it uses Ableton's Live Object Model (LOM) to directly manipulate clip data. The clip data comes as JSON-like structures through LiveAPI, not as .mid files.

### 2.2 Max for Live + Node.js Integration

**node.script Object:**
- Available in Max 8+ (recommend Max 8.6+ for Node.js 20)
- Runs Node.js processes from within Max patches
- Communicates via stdin/stdout with the Max patch
- Supports npm packages
- Provides access to full Node.js ecosystem

**IMPORTANT:** Max 8.5 (Live 11) uses Node.js 16.6 which is EOL. Max 8.6 (Live 12) uses Node.js 20 which is supported until 2026. **Target Live 12+ for security.**

**Architecture Pattern:**
```
[Max for Live UI (bpatcher)]
         ↓
[node.script mymodule.js @autostart 1]
         ↓
[Node.js: LLM calls, MIDI math, web search]
         ↓
[LiveAPI for clip manipulation]
```

**Key Considerations:**
- node.script is **production-ready** for M4L plugins
- Must handle process lifecycle (startup, shutdown, errors)
- Communication is JSON-based (perfect for LLM responses)
- Can use npm packages for HTTP, LLM SDKs, etc.

### 2.3 LLM API Providers Comparison

**[Verified 2025 Sources]**

| Provider | Model | Context Window | Speed | Input Cost | Output Cost | Local Option |
|----------|-------|----------------|-------|------------|-------------|--------------|
| **Ollama** | Llama 3.2 (3B/8B) | 8K-128K | Medium | FREE | FREE | ✅ Yes |
| **OpenAI** | ChatGPT 5.1 | 128K | Fast | $5.00/1M | $15.00/1M | ❌ Cloud |
| **Anthropic** | Claude Opus 4.5 | 200K | Fast | $3.00/1M | $15.00/1M | ❌ Cloud |
| **Groq** | Llama 3 70B | 8K | **Ultra-fast** (275 T/s) | $0.59/1M | $0.79/1M | ❌ Cloud |
| **xAI** | Grok 4 | 256K | Fast | $3.00/1M | $15.00/1M | ❌ Cloud |

**Sources:**
- [Helicone LLM API Providers](https://www.helicone.ai/blog/llm-api-providers) [Verified 2025]
- [xRoute LLM Cost Comparison](https://xroute.ai/techblog/the-cheapest-llm-api-a-cost-comparison/) [Verified 2025]
- [arXiv Local LLM Runtime Study](https://arxiv.org/abs/2511.05502) [Verified Nov 2025]

**Recommendation:**
1. **Primary:** Ollama (FREE, local, privacy-preserving)
2. **Quality-focused fallback:** Claude Opus 4.5 (best reasoning, 200K context)
3. **Alternatives:** OpenAI ChatGPT 5.1 / xAI Grok (widely supported)
4. **Speed-focused fallback:** Groq (ultra-fast, very affordable)

### 2.4 Style Research Approach (No Separate API Required)

**CRITICAL DESIGN PRINCIPLE:** Plugin must be **100% FREE** when using Ollama. No hidden API costs.

**How Style Research Works:**

| Method | Description | Cost |
|--------|-------------|------|
| **LLM Training Knowledge** | LLMs already know artist styles from training data (interviews, articles, music theory) | **FREE** |
| **Built-in Web Tools** | Commercial LLMs (Claude, GPT) have optional web browsing capabilities | Included in LLM cost |

**Source Citation Approach:**
- LLM provides sources from its training knowledge (books, articles, interviews it "knows")
- For well-known artists: High confidence, multiple sources available
- For obscure artists: Warning displayed, lower confidence, proceed anyway

**Why NO separate web search API:**
1. Adds cost even for "free" Ollama users ❌
2. LLMs already have extensive music knowledge in training
3. Commercial LLMs with web access can use their built-in tools
4. Keeps architecture KISS-compliant

**Recommendation:** LLM-native research only. No Tavily/Serper/etc. required.

---

## 3. Detailed Technology Profiles

### Profile 1: Ollama (Primary LLM)

**Overview:**
Ollama is a local-first LLM runtime designed for developers. It runs models directly on user hardware without cloud dependencies.

**Current Status (Nov 2025):**
- Active development, frequent updates
- Supports latest Llama 3.2, Mistral, Phi-3 models
- Optimized for Apple Silicon and CUDA

**Technical Characteristics:**
- REST API on localhost (default port 11434)
- Simple model pull/run workflow
- Streaming response support
- No API key required

**Integration with Node.js:**
```javascript
// Using ollama-js npm package
import { Ollama } from 'ollama';

const ollama = new Ollama({ host: 'http://localhost:11434' });

const response = await ollama.chat({
  model: 'llama3.2',
  messages: [{ role: 'user', content: 'Describe J Dilla drum patterns' }],
});
```

**Pros:**
- FREE (no API costs)
- Privacy (data stays local)
- No internet required after model download
- Good for development iteration

**Cons:**
- Requires user to install Ollama separately
- Performance depends on user hardware
- May be slower than cloud APIs

**Fit for GrooveAgent:** ✅ Excellent - Primary option for cost-conscious users

### Profile 2: Groq (Speed-Focused Fallback)

**Overview:**
Groq provides ultra-fast LLM inference using custom Language Processing Units (LPUs). Achieves 275+ tokens/second.

**Current Status (Nov 2025):**
- Production-ready cloud API
- Supports Llama 3, Mixtral models
- Competitive pricing

**Technical Characteristics:**
- REST API (standard OpenAI-compatible format)
- Sub-100ms time-to-first-token
- 275+ tokens/second generation

**Integration with Node.js:**
```javascript
import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const response = await groq.chat.completions.create({
  model: 'llama-3.1-70b-versatile',
  messages: [{ role: 'user', content: 'Research funk drum patterns' }],
});
```

**Pros:**
- Blazing fast (best speed in market)
- Very affordable ($0.59-0.79/1M tokens)
- OpenAI-compatible API format

**Cons:**
- Smaller model selection than OpenAI/Anthropic
- Requires internet connection
- Newer provider (less track record)

**Fit for GrooveAgent:** ✅ Excellent - Best for users who want speed

### Profile 3: Anthropic Claude (Quality-Focused Fallback)

**Overview:**
Anthropic's Claude Opus 4.5 offers the strongest reasoning capabilities and 200K context window.

**Current Status (Nov 2025):**
- Claude Opus 4.5 is the current flagship model
- Best-in-class for complex research and analysis tasks
- Constitutional AI approach for safety

**Technical Characteristics:**
- 200K token context window
- Strong at following complex instructions
- Excellent for research/analysis tasks

**Pros:**
- Best reasoning for complex style research
- Huge context window
- Safety-focused design

**Cons:**
- Higher cost than Groq
- Cloud-only
- Slightly slower than Groq

**Fit for GrooveAgent:** ✅ Good - Best for complex style research queries

---

## 4. Comparative Analysis

### Decision Matrix

| Criterion | Weight | Ollama | Groq | Claude | OpenAI |
|-----------|--------|--------|------|--------|--------|
| **Cost** | High | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ |
| **Speed** | Medium | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Quality** | High | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Ease of Setup** | Medium | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Privacy** | Medium | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| **Reliability** | High | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

### Weighted Recommendation

**Tier 1 (Always Available):** Ollama  
**Tier 2 (Fast + Affordable):** Groq  
**Tier 3 (Premium Quality):** Claude Opus 4.5 / ChatGPT 5.1

---

## 5. Architecture Decision Record (ADR)

### ADR-001: Multi-Provider LLM Architecture

**Status:** Proposed

**Context:**
GrooveAgent needs LLM capabilities for researching artist styles and generating Groove Recipes. Users have varying needs: some want free/local, others prioritize speed or quality.

**Decision Drivers:**
- KISS principle compliance
- User flexibility (different budgets/preferences)
- Graceful degradation
- Future-proofing

**Considered Options:**
1. Single provider (Ollama only)
2. Single provider (commercial only)
3. Multi-provider with abstraction layer

**Decision:**
Option 3 — Multi-provider architecture with unified abstraction

**Consequences:**

**Positive:**
- Users choose their preferred provider
- No hard dependency on any single provider
- Free option available (Ollama)
- Graceful fallback if primary unavailable

**Negative:**
- Slightly more complex implementation
- Need to test with multiple providers
- Settings UI needs provider selector

---

## 6. Implementation Roadmap

### Phase 1: Core Architecture (Week 1-2)
- [ ] Set up node.script integration in M4L patch
- [ ] Implement LLM abstraction layer
- [ ] Integrate Ollama as primary provider
- [ ] Basic Groove Recipe generation

### Phase 2: Provider Expansion (Week 3)
- [ ] Add Groq integration
- [ ] Add Anthropic Claude integration
- [ ] Add OpenAI integration
- [ ] Settings UI for provider selection

### Phase 3: Style Research (Week 4)
- [ ] Implement LLM-based style research prompts
- [ ] Implement source citation from LLM knowledge
- [ ] Build Groove Recipe schema
- [ ] Test with real artist styles (popular + obscure)

---

## 7. TELIS Application to Development

### Track B: Context Engineering for Development

The TELIS methodology from the research document should be applied to create token-efficient development context:

**Documents to Create:**
1. **CLAUDE.md** — Project context for Claude Code CLI
2. **.cursorrules** — IDE-specific rules and patterns
3. **Knowledge Shards** — Compressed reference docs for M4L, JS, Node.js APIs

**TELIS Principles to Apply:**
- Tiered knowledge (nano → micro → full)
- LSP integration for real-time accuracy
- Progressive context negotiation
- Behavioral caching for common patterns

**Recommended Structure:**
```
/docs/
  ├── CLAUDE.md              # Main context for Claude Code
  ├── context/
  │   ├── m4l-shards.md      # Max for Live compressed reference
  │   ├── liveapi-shards.md  # Live Object Model patterns
  │   ├── llm-shards.md      # LLM integration patterns
  │   └── midi-math.md       # MIDI transformation formulas
  └── .cursorrules           # Cursor IDE rules
```

---

## 8. References and Sources

### Official Documentation
- [Ollama Documentation](https://ollama.com/docs) [Verified 2025]
- [Anthropic Claude API Docs](https://docs.anthropic.com) [Verified 2025]
- [Groq API Documentation](https://console.groq.com/docs) [Verified 2025]
- [Cycling74 Max Documentation](https://docs.cycling74.com) [Verified 2025]

### Performance Benchmarks
- [arXiv: Local LLM Runtime Comparison](https://arxiv.org/abs/2511.05502) - Nov 2025
- [Helicone LLM API Providers Comparison](https://www.helicone.ai/blog/llm-api-providers) - 2025

### Cost Analysis
- [xRoute LLM Cost Comparison](https://xroute.ai/techblog/the-cheapest-llm-api-a-cost-comparison/) - 2025
- [Intuition Labs Pricing Comparison](https://intuitionlabs.ai/articles/llm-api-pricing-comparison-2025) - 2025

---

## Next Steps

1. **Review this research** — Confirm architecture decisions align with vision
2. **Proceed to User Research** — Understand M4L buyer demographics and pricing sensitivity
3. **Create TELIS context documents** — CLAUDE.md and knowledge shards for development
4. **Move to PRD phase** — Formalize requirements based on validated architecture

---

**Document Information**

- **Workflow:** BMAD Research Workflow - Technical Research v2.0
- **Generated:** 2025-11-26
- **Research Type:** Technical Architecture Validation
- **Total Sources Cited:** 8

---

_This technical research report was generated using the BMAD Method Research Workflow. All version numbers and pricing are from verified November 2025 sources._

