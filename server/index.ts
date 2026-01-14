/**
 * Custom Next.js Server with WebSocket Support
 * Integrates collaboration WebSocket server with Next.js
 */

import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { WebSocketServer } from 'ws';
import * as Y from 'yjs';
import * as syncProtocol from 'y-protocols/sync';
import * as awarenessProtocol from 'y-protocols/awareness';
import * as encoding from 'lib0/encoding';
import * as decoding from 'lib0/decoding';
import { getOrCreateDoc, removeDoc, getActiveRooms } from './collaboration/persistence';

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = parseInt(process.env.PORT || '3000', 10);

// Message types
const messageSync = 0;
const messageAwareness = 1;

// Track connections per room
const rooms = new Map<string, Set<WebSocket>>();
const awarenessMap = new Map<string, awarenessProtocol.Awareness>();

async function main() {
  const app = next({ dev, hostname, port });
  const handle = app.getRequestHandler();

  await app.prepare();

  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url!, true);
    handle(req, res, parsedUrl);
  });

  // Create WebSocket server on /collaboration path
  const wss = new WebSocketServer({ noServer: true });

  server.on('upgrade', (request, socket, head) => {
    const { pathname, searchParams } = new URL(
      request.url!,
      `http://${request.headers.host}`,
    );

    if (pathname === '/collaboration') {
      const roomId = searchParams.get('room');

      if (!roomId) {
        socket.write('HTTP/1.1 400 Bad Request\r\n\r\n');
        socket.destroy();
        return;
      }

      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request, roomId);
      });
    } else {
      socket.destroy();
    }
  });

  // Handle WebSocket connections
  wss.on('connection', async (ws: any, request: any, roomId: string) => {
    ws.roomId = roomId;
    ws.isAlive = true;

    // Get or create room
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

      awareness.on('update', ({ added, updated, removed }: any) => {
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

    // Send current awareness
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

        if (messageType === messageSync) {
          const syncEncoder = encoding.createEncoder();
          encoding.writeVarUint(syncEncoder, messageSync);
          syncProtocol.readSyncMessage(decoder, syncEncoder, doc, ws);

          if (encoding.length(syncEncoder) > 1) {
            ws.send(encoding.toUint8Array(syncEncoder));
          }
        } else if (messageType === messageAwareness) {
          awarenessProtocol.applyAwarenessUpdate(
            awareness,
            decoding.readVarUint8Array(decoder),
            ws,
          );
        }
      } catch (err) {
        console.error('WebSocket message error:', err);
      }
    });

    ws.on('pong', () => {
      ws.isAlive = true;
    });

    ws.on('close', () => {
      const room = rooms.get(roomId);
      if (room) {
        room.delete(ws);

        awarenessProtocol.removeAwarenessStates(
          awareness,
          [awareness.clientID],
          null,
        );

        if (room.size === 0) {
          rooms.delete(roomId);
          awarenessMap.delete(roomId);
          removeDoc(roomId);
        }
      }

      console.log(`Client disconnected from: ${roomId}`);
    });

    console.log(`Client connected to: ${roomId}`);
  });

  // Broadcast helper
  function broadcastToRoom(
    roomId: string,
    message: Uint8Array,
    exclude?: WebSocket,
  ): void {
    const room = rooms.get(roomId);
    if (room) {
      room.forEach((client: any) => {
        if (client !== exclude && client.readyState === 1) {
          client.send(message);
        }
      });
    }
  }

  // Heartbeat
  setInterval(() => {
    wss.clients.forEach((ws: any) => {
      if (ws.isAlive === false) return ws.terminate();
      ws.isAlive = false;
      ws.ping();
    });
  }, 30000);

  server.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
    console.log(`> WebSocket collaboration on ws://${hostname}:${port}/collaboration`);
  });
}

main().catch((err) => {
  console.error('Server error:', err);
  process.exit(1);
});
