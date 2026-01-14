/**
 * History Item
 * Individual commit in the timeline
 */

import React, { useState } from 'react';
import classNames from 'classnames';
import { useIntl } from 'react-intl';
import {
  EyeIcon,
  ArrowUturnLeftIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import type { GitCommit } from '../../types/history';

interface HistoryItemProps {
  commit: GitCommit;
  isSelected: boolean;
  isFirst: boolean;
  isLoading: boolean;
  onPreview: () => void;
  onRestore: () => void;
}

const HistoryItem: React.FC<HistoryItemProps> = ({
  commit,
  isSelected,
  isFirst,
  isLoading,
  onPreview,
  onRestore,
}) => {
  const { formatMessage } = useIntl();
  const [isExpanded, setIsExpanded] = useState(false);

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div
      className={classNames(
        'relative pl-10 pr-3 py-3 transition-colors',
        isSelected
          ? 'bg-blue-50 dark:bg-blue-900/20'
          : 'hover:bg-slate-50 dark:hover:bg-slate-800/50',
      )}
    >
      {/* Timeline dot */}
      <div
        className={classNames(
          'absolute left-4 top-4 w-4 h-4 rounded-full border-2 bg-white dark:bg-slate-900',
          isFirst
            ? 'border-green-500 ring-2 ring-green-200 dark:ring-green-900'
            : isSelected
              ? 'border-blue-500'
              : 'border-slate-300 dark:border-slate-600',
        )}
      />

      {/* Content */}
      <div className="min-w-0">
        {/* Header row */}
        <div className="flex items-center justify-between gap-2 mb-1">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 text-left min-w-0 flex-1"
          >
            {isExpanded ? (
              <ChevronDownIcon className="w-3 h-3 text-slate-400 flex-shrink-0" />
            ) : (
              <ChevronRightIcon className="w-3 h-3 text-slate-400 flex-shrink-0" />
            )}
            <span className="text-sm font-medium text-slate-900 dark:text-white truncate">
              {commit.message ||
                formatMessage({
                  id: 'pb_history_no_message',
                  defaultMessage: 'No message',
                })}
            </span>
          </button>
          <span className="text-xs text-slate-500 dark:text-slate-400 flex-shrink-0">
            {formatTime(commit.date)}
          </span>
        </div>

        {/* Author and hash */}
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <UserCircleIcon className="w-3.5 h-3.5" />
          <span className="truncate">{commit.author}</span>
          <span className="text-slate-300 dark:text-slate-600">|</span>
          <code className="text-slate-400 dark:text-slate-500">
            {commit.shortHash}
          </code>
        </div>

        {/* Expanded details and actions */}
        {isExpanded && (
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700">
            {/* Full message if truncated */}
            {commit.message && commit.message.length > 40 && (
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 whitespace-pre-wrap">
                {commit.message}
              </p>
            )}

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={onPreview}
                disabled={isLoading}
                className={classNames(
                  'flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors',
                  isSelected
                    ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600',
                )}
              >
                {isLoading ? (
                  <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <EyeIcon className="w-3.5 h-3.5" />
                )}
                {formatMessage({
                  id: 'pb_history_preview',
                  defaultMessage: 'Preview',
                })}
              </button>

              <button
                onClick={onRestore}
                disabled={isFirst}
                className={classNames(
                  'flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors',
                  isFirst
                    ? 'bg-slate-50 dark:bg-slate-800 text-slate-300 dark:text-slate-600 cursor-not-allowed'
                    : 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 hover:bg-amber-200 dark:hover:bg-amber-900/60',
                )}
                title={
                  isFirst
                    ? formatMessage({
                        id: 'pb_history_current_version',
                        defaultMessage: 'This is the current version',
                      })
                    : formatMessage({
                        id: 'pb_history_restore_tooltip',
                        defaultMessage: 'Restore this version',
                      })
                }
              >
                <ArrowUturnLeftIcon className="w-3.5 h-3.5" />
                {formatMessage({
                  id: 'pb_history_restore',
                  defaultMessage: 'Restore',
                })}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryItem;
