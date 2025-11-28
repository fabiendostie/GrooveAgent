# GrooveAgent UX Design Specification

_Created on 2025-11-26 by Fab_
_Generated using BMad Method - Create UX Design Workflow v1.0_

---

## Executive Summary

**Project:** GrooveAgent — Max for Live MIDI Style Transfer Plugin

**Vision:** "Transfer the rhythmic DNA of any artist — from J Dilla's pocket to Questlove's swing — in one click."

**Target Users:** 
- **Primary:** Bedroom/home studio producers (age 22-35, 2-5 years experience) using Ableton Live
- **Secondary:** Professional producers needing to deliver "that [artist] feel" quickly
- **Tertiary:** Curious experimenters learning about groove

**The Magic Moment:** User enters "J Dilla" → waits 20-30 seconds → hears their stiff programmed beat suddenly *breathe* with that unmistakable behind-the-beat pocket.

**Platform:** Max for Live (Ableton Live 12+, macOS/Windows)

**Desired Emotional Response:** **Satisfied** and **Proud**

- **Satisfied** — The tool delivers on its promise. No frustration, no "almost there." It just *works*.
- **Proud** — "I made this." The user feels ownership of the result. They've leveled up.

**UX Implication:** GrooveAgent is an enabler that fades into the background. The magic moment is the USER's beat sounding incredible — not the plugin being impressive. Professional tool, not toy.

**UX Complexity:** Low-Medium (single-purpose tool, clear workflow, limited controls)

**Inspiration Sources:**
- [Fors](https://fors.fm/) (Opal, Dyad) — Elektron-inspired, minimal but feature-dense
- [Dillon Bastan](https://dillonbastan.com/) (Pathways, Natural Selection) — Visual/generative feedback
- [iftah](https://iftah.gumroad.com/) (STING, Patterns) — Single-purpose focus, instant musicality
- [ELPHNT](https://elphnt.io/) (Essentials) — Clean minimal aesthetic
- [ijo audio](https://snakeshaky.gumroad.com/) (Grain Storm, Meridian) — High-quality polish, smooth animations
- 510k/AlexKidd — Community favorite for professional design

---

## 1. Design System Foundation

### 1.1 Design System Choice

**Selected: Hybrid Approach**

| Component Type | Implementation | Rationale |
|---------------|----------------|-----------|
| **All Controls** | Native `live.*` objects | Theme-compatible, MIDI mappable, automatable, familiar Ableton feel |
| **Display Screen** | Custom `jsui` | Signature element with OLED aesthetic, animations, custom typography |
| **Backgrounds** | `panel` objects | Simple organization, theme-aware |

**Why Hybrid:**
- Native controls = professional Ableton integration (satisfied)
- Custom display = distinctive character (proud)
- Balances development speed with visual polish
- Maintains automation/MIDI mapping for all controls
- Display screen becomes the signature differentiator

---

## 2. Core User Experience

### 2.1 Defining Experience

**Core Interaction:** Artist name → Apply → Transformed groove

**The ONE thing users will do most:** Repeatedly trying different artists to find the perfect groove

**What must be effortless:** The Apply workflow — minimum friction from idea to result

**Most critical moment:** TWO moments matter equally:
1. **The Result** — Hearing the transformation work (the "magic moment")
2. **The Wait** — The 20-30 second generation animation must be *captivating* enough to serve as a distraction. This is not just feedback — it's entertainment.

### 2.2 Display Screen Aesthetic

**Chosen Direction:** Modern Synth OLED — Minimal

**Inspiration:**
- High contrast (bright elements on deep black)
- Clean sans-serif typography
- Subtle glow effects on active elements
- Minimal decoration, maximum clarity
- Think: Elektron Digitakt, OP-1, modern Eurorack modules

**Key Visual Principles:**
- Deep black background (#000000 or near-black)
- Bright accent color for active states (to be determined)
- Monospace or clean sans-serif font for data
- Subtle animations, not flashy
- Information density without clutter

### 2.3 The Waiting Animation — A Key UX Moment

The 20-30 second LLM research phase needs an animation that:
- **Captivates attention** — Not just a spinner, something worth watching
- **Communicates progress** — User knows something is happening
- **Builds anticipation** — Creates excitement for the result
- **Stays on-brand** — Fits the minimal OLED aesthetic

**Animation Concepts to Explore:**
- Waveform/groove visualization building up
- Text appearing character-by-character (research findings)
- Abstract rhythm pattern morphing
- Source citations appearing as "discovered"
- Progress bar with musical timing (synced to tempo?)

---

## 2.4 Inspiration Analysis

### Developers & Devices Studied

| Developer | Key Devices | UX Lessons for GrooveAgent |
|-----------|-------------|---------------------------|
| **[Fors](https://fors.fm/)** | Opal, Dyad | Elektron-inspired layout, high contrast, minimal palette |
| **[Dillon Bastan](https://dillonbastan.com/)** | Pathways, Natural Selection | Generative visuals, engaging animations |
| **[iftah](https://iftah.gumroad.com/)** | STING, Patterns | Single-purpose focus, instant musicality |
| **[ELPHNT](https://elphnt.io/)** | Essentials, GEN | Clean minimal aesthetic, functional simplicity |
| **[ijo audio](https://snakeshaky.gumroad.com/)** | Grain Storm, Meridian | Professional polish, smooth animations |
| **510k/AlexKidd** | Various | Community-favorite clean design |

### Key UX Patterns to Apply

| Pattern | Source | Application to GrooveAgent |
|---------|--------|---------------------------|
| **Single-purpose focus** | iftah STING | One job done brilliantly: Artist → Groove |
| **Visual feedback as engagement** | Dillon Bastan | Waiting animation is part of the experience |
| **Minimal but feature-dense** | Fors Opal | Compact layout, every pixel earns its place |
| **High-contrast OLED aesthetic** | ijo audio | Deep blacks, bright accents, clean typography |
| **Instant musicality** | iftah Generators | Results should sound good immediately |
| **Professional polish** | All | No rough edges, justifies the price |

### Design Principles Extracted

1. **Focused Simplicity** — Do one thing brilliantly, not many things adequately
2. **Visual Engagement** — Animations serve purpose (feedback) AND delight
3. **Professional Polish** — Quality of finish communicates value
4. **Familiar Patterns** — Elektron/hardware-inspired UX is known to target users
5. **Instant Gratification** — Every interaction should feel rewarding

---

## 3. Visual Foundation

### 3.1 Color System — Display Screen (jsui)

**Aesthetic:** Modern Synth OLED — Elektron-inspired cold precision

| Role | Color | Hex | Usage |
|------|-------|-----|-------|
| **Background** | Deep Black | `#000000` | Display screen base |
| **Primary Text** | Pure White | `#FFFFFF` | Main status text, labels |
| **Accent** | Cyan | `#00D4FF` | Active states, progress, highlights |
| **Accent Dim** | Dark Cyan | `#006B80` | Inactive elements, secondary info |
| **Success** | Cyan (same) | `#00D4FF` | Completion states |
| **Warning** | Amber | `#FFB800` | Low confidence, warnings |
| **Error** | Coral Red | `#FF4757` | Error states |
| **Subtle** | Dark Gray | `#333333` | Borders, separators |

### 3.2 Typography — Display Screen

| Role | Font | Size | Weight |
|------|------|------|--------|
| **Status Text** | System Sans (or SF Mono) | 12-14px | Regular |
| **Labels** | System Sans | 10px | Regular |
| **Citations** | System Mono | 9-10px | Regular |
| **Numbers** | System Mono | 12px | Medium |

**Note:** jsui uses system fonts by default. SF Mono or similar monospace for data display.

### 3.3 Native Controls (live.* objects)

Native `live.*` objects automatically adapt to Ableton's theme colors:
- **Light theme:** Dark text on light backgrounds
- **Dark theme:** Light text on dark backgrounds

No custom colors needed — they integrate seamlessly.

### 3.4 Visual Hierarchy

```
┌─────────────────────────────────────────────────┐
│  [Display Screen - OLED Black + Cyan Accent]    │
│                                                 │
│  Status text, animations, citations             │
│                                                 │
├─────────────────────────────────────────────────┤
│  [Native Controls - Theme-adaptive]             │
│                                                 │
│  Dropdowns, dials, buttons                      │
└─────────────────────────────────────────────────┘
```

The display screen is visually distinct (OLED black) while controls blend with Ableton's UI.

---

## 4. Design Direction

### 4.1 Chosen Design Approach

**Selected: Direction 1 — Vertical Stack with Psychedelic Piano Roll Animation**

| Aspect | Decision |
|--------|----------|
| **Layout** | Vertical stack — screen on top, controls below |
| **Width** | ~340px (compact, Fors-inspired) |
| **Screen Height** | ~140px (room for animation) |
| **Animation Style** | Psychedelic piano roll with floating particles |
| **Button Heights** | Settings button matches Apply Groove height |

### 4.2 Animation Specification — Psychedelic Piano Roll

The 20-30 second wait becomes a **captivating visual experience**:

| Element | Description |
|---------|-------------|
| **Playhead** | Cyan line sweeping left→right every 4 seconds, with glow effect |
| **Piano Roll Grid** | Subtle grid lines as background, notes appear at random positions |
| **Note Bars** | Appear instantly (pop-in), fixed width, gradient cyan→teal |
| **Humanized Timing** | Notes are **off-grid** — swing applied to offbeat 16ths, ±3% micro-timing variance |
| **Ghost Notes** | 30% chance, dimmer and smaller — simulates velocity variation |
| **Note Disappear** | Shrinks from right edge as it fades out |
| **Note Clusters** | Occasional rapid-fire "fills" (2-5 notes) for visual interest |
| **Psychedelic Waves** | Two translucent color waves sweep across in opposite directions |
| **Floating Particles** | Small glowing dots rise from bottom to top |
| **Progress Bar** | Gradient-animated (cyan→teal→cyan) showing completion |
| **Citations Reveal** | Source URLs fade in near the end |
| **Artist Name Glow** | Subtle cyan text-shadow, pulsing |

**Key Insight:** The animation itself demonstrates the GrooveAgent concept — the notes have swing, off-grid timing, and human feel, showing users what the tool does while they wait.

**Screen States:**

| State | Visual |
|-------|--------|
| **Idle** | "Ready to groove!" — clean, minimal, no animation |
| **Researching** | Full animation: piano roll + waves + particles + progress |
| **Complete** | Green accent, "4 variations created ✓", citations visible |
| **Error** | Red accent, educational message |

**Interactive Mockups:**
- Design Options: [ux-design-directions.html](./ux-design-directions.html)
- Final Design: [ux-design-final.html](./ux-design-final.html) ⭐

---

## 5. User Journeys

### 5.1 Journey: First-Time Setup

**Approach:** Smart Defaults with Auto-Start

```
1. Plugin loads
2. Check if Ollama is running (localhost:11434)
3. If NOT running:
   → Try to auto-start Ollama ('ollama serve')
   → Wait 2-3 seconds
   → Retry connection
4. If STILL not running:
   → Show: "Ollama not found. Is it installed?"
   → Offer: [Install Ollama] [Use API Key Instead]
5. If running:
   → "Ready to groove!" (no interruption)
```

**Result:** Most users with Ollama installed see zero setup friction.

### 5.2 Journey: Apply Groove (Core Flow)

```
1. USER ENTERS ARTIST NAME
   └─→ Type "J Dilla" in text field

2. USER ADJUSTS SETTINGS (optional)
   └─→ Model, Bars, Variations, Intensity

3. USER CLICKS "APPLY GROOVE"
   └─→ Button disabled, screen shows animation

4. SYSTEM RESEARCHES (20-30 sec)
   └─→ Piano roll animation, progress bar, status text

5. SYSTEM SHOWS RESULTS
   └─→ "4 variations created ✓", sources displayed

6. USER AUDITIONS CLIPS
   └─→ New clips appear in Ableton, user plays them
```

### 5.3 Journey: Error Handling

| Error | Display Screen Shows | User Action |
|-------|---------------------|-------------|
| **Ollama not installed** | "Ollama not found. [Install] [Use API]" | Install or use API |
| **API key invalid** | "API key rejected. Check Settings." | Fix key |
| **Low confidence** | "Only 2 sources. Results may vary. [Proceed] [Cancel]" | Choose |
| **Empty clip** | "Selected clip is empty." | Add notes |
| **No empty slots** | "No empty slots for output." | Clear slot |
| **Timeout** | "Request timed out. [Retry]" | Retry |

---

## 7. UX Pattern Decisions

### 7.1 Button Hierarchy

| Type | Style | Usage |
|------|-------|-------|
| **Primary** | Cyan background, black text | APPLY GROOVE |
| **Secondary** | Gray background, white text | Settings ⚙ |
| **Disabled** | 50% opacity, no cursor | During processing |

### 7.2 Feedback Patterns

**Single Location Rule:** ALL feedback goes to the display screen.

| State | Display Content |
|-------|----------------|
| Idle | "Ready to groove!" |
| Processing | Animation + "RESEARCHING..." + progress bar |
| Complete | "N variations created ✓" + sources |
| Warning | Amber text + action options |
| Error | Red accent + educational message + fix suggestion |

### 7.3 Error Display Pattern

- **Educational, not cryptic** — explain what happened
- **Actionable** — always show what to do next
- **Color-coded** — amber for warnings, red for errors
- **In-place** — no modal popups for errors

### 7.4 Empty States

| Context | Display |
|---------|---------|
| First launch (ready) | "Ready to groove! Enter an artist name." |
| First launch (setup needed) | "Let's set up your LLM provider..." |
| After completion | Last artist name + source count |

---

## 8. UI Components (from PRD v1.1)

### 5.1 Component Inventory

| Component | Description | M4L Object | Priority |
|-----------|-------------|------------|----------|
| **Artist Input** | Text field for artist/producer name | `live.text` (mode=1) | Critical |
| **LLM Model Selector** | Dropdown: Ollama, Claude, GPT, Groq | `live.menu` | Critical |
| **Number of Bars** | Dropdown: 1, 2, 4, 8, 16 bars | `live.menu` | Critical |
| **Variations Selector** | 1-6 clips to generate | `live.dial` or `live.menu` | Critical |
| **Intensity Slider** | 0-200% effect strength | `live.dial` or `live.slider` | Critical |
| **Apply Button** | Primary action trigger | `live.text` (button) | Critical |
| **Settings Button** | Access configuration | `live.text` (button) | High |
| **Display Screen** | Central feedback area | `jsui` | Critical |

### 5.2 Display Screen States

| State | Content |
|-------|---------|
| **Idle** | "Ready to groove!" + last artist |
| **Researching** | Animated searching + status text |
| **Generating** | Recipe parameters + progress |
| **Complete** | Citations + confidence score |
| **Error** | Educational message + fix suggestion |
| **Low Confidence** | Warning + proceed/cancel |

---

## 6. User Journey Flows

### 6.1 Critical User Paths

*(To be designed through collaborative workshop)*

---

## 7. UX Pattern Decisions

### 7.1 Consistency Rules

*(To be established through pattern review)*

---

## 8. Responsive Design & Accessibility

### 8.1 Platform Constraints

- **Fixed Width:** Standard M4L device width (bpatcher)
- **Single Platform:** Desktop only (Ableton Live)
- **Theme Support:** Must work with Ableton's light/dark themes

### 8.2 Accessibility

| Requirement | Implementation |
|-------------|----------------|
| **Theme compatibility** | Native `live.*` controls auto-adapt to Ableton themes |
| **Display contrast** | High contrast (white/cyan on black OLED) |
| **MIDI mapping** | All native controls are MIDI mappable |
| **Keyboard nav** | Native controls support Tab/Arrow keys |
| **Color blindness** | Cyan/amber/red distinguishable + text labels |

**Note:** jsui display screen is visual-only (M4L constraint). Critical info also appears in Ableton's status bar where possible.

---

## 9. M4L UI Implementation Research

### 9.1 Available UI Objects

| Object | Use Case | Theme-Aware | MIDI Mappable |
|--------|----------|-------------|---------------|
| `live.menu` | Dropdowns | ✅ Yes | ✅ Yes |
| `live.dial` | Rotary knobs | ✅ Yes | ✅ Yes |
| `live.slider` | Linear sliders | ✅ Yes | ✅ Yes |
| `live.text` | Buttons/text input | ✅ Yes | ✅ Yes |
| `live.numbox` | Numeric input | ✅ Yes | ✅ Yes |
| `jsui` | Custom graphics | ⚠️ Manual | ❌ No |
| `lcd` | Simple graphics | ⚠️ Manual | ❌ No |
| `panel` | Background color | ✅ Yes | ❌ No |
| `fpic` | Background image | ❌ No | ❌ No |

### 9.2 Recommendation: Hybrid Approach

**Native Controls:** Use `live.*` objects for all interactive controls
- Theme-compatible automatically
- MIDI mappable and automatable
- Familiar to Ableton users

**Custom Display:** Use `jsui` for the display screen
- Full creative control over appearance
- Custom animations and text rendering
- Retro/hardware aesthetic possible
- Must manually query theme colors via `live.colors`

---

## Appendix

### Related Documents

- Product Requirements: `docs/prd.md` (v1.1)
- Product Brief: `docs/product-brief-GrooveAgent-2025-11-26.md`
- Brainstorming: `docs/bmm-brainstorming-session-2025-11-26.md`

### Version History

| Date | Version | Changes | Author |
|------|---------|---------|--------|
| 2025-11-26 | 0.1 | Initial template with project context and M4L research | Fab |
| 2025-11-26 | 1.0 | Complete UX Design Specification | Fab |

---

## 9. Completion Summary

### What We Created Together

| Deliverable | Description |
|-------------|-------------|
| **Design System** | Hybrid (native `live.*` controls + `jsui` display screen) |
| **Visual Foundation** | Cyan OLED theme (#00D4FF on #000000) |
| **Design Direction** | Vertical Stack layout (~340px width) |
| **Signature Element** | Psychedelic piano roll animation with swing/humanization |
| **User Journeys** | 3 flows (Setup, Apply Groove, Error Handling) |
| **UX Patterns** | Button hierarchy, feedback, error display, empty states |

### Key Design Decisions

1. **Display screen is the communication hub** — all feedback, animations, errors
2. **Animation demonstrates the product** — swung, off-grid notes show what GrooveAgent does
3. **Auto-start Ollama** — zero-friction experience for FREE users
4. **Settings button matches Apply Groove height** — visual balance
5. **Educational errors** — always explain what happened and what to do

### Interactive Deliverables

| File | Description |
|------|-------------|
| `ux-design-directions.html` | 4 layout options explored |
| `ux-design-final.html` | Final design with piano roll animation |

### Next Steps

1. **Architecture** — Define system design and Groove Recipe schema
2. **Implementation** — Build the M4L device following this spec
3. **Optional** — Create high-fidelity Figma mockups from this foundation

---

_This UX Design Specification was created through collaborative design facilitation._

_All decisions were made with user input and documented with rationale._

