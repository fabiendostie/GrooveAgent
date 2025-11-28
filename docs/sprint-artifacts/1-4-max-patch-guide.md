# Max for Live Device Creation Guide: GrooveAgent

**Story:** 1-4-basic-max-for-live-device-shell  
**Created:** 2025-11-27  
**Purpose:** Step-by-step guide for creating the GrooveAgent Max for Live MIDI Effect

---

## Prerequisites

- Ableton Live 12+ installed and running
- Max for Live 8.6+ (bundled with Live Suite or purchased separately)
- Node.js dependencies installed: `cd src/node && npm install`
- `src/node/index.js` exists and has ping command handler (Story 1-3 complete)

---

## Step-by-Step Creation Guide

### Step 1: Create New Max for Live MIDI Effect

1. **Open Max/MSP** (standalone or from Ableton Live)
2. **File → New → Max for Live → MIDI Effect**
   - This creates a new MIDI Effect device template
3. **Save immediately** as `src/max/GrooveAgent.amxd`
   - Use the project's `src/max/` directory
   - Filename: `GrooveAgent.amxd`

### Step 2: Add node.script Object

1. **Lock the patch** (Cmd+E / Ctrl+E to toggle edit mode)
2. **Press 'N' to create new object**
3. **Type:** `node.script ../node/index.js @autostart 1`
4. **Place** in the center of the patch

**Configuration:**
```
Object: node.script
Attributes:
  @file ../node/index.js    (relative path to Node.js entry point)
  @autostart 1              (auto-start Node.js when device loads)
```

**Expected Outlets:**
- **First outlet (left):** JSON responses from Node.js
- **Additional outlets:** Configurable for other data types

### Step 3: Add Test Button (live.text)

1. **Press 'N' for new object**
2. **Type:** `live.text`
3. **Configure attributes** (in Inspector or object itself):

```
Object: live.text
Attributes:
  @mode 1                   (button mode - momentary click)
  @text "Ping Test"         (button label)
  @texton "Ping Test"       (text when pressed)
```

**Positioning:** Place above and to the left of node.script

### Step 4: Create JSON Message

1. **Press 'M' for message object**
2. **Type the JSON command:**
```json
{"cmd": "ping", "id": "test-1"}
```

**Positioning:** Between live.text button and prepend object

### Step 5: Add Message Routing

1. **Add `prepend cmd` object:**
   - Press 'N', type: `prepend cmd`
   - This formats the message for the node.script handler

2. **Add `route success error` object:**
   - Press 'N', type: `route success error`
   - Connects to node.script outlet
   - Routes responses by success/error status

3. **Add `print GrooveAgent` object:**
   - Press 'N', type: `print GrooveAgent`
   - Displays messages in Max console

### Step 6: Connect Objects

Create patch cords (cables) in this order:

1. **live.text outlet → message inlet** (triggers the JSON message on click)
2. **message outlet → prepend cmd inlet** (formats as "cmd {...}")
3. **prepend outlet → node.script inlet** (sends command to Node.js)
4. **node.script first outlet → route inlet** (receives JSON response)
5. **route first outlet (success) → print inlet** (logs successful responses)
6. **route second outlet (error) → print inlet** (logs errors)

### Step 7: MIDI Pass-Through (Required for MIDI Effects)

For a MIDI Effect, you need basic MIDI routing:

1. **Add `midiin` object** - Press 'N', type: `midiin`
2. **Add `midiout` object** - Press 'N', type: `midiout`
3. **Connect:** `midiin outlet → midiout inlet`

This ensures MIDI passes through the device even when not transforming notes.

**Positioning:** 
- `midiin` at top-left of patch
- `midiout` at bottom-left of patch

---

## Visual Layout Reference

```
┌────────────────────────────────────────────────────────────────────┐
│                        GrooveAgent.amxd                            │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  [midiin]                    [live.text "Ping Test"]               │
│      │                              │                              │
│      │                              ▼                              │
│      │                    [{"cmd":"ping","id":"test-1"}]           │
│      │                              │                              │
│      │                              ▼                              │
│      │                        [prepend cmd]                        │
│      │                              │                              │
│      │                              ▼                              │
│      │            [node.script ../node/index.js @autostart 1]      │
│      │                              │                              │
│      │                              ▼                              │
│      │                    [route success error]                    │
│      │                        │           │                        │
│      │                        ▼           ▼                        │
│      │                    [print GrooveAgent]                      │
│      │                                                             │
│      ▼                                                             │
│  [midiout]                                                         │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

---

## Verification Checklist

After creating the patch, verify:

### AC1: Device Loads Without Error
- [ ] Close Max editor
- [ ] Drag `GrooveAgent.amxd` onto a MIDI track in Ableton Live
- [ ] Check Max console (Window → Max Console) for errors
- [ ] No red error messages should appear

### AC2: node.script Auto-Starts
- [ ] Load fresh instance of device
- [ ] Within 2 seconds, see in Max console:
  ```
  [GrooveAgent] Ready (Node v20.x.x)
  ```

### AC3: Ping Test Button Works
- [ ] Click the "Ping Test" button
- [ ] See in Max console:
  ```
  GrooveAgent: success {"id":"test-1","success":true,"data":{"pong":true}}
  ```

### AC4: Device Saves as .amxd
- [ ] File is saved with `.amxd` extension
- [ ] File can be reopened and works correctly
- [ ] File appears in Ableton's browser under User Library (if saved there)

---

## Troubleshooting

### "node.script: can't find module"
- Check that `src/node/index.js` exists
- Verify relative path: `@file ../node/index.js`
- Ensure Node.js dependencies installed: `cd src/node && npm install`

### No "[GrooveAgent] Ready" message
- Check that `@autostart 1` is set
- Look for error messages in Max console
- Verify `max-api` is installed in src/node

### Ping button doesn't respond
- Verify patch cords are connected correctly
- Check that `prepend cmd` is between message and node.script
- Ensure JSON message format is exactly: `{"cmd": "ping", "id": "test-1"}`

### "route: doesn't understand" error
- The response from node.script may not be parsed correctly
- Add a `dict.unpack` or `js` object to parse JSON if needed
- Check that node.script is outputting valid JSON

---

## Advanced: Response Parsing

If the basic route approach doesn't work with JSON objects, use this alternative:

1. **Add `dict.unpack success: error:` object**
2. **Connect node.script outlet → dict.unpack inlet**
3. **Connect dict.unpack outlets to print**

Or use a simple JavaScript helper:
1. Add `js parse-response.js` object
2. Create `src/max/parse-response.js`:
```javascript
function anything() {
  var args = arrayfromargs(arguments);
  if (typeof args[0] === 'object') {
    outlet(0, JSON.stringify(args[0]));
  } else {
    outlet(0, args.join(' '));
  }
}
```

---

## File Reference

| File | Purpose | Location |
|------|---------|----------|
| `GrooveAgent.amxd` | Max for Live device (create this) | `src/max/` |
| `index.js` | Node.js entry point (exists) | `src/node/` |
| `logger.js` | Logging utility (exists) | `src/node/utils/` |

---

_This guide supports Story 1-4: Basic Max for Live Device Shell_
_GrooveAgent Project - BMAD Workflow_

