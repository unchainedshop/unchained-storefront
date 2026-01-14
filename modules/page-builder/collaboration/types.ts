/**
 * Collaboration Types
 * Type definitions for real-time collaboration
 */

export interface CollaboratorInfo {
  clientId: number;
  odId: string;
  name: string;
  avatar?: string;
  color: string;
  cursor?: { x: number; y: number };
  selectedBlockId: string | null;
  editingBlockId: string | null;
  lastActivity: number;
}

export interface BlockLock {
  blockId: string;
  lockedBy: string; // odId
  lockedByName: string; // display name
  lockedByColor: string; // user color
  lockedAt: number; // timestamp
  expiresAt: number; // auto-unlock timestamp
}

export interface CollaborationState {
  isConnected: boolean;
  isConnecting: boolean;
  connectionError: string | null;
  collaborators: CollaboratorInfo[];
  blockLocks: Map<string, BlockLock>;
  localUser: CollaboratorInfo | null;
}

export interface CollaborationConfig {
  wsUrl: string;
  roomId: string; // page slug
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
  lockTimeout: number; // ms before lock auto-expires (e.g., 30000)
  lockRenewInterval: number; // ms between lock renewals (e.g., 10000)
}

export interface AwarenessState {
  user: {
    id: string;
    name: string;
    avatar?: string;
    color: string;
  };
  cursor?: { x: number; y: number };
  selectedBlockId: string | null;
  editingBlockId: string | null;
  lockedBlocks: string[];
  lastActivity: number;
}

// Default collaboration config
export const DEFAULT_COLLAB_CONFIG: Partial<CollaborationConfig> = {
  lockTimeout: 30000, // 30 seconds
  lockRenewInterval: 10000, // 10 seconds
};

// Generate a consistent color from user ID
export function getUserColor(userId: string): string {
  const colors = [
    '#ef4444', // red
    '#f97316', // orange
    '#eab308', // yellow
    '#22c55e', // green
    '#14b8a6', // teal
    '#3b82f6', // blue
    '#8b5cf6', // violet
    '#ec4899', // pink
  ];

  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = userId.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}
