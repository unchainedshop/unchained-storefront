import React from 'react';
import classNames from 'classnames';
import { Squares2X2Icon, ListBulletIcon } from '@heroicons/react/24/outline';
import { useIntl } from 'react-intl';
import useLocalStorage from '../hooks/useLocalStorage';
import PageHeader from './PageHeader';

type ViewMode = 'grid' | 'list';

interface ListViewWrapperProps {
  storageKey?: string;
  className?: string;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: (viewMode: ViewMode) => React.ReactNode;
}

const ListViewWrapper: React.FC<ListViewWrapperProps> = ({
  storageKey = 'listViewMode',
  className,
  children,
  title,
  subtitle,
  actions,
}) => {
  const { formatMessage } = useIntl();
  const [viewMode, setViewMode] = useLocalStorage(storageKey, 'grid');

  const toggleClass = (mode: ViewMode) =>
    classNames(
      'rounded-md p-1.5 transition-colors',
      viewMode === mode
        ? 'bg-surface text-foreground shadow-sm'
        : 'text-subtle-foreground hover:text-foreground',
    );

  const toggleGroup = (
        <div
      role="group"
      aria-label={formatMessage({ id: 'view_mode', defaultMessage: 'View mode' })}
      className="flex shrink-0 rounded-lg bg-muted p-1"
    >
      <button
        type="button"
        aria-pressed={viewMode === 'grid'}
        aria-label={formatMessage({ id: 'grid_view', defaultMessage: 'Grid view' })}
        onClick={() => setViewMode('grid')}
        className={toggleClass('grid')}
      >
        <Squares2X2Icon className="size-4" />
      </button>
      <button
        type="button"
        aria-pressed={viewMode === 'list'}
        aria-label={formatMessage({ id: 'list_view', defaultMessage: 'List view' })}
        onClick={() => setViewMode('list')}
        className={toggleClass('list')}
      >
        <ListBulletIcon className="size-4" />
      </button>
    </div>
  );

  return (
    <div className={className}>
      {title ? (
        <PageHeader
          title={title}
          description={subtitle}
          actions={
            <>
              {actions}
              {toggleGroup}
            </>
          }
        />
      ) : (
        <div className="mb-6 flex justify-end">{toggleGroup}</div>
      )}
      {children(viewMode)}
    </div>
  );
};

export default ListViewWrapper;
