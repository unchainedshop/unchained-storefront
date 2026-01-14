/**
 * Connection Status Component
 * Shows collaboration connection state
 */

import React from 'react';
import { useIntl } from 'react-intl';
import { useCollaborationContext } from '../../collaboration/CollaborationContext';

interface ConnectionStatusProps {
  showLabel?: boolean;
  className?: string;
}

const ConnectionStatus: React.FC<ConnectionStatusProps> = ({
  showLabel = true,
  className = '',
}) => {
  const { formatMessage } = useIntl();
  const { state, connect } = useCollaborationContext();
  const { isConnected, isConnecting, connectionError } = state;

  const getStatusConfig = () => {
    if (isConnecting) {
      return {
        color: 'bg-amber-500',
        label: formatMessage({ id: 'pb_collaboration_connecting', defaultMessage: 'Connecting...' }),
        animate: true,
      };
    }

    if (connectionError) {
      return {
        color: 'bg-red-500',
        label: formatMessage({ id: 'pb_collaboration_offline', defaultMessage: 'Offline mode' }),
        animate: false,
        error: connectionError,
      };
    }

    if (isConnected) {
      return {
        color: 'bg-green-500',
        label: formatMessage({ id: 'pb_collaboration_connected', defaultMessage: 'Connected' }),
        animate: false,
      };
    }

    return {
      color: 'bg-gray-400',
      label: formatMessage({ id: 'pb_collaboration_disconnected', defaultMessage: 'Disconnected' }),
      animate: false,
    };
  };

  const config = getStatusConfig();

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative flex items-center">
        <span
          className={`w-2.5 h-2.5 rounded-full ${config.color} ${
            config.animate ? 'animate-pulse' : ''
          }`}
        />
        {config.animate && (
          <span
            className={`absolute w-2.5 h-2.5 rounded-full ${config.color} animate-ping`}
          />
        )}
      </div>

      {showLabel && (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {config.label}
        </span>
      )}

      {connectionError && (
        <button
          onClick={connect}
          className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline"
        >
          {formatMessage({ id: 'pb_collaboration_retry', defaultMessage: 'Retry' })}
        </button>
      )}
    </div>
  );
};

export default ConnectionStatus;
