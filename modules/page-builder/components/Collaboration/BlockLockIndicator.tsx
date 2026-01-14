/**
 * Block Lock Indicator Component
 * Shows lock overlay when a block is being edited by another user
 */

import React from 'react';
import { useIntl } from 'react-intl';
import { LockClosedIcon, UserIcon } from '@heroicons/react/24/solid';
import { useCollaborationContext } from '../../collaboration/CollaborationContext';
import type { BlockLock } from '../../collaboration/types';

interface BlockLockIndicatorProps {
  blockId: string;
  className?: string;
}

const BlockLockIndicator: React.FC<BlockLockIndicatorProps> = ({
  blockId,
  className = '',
}) => {
  const { formatMessage } = useIntl();
  const { isBlockLocked, getBlockLock } = useCollaborationContext();

  if (!isBlockLocked(blockId)) return null;

  const lock = getBlockLock(blockId);
  if (!lock) return null;

  return (
    <div
      className={`absolute inset-0 pointer-events-auto z-50 ${className}`}
      style={{ backgroundColor: `${lock.lockedByColor}15` }}
    >
      {/* Border indicator */}
      <div
        className="absolute inset-0 border-2 rounded-lg"
        style={{ borderColor: lock.lockedByColor }}
      />

      {/* Lock badge */}
      <div
        className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-white text-xs font-medium shadow-lg whitespace-nowrap"
        style={{ backgroundColor: lock.lockedByColor }}
      >
        <LockClosedIcon className="w-3 h-3" />
        <span>
          {formatMessage(
            { id: 'pb_collaboration_editing_by', defaultMessage: 'Editing by {name}' },
            { name: lock.lockedByName }
          )}
        </span>
      </div>

      {/* Click blocker with message */}
      <div
        className="absolute inset-0 flex items-center justify-center cursor-not-allowed"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-white/90 dark:bg-gray-800/90 rounded-lg px-4 py-3 shadow-lg border border-gray-200 dark:border-gray-700 max-w-xs text-center">
          <div className="flex items-center justify-center mb-2">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white"
              style={{ backgroundColor: lock.lockedByColor }}
            >
              <UserIcon className="w-4 h-4" />
            </div>
          </div>
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {lock.lockedByName}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {formatMessage({
              id: 'pb_collaboration_block_locked_message',
              defaultMessage: 'is currently editing this block',
            })}
          </p>
        </div>
      </div>
    </div>
  );
};

interface BlockLockBorderProps {
  blockId: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Wrapper that adds a colored border when someone is selecting a block
 */
export const BlockSelectionBorder: React.FC<BlockLockBorderProps> = ({
  blockId,
  children,
  className = '',
}) => {
  const { state } = useCollaborationContext();
  const { collaborators } = state;

  // Find collaborator selecting this block
  const selectingUser = collaborators.find(
    (c) => c.selectedBlockId === blockId && !c.editingBlockId
  );

  if (!selectingUser) {
    return <>{children}</>;
  }

  return (
    <div className={`relative ${className}`}>
      {/* Selection border */}
      <div
        className="absolute inset-0 border-2 rounded-lg pointer-events-none z-10"
        style={{ borderColor: selectingUser.color, borderStyle: 'dashed' }}
      />

      {/* Selection badge */}
      <div
        className="absolute -top-3 left-4 flex items-center gap-1 px-2 py-0.5 rounded-full text-white text-xs font-medium z-20"
        style={{ backgroundColor: selectingUser.color }}
      >
        <span>{selectingUser.name}</span>
      </div>

      {children}
    </div>
  );
};

export default BlockLockIndicator;
