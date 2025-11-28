# MIDI Transformation Math Knowledge Shards
## TELIS Tier 2 - Micro Reference (Token Budget: ~500)

> Compressed formulas for groove/timing transformations
> All functions pure JS, no external dependencies

---

## Symbolic Compression

```
@midi.swing     → applySwing(notes, ratio, gridSize)
@midi.humanize  → humanizeTiming(notes, varianceMs, tempo)
@midi.pushpull  → applyPushPull(notes, offsetsMs, tempo)
@midi.velocity  → applyVelocityCurve(velocity, curve, intensity)
@midi.pipeline  → applyGrooveRecipe(notes, recipe, intensity, tempo)
```

---

## Core Data Structure

```typescript
interface Note {
  pitch: number;      // 0-127
  start_time: number; // beats (float)
  duration: number;   // beats (float)
  velocity: number;   // 1-127
  mute: boolean;
}
```

### Constants
```javascript
const TICKS_PER_BEAT = 480;
const MS_PER_BEAT = (tempo) => 60000 / tempo;
const BEATS_TO_MS = (beats, tempo) => beats * MS_PER_BEAT(tempo);
const MS_TO_BEATS = (ms, tempo) => ms / MS_PER_BEAT(tempo);
```

---

## Swing Application

### Formula
```
For every "off-beat" (2nd, 4th, 6th... subdivision):
new_position = grid_position + (swing_ratio - 0.5) * subdivision_length
```

### Implementation
```javascript
/**
 * Apply swing to notes
 * @param {Note[]} notes 
 * @param {number} swingRatio - 0.5 (straight) to 0.75 (heavy swing)
 * @param {number} gridSize - Subdivision in beats (0.25 = 16th, 0.5 = 8th)
 */
function applySwing(notes, swingRatio, gridSize = 0.5) {
  return notes.map(note => {
    const gridPosition = Math.floor(note.start_time / gridSize);
    const isOffBeat = gridPosition % 2 === 1;
    
    if (isOffBeat) {
      const offset = (swingRatio - 0.5) * gridSize;
      return { ...note, start_time: note.start_time + offset };
    }
    return { ...note };
  });
}
```

### Common Swing Values
| Feel | Ratio | Description |
|------|-------|-------------|
| Straight | 0.50 | No swing |
| Light | 0.54 | Subtle groove |
| Medium | 0.58 | Standard swing |
| Triplet | 0.67 | True triplet feel |
| Heavy | 0.72 | Laid back |

---

## Humanization (Micro-timing)

### Formula
```
new_time = original_time + random(-variance, +variance)
```

### Implementation
```javascript
/**
 * Add human-like timing variance
 * @param {Note[]} notes
 * @param {number} varianceMs - Max deviation in milliseconds
 * @param {number} tempo - BPM for conversion
 */
function humanizeTiming(notes, varianceMs, tempo) {
  const varianceBeats = MS_TO_BEATS(varianceMs, tempo);
  
  return notes.map(note => ({
    ...note,
    start_time: note.start_time + (Math.random() * 2 - 1) * varianceBeats
  }));
}
```

---

## Push/Pull per Beat Position

### Implementation
```javascript
/**
 * Apply per-beat timing offsets
 * @param {Note[]} notes
 * @param {number[]} offsetsMs - Offset for each beat position [1,2,3,4]
 * @param {number} tempo
 */
function applyPushPull(notes, offsetsMs, tempo) {
  return notes.map(note => {
    const beatPosition = Math.floor(note.start_time) % offsetsMs.length;
    const offsetBeats = MS_TO_BEATS(offsetsMs[beatPosition], tempo);
    return { ...note, start_time: note.start_time + offsetBeats };
  });
}
```

---

## Velocity Transformations

### Curve Application
```javascript
/**
 * Apply velocity curve
 * @param {number} velocity - Original (1-127)
 * @param {string} curve - 'linear' | 'exponential' | 'logarithmic'
 * @param {number} intensity - 0-1
 */
function applyVelocityCurve(velocity, curve, intensity) {
  const normalized = velocity / 127;
  let shaped;
  
  switch (curve) {
    case 'exponential':
      shaped = Math.pow(normalized, 1 + intensity);
      break;
    case 'logarithmic':
      shaped = Math.pow(normalized, 1 / (1 + intensity));
      break;
    default: // linear
      shaped = normalized;
  }
  
  return Math.round(shaped * 127);
}
```

### Ghost Note Detection
```javascript
function isGhostNote(velocity, threshold = 40) {
  return velocity < threshold;
}
```

### Accent Boost
```javascript
function boostAccents(notes, threshold, boostFactor) {
  return notes.map(note => {
    if (note.velocity >= threshold) {
      return { 
        ...note, 
        velocity: Math.min(127, Math.round(note.velocity * boostFactor))
      };
    }
    return { ...note };
  });
}
```

---

## Articulation (Note Length)

### Implementation
```javascript
/**
 * Adjust note durations
 * @param {Note[]} notes
 * @param {number} lengthFactor - 0.5 (staccato) to 1.5 (legato)
 */
function adjustArticulation(notes, lengthFactor) {
  return notes.map(note => ({
    ...note,
    duration: note.duration * lengthFactor
  }));
}
```

---

## Intensity Scaling (0-200%)

```javascript
/**
 * Scale transformation intensity
 * @param {number} value - Base transformation value
 * @param {number} intensity - 0-200 (100 = normal, 200 = exaggerated)
 */
function scaleByIntensity(value, intensity) {
  const factor = intensity / 100;
  return value * factor;
}

// For timing offsets
const scaledOffset = scaleByIntensity(baseOffset, intensity);

// For swing (keep 0.5 as center)
const scaledSwing = 0.5 + scaleByIntensity(baseSwing - 0.5, intensity);
```

---

## Full Transformation Pipeline

```javascript
function applyGrooveRecipe(notes, recipe, intensity, tempo) {
  let result = [...notes];
  
  // 1. Swing
  const scaledSwing = 0.5 + scaleByIntensity(
    recipe.timing.swing_ratio - 0.5, intensity
  );
  result = applySwing(result, scaledSwing);
  
  // 2. Push/Pull
  const scaledOffsets = recipe.timing.push_pull_ms.map(
    o => scaleByIntensity(o, intensity)
  );
  result = applyPushPull(result, scaledOffsets, tempo);
  
  // 3. Humanize
  const scaledVariance = scaleByIntensity(
    recipe.timing.micro_timing_variance, intensity
  );
  result = humanizeTiming(result, scaledVariance, tempo);
  
  // 4. Velocity
  result = result.map(n => ({
    ...n,
    velocity: applyVelocityCurve(n.velocity, recipe.velocity.curve, intensity/100)
  }));
  
  // 5. Articulation
  const scaledLength = 1 + scaleByIntensity(
    recipe.articulation.note_length_factor - 1, intensity
  );
  result = adjustArticulation(result, scaledLength);
  
  return result;
}
```

---

## Gotchas

1. **Velocity range**: 1-127 (not 0-127) — 0 = note off in MIDI
2. **Negative timing**: Push offsets can place notes before clip start — clamp to 0
3. **Float precision**: Beat positions like `0.333...` cause drift — round to tick resolution
4. **Swing grid**: Assumes notes quantized to grid — off-grid notes skip swing
5. **Intensity center**: 100% = neutral (1.0x), not 0%

---

_TELIS Tier 2 Shard | ~520 tokens | Last updated: 2025-11-27_

