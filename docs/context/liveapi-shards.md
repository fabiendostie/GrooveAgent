# LiveAPI / Live Object Model Knowledge Shards
## TELIS Tier 2 - Micro Reference (Token Budget: ~500)

> Compressed LOM patterns for Ableton Live integration
> Full docs: https://docs.cycling74.com/max8/vignettes/live_object_model

---

## Symbolic Compression

```
@lom.path.clip      → 'live_set tracks N clip_slots M clip'
@lom.view           → 'live_set view'
@lom.selected.clip  → view.get('detail_clip')
@lom.notes.get      → clip.call('get_notes_extended', ...)
@lom.notes.set      → clip.call('set_notes_extended', ...)
```

---

## Object Hierarchy

```
live_app
  └── live_set
        ├── tracks[N]
        │     ├── clip_slots[N]
        │     │     └── clip
        │     ├── devices[N]
        │     └── mixer_device
        ├── scenes[N]
        ├── cue_points[N]
        └── view
```

---

## Path Patterns

### Canonical Paths
```javascript
'live_set'                              // Song
'live_set tracks 0'                     // First track
'live_set tracks 0 clip_slots 0'        // First slot
'live_set tracks 0 clip_slots 0 clip'   // Clip in slot
'live_set view'                         // UI state
'live_set view selected_track'          // Selected track
'live_set view detail_clip'             // Focused clip
```

### Dynamic Navigation
```javascript
var track = new LiveAPI('live_set tracks 0');
track.goto('clip_slots');     // → 'live_set tracks 0 clip_slots'
track.goto('clip_slots 0');   // → 'live_set tracks 0 clip_slots 0'
```

---

## Clip Properties

| Property | Type | R/W | Description |
|----------|------|-----|-------------|
| `name` | string | RW | Clip name |
| `length` | float | R | Length in beats |
| `start_time` | float | R | Loop start |
| `end_time` | float | R | Loop end |
| `loop_start` | float | RW | Loop region start |
| `loop_end` | float | RW | Loop region end |
| `is_midi_clip` | bool | R | MIDI vs audio |
| `is_playing` | bool | R | Currently playing |
| `playing_position` | float | R | Current position |
| `color` | int | RW | Clip color |

### Get/Set Pattern
```javascript
var clip = new LiveAPI('...');
var name = clip.get('name');           // Returns array
clip.set('name', 'New Name');
var length = parseFloat(clip.get('length'));
```

---

## Clip Methods (MIDI)

### Note Operations
| Method | Args | Returns | Purpose |
|--------|------|---------|---------|
| `get_notes_extended` | start, range, pitch_start, pitch_range | notes dict | Get notes |
| `set_notes_extended` | notes dict | - | Set notes |
| `remove_notes_extended` | start, range, pitch_start, pitch_range | - | Delete notes |
| `select_all_notes` | - | - | Select all |
| `deselect_all_notes` | - | - | Deselect all |
| `replace_selected_notes` | - | - | Start note replacement |
| `notes` | count | - | Begin adding notes |
| `note` | pitch, time, dur, vel, mute | - | Add single note |
| `done` | - | - | Finish adding |

### Example: Read + Modify + Write
```javascript
// Read
var notes = clip.call('get_notes_extended', 0, 128, 0, 128);

// Modify
notes.notes.forEach(n => {
  n.velocity = Math.min(127, n.velocity * 1.1);
});

// Write back
clip.call('remove_notes_extended', 0, 128, 0, 128);
clip.call('set_notes_extended', notes);
```

---

## ClipSlot Properties/Methods

| Item | Type | Description |
|------|------|-------------|
| `has_clip` | bool | Slot contains clip |
| `clip` | child | Access clip |
| `is_triggered` | bool | Launch queued |
| `create_clip` | method(length) | Create new clip |
| `delete_clip` | method | Remove clip |
| `duplicate_clip_to` | method(slot_id) | Copy clip |
| `fire` | method | Launch clip |
| `stop` | method | Stop clip |

---

## Track Properties

| Property | Type | Description |
|----------|------|-------------|
| `name` | string | Track name |
| `clip_slots` | children | Slot access |
| `arm` | bool | Record armed |
| `mute` | bool | Muted |
| `solo` | bool | Soloed |
| `volume` | float | Volume (0-1) |
| `panning` | float | Pan (-1 to 1) |
| `color` | int | Track color |

---

## View Object

| Property | Type | Description |
|----------|------|-------------|
| `selected_track` | id | Currently selected track |
| `selected_scene` | id | Currently selected scene |
| `detail_clip` | id | Clip in detail view |
| `highlighted_clip_slot` | id | Focused slot |

### Get Selected Clip Pattern
```javascript
var view = new LiveAPI('live_set view');
var clipId = view.get('detail_clip');
if (clipId != 0) {
  var clip = new LiveAPI(null);
  clip.id = parseInt(clipId);
  // Now use clip...
}
```

---

## Observations (Live Events)

```javascript
var api = new LiveAPI(callback, 'live_set');
api.property = 'is_playing';  // Observe this property

function callback(args) {
  if (args[0] === 'is_playing') {
    var playing = args[1] == 1;
    // React to play state change
  }
}
```

### Observable Properties
Most R/O properties are observable. Common ones:
- `is_playing`, `playing_position`
- `current_song_time`, `tempo`
- `selected_track`, `detail_clip`

---

## ID vs Path

| Use | When |
|-----|------|
| **Path** | Initial access, known position |
| **ID** | After getting reference, survives reordering |

```javascript
// Path access
var clip = new LiveAPI('live_set tracks 0 clip_slots 0 clip');

// Store ID for later
var clipId = parseInt(clip.id);

// ID access (faster, survives track moves)
var clip2 = new LiveAPI(null);
clip2.id = clipId;
```

---

## Clip Error Codes

| Code | Check | Suggestion |
|------|-------|------------|
| `CLIP_EMPTY` | `notes.notes.length === 0` | Select clip with MIDI notes |
| `CLIP_TOO_LONG` | `clip.get('length') > 16` | Shorten to 16 bars or less |
| `NO_EMPTY_SLOTS` | No slot with `has_clip === false` | Clear a clip slot |

```javascript
// Pre-validation pattern
function validateClip(clip) {
  if (clip.id === 0) return { error: 'CLIP_EMPTY' };
  if (parseFloat(clip.get('length')) > 16) return { error: 'CLIP_TOO_LONG' };
  return { valid: true };
}
```

---

## Gotchas

1. **get() returns array**: `clip.get('length')` returns `[value]`, extract with `[0]` or `parseFloat()`
2. **ID pairs**: `api.get('tracks')` returns `[id1, id1, id2, id2, ...]` — divide length by 2
3. **Clip null check**: Always verify `clip.id != 0` before operations
4. **Path vs ID**: Use paths for initial access, IDs for persistence across reordering
5. **parseInt required**: `clip.id` is string, use `parseInt(clip.id)` for ID access

---

_TELIS Tier 2 Shard | ~500 tokens | Last updated: 2025-11-28_

