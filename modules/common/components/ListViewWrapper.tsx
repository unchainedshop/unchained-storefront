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
              <h1 className="text-3xl font-semibold tracking-tight text-foreground mb-2">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="text-lg text-muted-foreground">
                {subtitle}
              </p>
            )}
          </div>
        )}
        <div className="flex justify-end mb-4">
          <div className="flex bg-muted rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={classNames(
                'p-2 rounded-md transition-colors',
                viewMode === 'grid'
                  ? 'bg-surface text-foreground shadow-sm'
                  : 'text-subtle-foreground hover:text-muted-foreground ',
              )}
            >
              <Squares2X2Icon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={classNames(
                'p-2 rounded-md transition-colors',
                viewMode === 'list'
                  ? 'bg-surface text-foreground shadow-sm'
                  : 'text-subtle-foreground hover:text-muted-foreground ',
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
