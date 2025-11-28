<div align="center">

# 🎹 GrooveAgent

### *AI-Powered MIDI Style Transfer for Ableton Live*

[![Node.js](https://img.shields.io/badge/Node.js-20+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Max for Live](https://img.shields.io/badge/Max_for_Live-8.6+-00C7B7?style=for-the-badge&logo=ableton-live&logoColor=white)](https://www.ableton.com/en/live/max-for-live/)
[![License](https://img.shields.io/badge/License-ISC-blue?style=for-the-badge)](LICENSE)
[![Tests](https://img.shields.io/badge/Tests-138_Passing-success?style=for-the-badge&logo=jest&logoColor=white)](#testing)

<br/>

<img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/abletonlive.svg" width="120" alt="Ableton Live"/>

<br/>

**Transform any MIDI clip with the groove and feel of legendary artists.**

*Enter "J Dilla" → Watch the magic happen → Your drums now swing like Dilla's.*

<br/>

[Getting Started](#-getting-started) •
[Features](#-features) •
[How It Works](#-how-it-works) •
[Documentation](#-documentation)

<br/>

---

</div>

<br/>

## ✨ Features

<table>
<tr>
<td width="50%">

### 🎯 **One-Click Style Transfer**
Enter any artist name and instantly apply their signature groove to your MIDI clips.

### 🔬 **Research-Backed Recipes**
AI researches real sources to build accurate "Groove Recipes" with timing, velocity, and articulation data.

### 🎛️ **Full Control**
Adjust intensity from subtle (25%) to exaggerated (200%). Generate up to 4 variations per transform.

</td>
<td width="50%">

### 🏠 **Privacy First**
Runs locally with Ollama by default. Your music never leaves your machine.

### 🔌 **Multi-Provider LLM**
Choose from Ollama (free), Claude, OpenAI, or Groq based on your needs.

### 🎨 **Beautiful UI**
Psychedelic piano roll visualization keeps you entertained during processing.

</td>
</tr>
</table>

<br/>

## 🚀 Getting Started

### Prerequisites

- **Ableton Live 11/12** with Max for Live
- **Node.js 20+** ([Download](https://nodejs.org/))
- **Ollama** (recommended) or API key for Claude/OpenAI/Groq

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/GrooveAgent.git

# Install dependencies
cd GrooveAgent/src/node
npm install

# (Optional) Install Ollama for local AI
# Visit: https://ollama.ai
```

### Quick Start

1. **Open** `src/max/GrooveAgent.amxd` in Ableton Live
2. **Select** a MIDI clip with some notes
3. **Type** an artist name (e.g., "J Dilla", "Questlove", "Bernard Purdie")
4. **Click** Apply and watch the transformation

<br/>

## 🎵 How It Works

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│   📝 Artist Input          🔍 AI Research           🧪 Groove Recipe    │
│   ──────────────────────────────────────────────────────────────────   │
│                                                                         │
│   "J Dilla"      →    Research swing,     →    {                       │
│                       timing patterns,          swing: 0.67,           │
│                       velocity curves           push_pull: [-12, 8],   │
│                       from 4+ sources           ghost_threshold: 40    │
│                                                }                        │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   🎹 MIDI Input           🔄 Transform            🎶 Output            │
│   ──────────────────────────────────────────────────────────────────   │
│                                                                         │
│   Your clip       →    Apply timing,      →    Transformed clip       │
│   [straight]           velocity, &             [with groove feel]      │
│                        articulation                                     │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

<br/>

## 🏗️ Architecture

```
GrooveAgent/
├── src/
│   ├── max/                    # Max for Live device
│   │   ├── GrooveAgent.amxd    # Main device file
│   │   ├── GrooveAgent.maxpat  # Max patcher
│   │   └── display.js          # Piano roll visualization
│   │
│   └── node/                   # Node.js backend
│       ├── index.js            # Entry point & command handler
│       ├── llm/                # LLM provider abstraction
│       │   ├── ollama.js       # Local AI (default)
│       │   ├── claude.js       # Anthropic Claude
│       │   ├── openai.js       # OpenAI GPT
│       │   └── groq.js         # Groq (ultra-fast)
│       ├── midi/               # MIDI transformation
│       │   ├── timing.js       # Swing & micro-timing
│       │   ├── velocity.js     # Velocity curves
│       │   └── articulation.js # Note lengths
│       └── utils/              # Utilities
│           ├── errors.js       # Error handling
│           └── logger.js       # Structured logging
│
├── tests/                      # Test suite
├── docs/                       # Documentation
└── package.json
```

<br/>

## 🧪 Testing

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific test suite
npm test -- tests/utils/errors.test.js
```

**Current Status:** `138 tests passing` ✅

<br/>

## 🛠️ Development

```bash
# Lint code
npm run lint

# Auto-fix lint issues
npm run lint:fix

# Format code
npm run format

# Run all checks (lint + format + test)
npm run check
```

### Pre-commit Hooks

This project uses **Husky** + **lint-staged** to ensure code quality:
- ✅ ESLint checks
- ✅ Prettier formatting
- ✅ Runs automatically on `git commit`

<br/>

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [Architecture](docs/architecture.md) | System design & technical decisions |
| [PRD](docs/prd.md) | Product requirements document |
| [Epics & Stories](docs/epics.md) | Development roadmap |
| [Tech Spec](docs/sprint-artifacts/tech-spec-epic-1.md) | Technical specifications |

<br/>

## 🗺️ Roadmap

- [x] **Epic 1:** Foundation & Setup *(Complete)*
- [ ] **Epic 2:** Core Groove Magic - The main feature
- [ ] **Epic 3:** Multi-Provider LLM Support
- [ ] **Epic 4:** Settings & Persistence
- [ ] **Epic 5:** First-Run Onboarding
- [ ] **Epic 6:** Display Screen Polish

<br/>

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/amazing-feature`)
3. Commit with conventional commits (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feat/amazing-feature`)
5. Open a Pull Request

<br/>

## 📄 License

This project is licensed under the **ISC License** - see the [LICENSE](LICENSE) file for details.

<br/>

---

<div align="center">

**Made with 🎹 for music producers who want that *feel***

<br/>

*GrooveAgent is not affiliated with Ableton AG.*

</div>

