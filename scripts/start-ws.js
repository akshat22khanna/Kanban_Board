// Start script for the WebSocket server (works cross-platform)
// It sets a default WS_PORT if not already defined.

process.env.WS_PORT = process.env.WS_PORT || '3501';
require('../server/ws-server');
