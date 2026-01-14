/**
 * History Timeline
 * Displays commits in a vertical timeline format
 */

import React from 'react';
import { useIntl } from 'react-intl';
import HistoryItem from './HistoryItem';
import type { GitCommit } from '../../types/history';

interface HistoryTimelineProps {
  commits: GitCommit[];
  selectedCommit: GitCommit | null;
  onPreview: (commit: GitCommit) => void;
  onRestore: (commit: GitCommit) => void;
  isPreviewLoading: boolean;
}

// Helper functions
function isToday(dateString: string): boolean {
  return new Date().toLocaleDateString() === dateString;
}

function isYesterday(dateString: string): boolean {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.toLocaleDateString() === dateString;
}

const HistoryTimeline: React.FC<HistoryTimelineProps> = ({
  commits,
  selectedCommit,
  onPreview,
  onRestore,
  isPreviewLoading,
}) => {
  const { formatMessage } = useIntl();

  // Group commits by date
  const groupedCommits = commits.reduce(
    (groups, commit) => {
      const date = new Date(commit.date).toLocaleDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(commit);
      return groups;
    },
    {} as Record<string, GitCommit[]>,
  );

  const dateGroups = Object.entries(groupedCommits);

  return (
    <div className="py-2">
      {dateGroups.map(([date, groupCommits], groupIndex) => (
        <div key={date}>
          {/* Date header */}
          <div className="sticky top-0 bg-white dark:bg-slate-900 px-4 py-2 z-10">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {isToday(date)
                ? formatMessage({
                    id: 'pb_history_today',
                    defaultMessage: 'Today',
                  })
                : isYesterday(date)
                  ? formatMessage({
                      id: 'pb_history_yesterday',
                      defaultMessage: 'Yesterday',
                    })
                  : date}
            </span>
          </div>

          {/* Timeline items */}
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-6 top-0 bottom-0 w-px bg-slate-200 dark:bg-slate-700" />

            {groupCommits.map((commit, index) => (
              <HistoryItem
                key={commit.hash}
                commit={commit}
                isSelected={selectedCommit?.hash === commit.hash}
                isFirst={groupIndex === 0 && index === 0}
                isLoading={
                  isPreviewLoading && selectedCommit?.hash === commit.hash
                }
                onPreview={() => onPreview(commit)}
                onRestore={() => onRestore(commit)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default HistoryTimeline;
