/**
 * Collaboration Context
 * React context for collaboration state
 */

import React, { createContext, useContext, useMemo } from "react";
import { useCollaboration, UseCollaborationReturn } from "./useCollaboration";
import type { CollaborationConfig } from "./types";

const CollaborationContext = createContext<UseCollaborationReturn | null>(null);

// Stable no-op implementation to avoid re-renders when collaboration is disabled
const noopBlockLocks = new Map();
const noopImplementation: UseCollaborationReturn = {
  ydoc: null,
  provider: null,
  awareness: null,
  state: {
    isConnected: false,
    isConnecting: false,
    connectionError: null,
    collaborators: [],
    blockLocks: noopBlockLocks,
    localUser: null,
  },
  connect: () => {},
  disconnect: () => {},
  lockBlock: () => true,
  unlockBlock: () => {},
  updateCursor: () => {},
  setSelectedBlock: () => {},
  setEditingBlock: () => {},
  isBlockLocked: () => false,
  getBlockLock: () => undefined,
};

interface CollaborationProviderProps {
  children: React.ReactNode;
  config: CollaborationConfig | null;
}

export const CollaborationProvider: React.FC<CollaborationProviderProps> = ({
  children,
  config,
}) => {
  const collaboration = useCollaboration(config);

  return (
    <CollaborationContext.Provider value={collaboration}>
      {children}
    </CollaborationContext.Provider>
  );
};

export function useCollaborationContext(): UseCollaborationReturn {
  const context = useContext(CollaborationContext);

  if (!context) {
    // Return stable no-op implementation when not inside provider
    return noopImplementation;
  }

  return context;
}

// Hook to check if collaboration is enabled
export function useIsCollaborationEnabled(): boolean {
  const context = useContext(CollaborationContext);
  return context !== null && context.state.isConnected;
}
