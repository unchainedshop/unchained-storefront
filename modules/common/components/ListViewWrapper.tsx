import React from 'react';
import classNames from 'classnames';
import { Squares2X2Icon, ListBulletIcon } from '@heroicons/react/24/outline';
import useLocalStorage from '../hooks/useLocalStorage';

type ViewMode = 'grid' | 'list';

interface ListViewWrapperProps {
  storageKey?: string;
  className?: string;
  title?: string;
  subtitle?: string;
  children: (viewMode: ViewMode) => React.ReactNode;
}

const ListViewWrapper: React.FC<ListViewWrapperProps> = ({
  storageKey = 'listViewMode',
  className,
  children,
  title,
  subtitle,
}) => {
  const [viewMode, setViewMode] = useLocalStorage(storageKey, 'list');

  return (
    <div className={classNames('space-y-4', className)}>
      <div className="container mx-auto py-8">
        {(title || subtitle) && (
          <div className="mb-8">
            {title && (
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white mb-2">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="text-lg text-slate-600 dark:text-slate-300">
                {subtitle}
              </p>
            )}
          </div>
        )}
        <div className="flex justify-end mb-4">
          <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={classNames(
                'p-2 rounded-md transition-colors',
                viewMode === 'grid'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200',
              )}
            >
              <Squares2X2Icon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={classNames(
                'p-2 rounded-md transition-colors',
                viewMode === 'list'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200',
              )}
            >
              <ListBulletIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {children(viewMode)}
      </div>
    </div>
  );
};

export default ListViewWrapper;
