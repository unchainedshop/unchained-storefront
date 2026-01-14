/**
 * Presence Avatars Component
 * Shows avatars of online collaborators
 */

import React from "react";
import { useIntl } from "react-intl";
import { UserGroupIcon } from "@heroicons/react/24/outline";
import { useCollaborationContext } from "../../collaboration/CollaborationContext";
import type { CollaboratorInfo } from "../../collaboration/types";

interface PresenceAvatarsProps {
  maxVisible?: number;
  className?: string;
}

const PresenceAvatars: React.FC<PresenceAvatarsProps> = ({
  maxVisible = 5,
  className = "",
}) => {
  const { formatMessage } = useIntl();
  const { state } = useCollaborationContext();
  const { collaborators, localUser, isConnected } = state;

  // Combine local user with collaborators
  const allUsers: CollaboratorInfo[] = [];
  if (localUser) {
    allUsers.push(localUser);
  }
  allUsers.push(...collaborators);

  // Show placeholder when not connected or no users
  if (!isConnected || allUsers.length === 0) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
          <UserGroupIcon className="w-4 h-4 text-slate-400" />
        </div>
        <span className="hidden sm:block text-xs text-slate-400">
          {formatMessage({
            id: "pb_collaboration_solo",
            defaultMessage: "Solo",
          })}
        </span>
      </div>
    );
  }

  const visibleUsers = allUsers.slice(0, maxVisible);
  const hiddenCount = Math.max(0, allUsers.length - maxVisible);

  return (
    <div className={`flex items-center ${className}`}>
      <div className="flex -space-x-2">
        {visibleUsers.map((user, index) => (
          <div
            key={user.clientId}
            className="relative group"
            style={{ zIndex: visibleUsers.length - index }}
          >
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800"
                style={{ borderColor: user.color }}
              />
            ) : (
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium border-2 border-white dark:border-gray-800"
                style={{ backgroundColor: user.color }}
              >
                {getInitials(user.name)}
              </div>
            )}

            {/* Online indicator */}
            <span
              className="absolute bottom-0 right-0 block w-2.5 h-2.5 rounded-full ring-2 ring-white dark:ring-gray-800"
              style={{
                backgroundColor: user.editingBlockId ? "#f59e0b" : "#22c55e",
              }}
            />

            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              {user.name}
              {user.editingBlockId && (
                <span className="text-amber-400 ml-1">
                  (
                  {formatMessage({
                    id: "pb_collaboration_editing",
                    defaultMessage: "editing",
                  })}
                  )
                </span>
              )}
              {user.odId === localUser?.odId && (
                <span className="text-gray-400 ml-1">
                  (
                  {formatMessage({
                    id: "pb_collaboration_you",
                    defaultMessage: "you",
                  })}
                  )
                </span>
              )}
            </div>
          </div>
        ))}

        {hiddenCount > 0 && (
          <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-medium text-gray-600 dark:text-gray-300 border-2 border-white dark:border-gray-800">
            +{hiddenCount}
          </div>
        )}
      </div>

      <span className="ml-3 text-sm text-gray-500 dark:text-gray-400">
        {formatMessage(
          {
            id: "pb_collaboration_users_online",
            defaultMessage: "{count} online",
          },
          { count: allUsers.length },
        )}
      </span>
    </div>
  );
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default PresenceAvatars;
