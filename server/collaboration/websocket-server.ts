/**
 * Collaboration WebSocket Server
 * Handles Yjs document synchronization and awareness
 */

import { WebSocketServer, WebSocket } from 'ws';
import * as Y from 'yjs';
import * as syncProtocol from 'y-protocols/sync';
import * as awarenessProtocol from 'y-protocols/awareness';
import * as encoding from 'lib0/encoding';
import * as decoding from 'lib0/decoding';
import { getOrCreateDoc, removeDoc } from './persistence';

// Message types
const messageSync = 0;
const messageAwareness = 1;

// Track connections per room
const rooms = new Map<string, Set<WebSocket>>();
const awarenessMap = new Map<string, awarenessProtocol.Awareness>();

interface WSConnection extends WebSocket {
  roomId?: string;
  isAlive?: boolean;
}

/**
 * Setup WebSocket connection for a room
 */
async function setupConnection(
  ws: WSConnection,
  roomId: string,
): Promise<void> {
  ws.roomId = roomId;
  ws.isAlive = true;

  // Get or create room set
  if (!rooms.has(roomId)) {
    rooms.set(roomId, new Set());
  }
  rooms.get(roomId)!.add(ws);

  // Get or create document
  const doc = await getOrCreateDoc(roomId);

  // Get or create awareness
  if (!awarenessMap.has(roomId)) {
    const awareness = new awarenessProtocol.Awareness(doc);
    awarenessMap.set(roomId, awareness);

    // Broadcast awareness updates
    awareness.on('update', ({ added, updated, removed }: {
      added: number[];
      updated: number[];
      removed: number[];
    }) => {
      const changedClients = added.concat(updated, removed);
      const encoder = encoding.createEncoder();
      encoding.writeVarUint(encoder, messageAwareness);
      encoding.writeVarUint8Array(
        encoder,
        awarenessProtocol.encodeAwarenessUpdate(awareness, changedClients),
      );
      const message = encoding.toUint8Array(encoder);
      broadcastToRoom(roomId, message, ws);
    });
  }

  const awareness = awarenessMap.get(roomId)!;

  // Send initial sync
  const encoder = encoding.createEncoder();
  encoding.writeVarUint(encoder, messageSync);
  syncProtocol.writeSyncStep1(encoder, doc);
  ws.send(encoding.toUint8Array(encoder));

  // Send current awareness states
  const awarenessStates = awareness.getStates();
  if (awarenessStates.size > 0) {
    const encoder2 = encoding.createEncoder();
    encoding.writeVarUint(encoder2, messageAwareness);
    encoding.writeVarUint8Array(
      encoder2,
      awarenessProtocol.encodeAwarenessUpdate(
        awareness,
        Array.from(awarenessStates.keys()),
      ),
    );
    ws.send(encoding.toUint8Array(encoder2));
  }

  // Handle messages
  ws.on('message', (data: Buffer) => {
    try {
      const message = new Uint8Array(data);
      const decoder = decoding.createDecoder(message);
      const messageType = decoding.readVarUint(decoder);

      switch (messageType) {
        case messageSync:
          handleSyncMessage(ws, doc, decoder);
          break;
        case messageAwareness:
          handleAwarenessMessage(ws, awareness, decoder);
          break;
      }
    } catch (err) {
      console.error('Error handling message:', err);
    }
  });

  // Handle pong
  ws.on('pong', () => {
    ws.isAlive = true;
  });

  // Handle close
  ws.on('close', () => {
    handleDisconnect(ws, roomId, awareness);
  });

  console.log(`Client connected to room: ${roomId}`);
}

/**
 * Handle sync protocol messages
 */
function handleSyncMessage(
  ws: WSConnection,
  doc: Y.Doc,
  decoder: decoding.Decoder,
): void {
  const encoder = encoding.createEncoder();
  encoding.writeVarUint(encoder, messageSync);
  const syncMessageType = syncProtocol.readSyncMessage(decoder, encoder, doc, ws);

  // If there's a response, send it
  if (encoding.length(encoder) > 1) {
    ws.send(encoding.toUint8Array(encoder));
  }

  // Broadcast updates to other clients
  if (syncMessageType === syncProtocol.messageYjsUpdate) {
    const roomId = ws.roomId;
    if (roomId) {
      // Re-encode the update for broadcast
      const updateEncoder = encoding.createEncoder();
      encoding.writeVarUint(updateEncoder, messageSync);
      // Read the update from the original message
      const update = decoding.readVarUint8Array(decoder);
      syncProtocol.writeUpdate(updateEncoder, update);
      broadcastToRoom(roomId, encoding.toUint8Array(updateEncoder), ws);
    }
  }
}

/**
 * Handle awareness protocol messages
 */
function handleAwarenessMessage(
  ws: WSConnection,
  awareness: awarenessProtocol.Awareness,
  decoder: decoding.Decoder,
): void {
  awarenessProtocol.applyAwarenessUpdate(
    awareness,
    decoding.readVarUint8Array(decoder),
    ws,
  );
}

/**
 * Handle client disconnect
 */
function handleDisconnect(
  ws: WSConnection,
  roomId: string,
  awareness: awarenessProtocol.Awareness,
): void {
  // Remove from room
  const room = rooms.get(roomId);
  if (room) {
    room.delete(ws);

    // Clean up awareness
    awarenessProtocol.removeAwarenessStates(
      awareness,
      [awareness.clientID],
      null,
    );

    // If room is empty, clean up
    if (room.size === 0) {
      rooms.delete(roomId);
      awarenessMap.delete(roomId);
      removeDoc(roomId);
    }
  }

  console.log(`Client disconnected from room: ${roomId}`);
}

/**
 * Broadcast message to all clients in a room except sender
 */
function broadcastToRoom(
  roomId: string,
  message: Uint8Array,
  exclude?: WebSocket,
): void {
  const room = rooms.get(roomId);
  if (room) {
    room.forEach((client) => {
      if (client !== exclude && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }
}

/**
 * Create and start the collaboration server
 */
export function createCollaborationServer(port: number): WebSocketServer {
  const wss = new WebSocketServer({ port });

  console.log(`Collaboration server starting on port ${port}`);

  wss.on('connection', async (ws: WSConnection, req) => {
    // Extract room ID from URL
    const url = new URL(req.url || '', `http://localhost:${port}`);
    const roomId = url.searchParams.get('room');

    if (!roomId) {
      ws.close(4002, 'Missing room parameter');
      return;
    }

    // Optional: Add authentication here
    // const token = url.searchParams.get('token');
    // if (!verifyToken(token)) {
    //   ws.close(4001, 'Unauthorized');
    //   return;
    // }

    await setupConnection(ws, roomId);
  });

  // Heartbeat to detect dead connections
  const interval = setInterval(() => {
    wss.clients.forEach((ws: WSConnection) => {
      if (ws.isAlive === false) {
        return ws.terminate();
      }
      ws.isAlive = false;
      ws.ping();
    });
  }, 30000);

  wss.on('close', () => {
    clearInterval(interval);
  });

  return wss;
}

/**
 * Get server stats
 */
export function getServerStats(): {
  rooms: number;
  connections: number;
  roomDetails: { roomId: string; clients: number }[];
} {
  const roomDetails = Array.from(rooms.entries()).map(([roomId, clients]) => ({
    roomId,
    clients: clients.size,
  }));

  return {
    rooms: rooms.size,
    connections: Array.from(rooms.values()).reduce(
      (sum, clients) => sum + clients.size,
      0,
    ),
    roomDetails,
  };
}

// Start standalone server if run directly
if (require.main === module) {
  const port = parseInt(process.env.COLLAB_PORT || '1234', 10);
  createCollaborationServer(port);
  console.log(`Collaboration server running on ws://localhost:${port}`);
}
