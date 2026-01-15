/**
 * useCollaboration Hook
 * Main hook for real-time collaboration functionality
 */

import { useState, useEffect, useCallback, useRef } from "react";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { Awareness } from "y-protocols/awareness";
import type {
  CollaborationConfig,
  CollaborationState,
  CollaboratorInfo,
  BlockLock,
  AwarenessState,
} from "./types";
import { getUserColor, DEFAULT_COLLAB_CONFIG } from "./types";

export interface UseCollaborationReturn {
  ydoc: Y.Doc | null;
  provider: WebsocketProvider | null;
  awareness: Awareness | null;
  state: CollaborationState;
  connect: () => void;
  disconnect: () => void;
  lockBlock: (blockId: string) => boolean;
  unlockBlock: (blockId: string) => void;
  updateCursor: (x: number, y: number) => void;
  setSelectedBlock: (blockId: string | null) => void;
  setEditingBlock: (blockId: string | null) => void;
  isBlockLocked: (blockId: string) => boolean;
  getBlockLock: (blockId: string) => BlockLock | undefined;
}

const initialState: CollaborationState = {
  isConnected: false,
  isConnecting: false,
  connectionError: null,
  collaborators: [],
  blockLocks: new Map(),
  localUser: null,
};

export function useCollaboration(
  config: CollaborationConfig | null,
): UseCollaborationReturn {
  const [state, setState] = useState<CollaborationState>(initialState);
  const [ydoc, setYdoc] = useState<Y.Doc | null>(null);
  const [provider, setProvider] = useState<WebsocketProvider | null>(null);
  const [awareness, setAwareness] = useState<Awareness | null>(null);
  const ydocRef = useRef<Y.Doc | null>(null);
  const providerRef = useRef<WebsocketProvider | null>(null);
  const awarenessRef = useRef<Awareness | null>(null);
  const lockTimeoutRef = useRef<number>(
    config?.lockTimeout || DEFAULT_COLLAB_CONFIG.lockTimeout!,
  );
  const renewIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Refs to avoid infinite loops in callbacks that depend on frequently changing state
  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  // Renew locks (update lastActivity) - defined before connect() which uses it
  const renewLocks = useCallback((awareness: Awareness) => {
    const localState = awareness.getLocalState() as AwarenessState | null;
    if (
      localState &&
      localState.lockedBlocks &&
      localState.lockedBlocks.length > 0
    ) {
      awareness.setLocalStateField("lastActivity", Date.now());
    }
  }, []);

  // Update collaborators from awareness - defined before connect() which uses it
  const updateCollaboratorsFromAwareness = useCallback(
    (awareness: Awareness, localUserId: string) => {
      const collaborators: CollaboratorInfo[] = [];
      const blockLocks = new Map<string, BlockLock>();

      awareness.getStates().forEach((rawState, clientId: number) => {
        const state = rawState as AwarenessState;
        if (!state.user) return;

        // Add to collaborators (excluding self)
        if (state.user.id !== localUserId) {
          collaborators.push({
            clientId,
            odId: state.user.id,
            name: state.user.name,
            avatar: state.user.avatar,
            color: state.user.color,
            cursor: state.cursor,
            selectedBlockId: state.selectedBlockId,
            editingBlockId: state.editingBlockId,
            lastActivity: state.lastActivity,
          });
        }

        // Collect block locks
        if (state.lockedBlocks && state.lockedBlocks.length > 0) {
          for (const blockId of state.lockedBlocks) {
            blockLocks.set(blockId, {
              blockId,
              lockedBy: state.user.id,
              lockedByName: state.user.name,
              lockedByColor: state.user.color,
              lockedAt: state.lastActivity,
              expiresAt: state.lastActivity + lockTimeoutRef.current,
            });
          }
        }
      });

      setState((prev) => ({
        ...prev,
        collaborators,
        blockLocks,
      }));
    },
    [],
  );

  // Initialize connection
  const connect = useCallback(() => {
    if (!config || providerRef.current) return;

    setState((prev) => ({
      ...prev,
      isConnecting: true,
      connectionError: null,
    }));

    // Create Yjs document
    const newYdoc = new Y.Doc();
    ydocRef.current = newYdoc;
    setYdoc(newYdoc);

    // Create WebSocket provider
    const newProvider = new WebsocketProvider(
      config.wsUrl,
      config.roomId,
      newYdoc,
      {
        connect: true,
      },
    );
    providerRef.current = newProvider;
    setProvider(newProvider);

    // Get awareness
    const newAwareness = newProvider.awareness;
    awarenessRef.current = newAwareness;
    setAwareness(newAwareness);

    // Set local user state
    const userColor = getUserColor(config.user.id);
    const localAwareness: AwarenessState = {
      user: {
        id: config.user.id,
        name: config.user.name,
        avatar: config.user.avatar,
        color: userColor,
      },
      selectedBlockId: null,
      editingBlockId: null,
      lockedBlocks: [],
      lastActivity: Date.now(),
    };

    newAwareness.setLocalState(localAwareness);

    // Update local user in state
    setState((prev) => ({
      ...prev,
      localUser: {
        clientId: newAwareness.clientID,
        odId: config.user.id,
        name: config.user.name,
        avatar: config.user.avatar,
        color: userColor,
        selectedBlockId: null,
        editingBlockId: null,
        lastActivity: Date.now(),
      },
    }));

    // Handle connection status
    newProvider.on("status", ({ status }: { status: string }) => {
      setState((prev) => ({
        ...prev,
        isConnected: status === "connected",
        isConnecting: status === "connecting",
      }));
    });

    // Handle connection error
    newProvider.on("connection-error", (event: Event) => {
      setState((prev) => ({
        ...prev,
        connectionError: "Connection failed",
        isConnecting: false,
      }));
    });

    // Handle awareness updates
    newAwareness.on("change", () => {
      updateCollaboratorsFromAwareness(newAwareness, config.user.id);
    });

    // Initial collaborator sync
    updateCollaboratorsFromAwareness(newAwareness, config.user.id);

    // Setup lock renewal interval
    renewIntervalRef.current = setInterval(() => {
      renewLocks(newAwareness);
    }, config.lockRenewInterval || DEFAULT_COLLAB_CONFIG.lockRenewInterval!);
  }, [config, updateCollaboratorsFromAwareness, renewLocks]);

  // Disconnect
  const disconnect = useCallback(() => {
    if (renewIntervalRef.current) {
      clearInterval(renewIntervalRef.current);
      renewIntervalRef.current = null;
    }

    if (providerRef.current) {
      providerRef.current.destroy();
      providerRef.current = null;
    }

    if (ydocRef.current) {
      ydocRef.current.destroy();
      ydocRef.current = null;
    }

    awarenessRef.current = null;
    setYdoc(null);
    setProvider(null);
    setAwareness(null);
    setState(initialState);
  }, []);

  // Lock a block
  const lockBlock = useCallback((blockId: string): boolean => {
    const awareness = awarenessRef.current;
    const currentState = stateRef.current;
    if (!awareness || !currentState.isConnected) return true; // Allow in offline mode

    // Check if already locked by someone else
    const existingLock = currentState.blockLocks.get(blockId);
    if (
      existingLock &&
      existingLock.lockedBy !== currentState.localUser?.odId
    ) {
      // Check if lock is expired
      if (Date.now() < existingLock.expiresAt) {
        return false; // Block is locked
      }
    }

    // Acquire lock
    const localState = awareness.getLocalState() as AwarenessState | null;
    const currentLocks = localState?.lockedBlocks || [];

    if (!currentLocks.includes(blockId)) {
      awareness.setLocalStateField("lockedBlocks", [...currentLocks, blockId]);
      awareness.setLocalStateField("editingBlockId", blockId);
      awareness.setLocalStateField("lastActivity", Date.now());
    }

    return true;
  }, []);

  // Unlock a block
  const unlockBlock = useCallback((blockId: string) => {
    const awareness = awarenessRef.current;
    if (!awareness) return;

    const localState = awareness.getLocalState() as AwarenessState | null;
    const currentLocks = localState?.lockedBlocks || [];

    awareness.setLocalStateField(
      "lockedBlocks",
      currentLocks.filter((id: string) => id !== blockId),
    );

    if (localState?.editingBlockId === blockId) {
      awareness.setLocalStateField("editingBlockId", null);
    }
  }, []);

  // Update cursor position
  const updateCursor = useCallback((x: number, y: number) => {
    const awareness = awarenessRef.current;
    if (!awareness) return;

    awareness.setLocalStateField("cursor", { x, y });
    awareness.setLocalStateField("lastActivity", Date.now());
  }, []);

  // Set selected block
  const setSelectedBlock = useCallback((blockId: string | null) => {
    const awareness = awarenessRef.current;
    if (!awareness) return;

    awareness.setLocalStateField("selectedBlockId", blockId);
    awareness.setLocalStateField("lastActivity", Date.now());
  }, []);

  // Set editing block
  const setEditingBlock = useCallback((blockId: string | null) => {
    const awareness = awarenessRef.current;
    if (!awareness) return;

    awareness.setLocalStateField("editingBlockId", blockId);
    awareness.setLocalStateField("lastActivity", Date.now());
  }, []);

  // Check if block is locked
  const isBlockLocked = useCallback((blockId: string): boolean => {
    const currentState = stateRef.current;
    if (!currentState.isConnected) return false; // No locks in offline mode

    const lock = currentState.blockLocks.get(blockId);
    if (!lock) return false;

    // Check if it's our lock
    if (lock.lockedBy === currentState.localUser?.odId) return false;

    // Check if lock is expired
    if (Date.now() >= lock.expiresAt) return false;

    return true;
  }, []);

  // Get block lock info
  const getBlockLock = useCallback((blockId: string): BlockLock | undefined => {
    return stateRef.current.blockLocks.get(blockId);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  // Auto-connect when config is provided
  useEffect(() => {
    if (config && !providerRef.current) {
      connect();
    }
  }, [config, connect]);

  return {
    ydoc,
    provider,
    awareness,
    state,
    connect,
    disconnect,
    lockBlock,
    unlockBlock,
    updateCursor,
    setSelectedBlock,
    setEditingBlock,
    isBlockLocked,
    getBlockLock,
  };
}
