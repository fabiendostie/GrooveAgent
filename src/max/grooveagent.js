// GrooveAgent - Node.js script for Max for Live
const max = require('max-api');

max.post('[GrooveAgent] Script loading...');

// Simple ping handler - just responds to any "ping" message
max.addHandler('ping', function () {
  max.post('[GrooveAgent] Ping received! Sending pong...');
  max.outlet('pong');
});

// Command handler for structured messages (future use)
max.addHandler('cmd', function () {
  // Get all arguments as an array
  const args = Array.prototype.slice.call(arguments);
  max.post('[GrooveAgent] CMD received: ' + JSON.stringify(args));

  // For now, just check if "ping" is anywhere in the args
  const argsStr = args.join(' ');
  if (argsStr.indexOf('ping') !== -1) {
    max.post('[GrooveAgent] Ping detected! Sending pong...');
    max.outlet({ success: true, data: { pong: true } });
  }
});

max.post('[GrooveAgent] Ready! (Node ' + process.version + ')');
