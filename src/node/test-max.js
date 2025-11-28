/**
 * Minimal test script for Max node.script debugging
 */

// Try to load max-api
try {
  const maxApi = require('max-api');

  // Post a simple message
  maxApi.post('[GrooveAgent] Test script loaded OK!');

  // Register a simple handler
  maxApi.addHandler('cmd', function (msg) {
    maxApi.post('[GrooveAgent] Received: ' + JSON.stringify(msg));
    maxApi.outlet({ success: true, message: 'pong' });
  });

  maxApi.post('[GrooveAgent] Handler registered. Ready!');
} catch (err) {
  console.log('[GrooveAgent] ERROR loading max-api: ' + err.message);
  console.log('[GrooveAgent] Stack: ' + err.stack);
}
