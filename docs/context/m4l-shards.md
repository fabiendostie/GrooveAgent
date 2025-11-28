# Max for Live Knowledge Shards
## TELIS Tier 2 - Micro Reference (Token Budget: ~500)

> Compressed patterns for Max for Live development
> Full docs: https://docs.cycling74.com

---

## Symbolic Compression

```
@m4l.node.script  → node.script object in Max
@m4l.api          → new LiveAPI(path) instance
@m4l.api.clip     → new LiveAPI('live_set tracks N clip_slots M clip')
@m4l.get.notes    → clip.call('get_notes_extended', start, range, pitch_start, pitch_range)
@m4l.set.notes    → clip.call('set_notes_extended', notesDict)
```

---

## node.script Object

### Syntax
```
[node.script mymodule.js @autostart 1 @watch 1]
```

### Attributes
| Attr | Type | Default | Purpose |
|------|------|---------|---------|
| `@autostart` | 0/1 | 0 | Auto-start on load |
| `@watch` | 0/1 | 0 | Reload on file change |
| `@node` | path | system | Node.js executable path |

### Communication Pattern
```javascript
// Node.js side (mymodule.js)
const max = require('max-api');

// Send to Max
max.outlet('message', arg1, arg2);
max.outlet('dict', { key: 'value' });

// Receive from Max
max.addHandler('functionName', (...args) => {
  // handle message
});

// Log to Max console
max.post('Debug message');
```

### Max Patch Side
```
[node.script mymodule.js]
  |
[route message dict]
  |         |
[...handle] [dict.unpack]
```

---

## js Object (Legacy)

### Syntax
```
[js mycode.js @autowatch 1]
```

### Key Differences from node.script
| Feature | js | node.script |
|---------|----|-----------
| Runtime | Max internal | Full Node.js |
| npm packages | ❌ | ✅ |
| ES modules | ❌ | ✅ |
| Async/await | Limited | ✅ |
| LiveAPI access | ✅ Direct | Via max-api |

### Globals in js object
```javascript
post(msg);           // Console output
outlet(n, msg);      // Send to outlet n
inlet;               // Current inlet number
messagename;         // Name of incoming message
```

---

## LiveAPI (from js object)

### Constructor Patterns
```javascript
// By path
var api = new LiveAPI('live_set');
var track = new LiveAPI('live_set tracks 0');
var clip = new LiveAPI('live_set tracks 0 clip_slots 0 clip');

// By id
var obj = new LiveAPI(null);
obj.id = someId;

// With callback
var api = new LiveAPI(callback, 'live_set');
```

### Common Properties
```javascript
api.path    // Current path string
api.id      // Object ID (integer)
api.type    // Object type string
api.info    // Full object info
api.children // Child paths array
```

### Common Methods
```javascript
api.get('property_name')     // Get property
api.set('property_name', v)  // Set property
api.call('method_name', ...) // Call method
api.goto('child_name')       // Navigate
```

---

## Clip Note Access

### Get Notes (Extended)
```javascript
var clip = new LiveAPI('live_set tracks 0 clip_slots 0 clip');

// get_notes_extended(start_time, time_range, start_pitch, pitch_range)
var notes = clip.call('get_notes_extended', 0, 128, 0, 128);
// Returns: {notes: [{pitch, start_time, duration, velocity, mute}, ...]}
```

### Set Notes
```javascript
// Replace all notes
clip.call('replace_selected_notes');
clip.call('notes', noteCount);
for (var i = 0; i < noteCount; i++) {
  clip.call('note', pitch, start_time, duration, velocity, mute);
}
clip.call('done');

// Or use set_notes_extended (newer)
clip.call('set_notes_extended', notesDict);
```

### Note Structure
```javascript
{
  pitch: 60,          // MIDI note (0-127)
  start_time: 0.0,    // Beats from clip start
  duration: 0.25,     // Length in beats
  velocity: 100,      // 1-127
  mute: false         // Boolean
}
```

---

## Common M4L Patterns

### Clip Duplication
```javascript
var slot = new LiveAPI('live_set tracks 0 clip_slots 0');
slot.call('duplicate_clip_to', targetSlotId);
```

### Get Selected Clip
```javascript
var view = new LiveAPI('live_set view');
var clipId = view.get('detail_clip');
var clip = new LiveAPI(null);
clip.id = clipId;
```

### Track/Clip Iteration
```javascript
var set = new LiveAPI('live_set');
var trackCount = set.get('tracks').length / 2; // IDs are pairs
for (var i = 0; i < trackCount; i++) {
  var track = new LiveAPI('live_set tracks ' + i);
  // ...
}
```

---

## Error Response Protocol

### Message Format
```javascript
// Error response from node.script
{
  id: 'req-xxx',
  success: false,
  error: {
    code: 'ERROR_CODE',      // SCREAMING_SNAKE_CASE
    message: 'Description',   // Human-readable
    suggestion: 'Fix hint'    // User action
  }
}
```

### System Error Codes
| Code | Meaning | Suggestion |
|------|---------|------------|
| `UNKNOWN_COMMAND` | Command not recognized | Check spelling |
| `INVALID_PARAMS` | Missing/bad parameters | Verify request format |
| `INTERNAL_ERROR` | Unexpected exception | Check console |

### Logging Pattern
```javascript
const LOG_PREFIX = '[GrooveAgent]';

function log(level, context, message, data = null) {
  const logMessage = `${LOG_PREFIX} [${level}] ${context}: ${message}`;
  console[level.toLowerCase()](logMessage, data || '');
  maxApi.post(logMessage);  // Also to Max console
}
```

---

## Gotchas & Tips

1. **LiveAPI returns**: Arrays of ID pairs `[id, id]`, divide length by 2
2. **Clip must exist**: Check `clip.id != 0` before operations
3. **js vs node.script**: Use node.script for npm packages, js for LiveAPI
4. **Callback timing**: LiveAPI callbacks are async, use deferlow if needed
5. **Note precision**: Beats can be float (0.125 = 32nd note)
6. **Error responses**: Always include `code`, `message`, `suggestion`

---

_TELIS Tier 2 Shard | ~500 tokens | Last updated: 2025-11-28_

