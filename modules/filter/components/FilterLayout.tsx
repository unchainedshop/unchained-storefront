import { useState } from 'react';
import { useIntl } from 'react-intl';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { AdjustmentsHorizontalIcon, XMarkIcon } from '@heroicons/react/24/outline';
import FilterSidebar from './FilterSideBar';

const FilterLayout = ({ filters = [], resultCount = null, children }) => {
  const { formatMessage } = useIntl();
  const [open, setOpen] = useState(false);
  const hasFilters = filters?.length > 0;

  return (
    <div className="flex gap-10">
      {hasFilters && (
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pr-2">
            <FilterSidebar filters={filters} />
          </div>
        </aside>
      )}

      <div className="min-w-0 flex-1">
        {(hasFilters || resultCount !== null) && (
          <div className="mb-4 flex items-center justify-between gap-3">
            {resultCount !== null && (
              <p className="text-sm text-muted-foreground">
                {formatMessage(
                  { id: 'result_count', defaultMessage: '{count, plural, one {# product} other {# products}}' },
                  { count: resultCount },
                )}
              </p>
            )}
            {hasFilters && (
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="btn btn-secondary btn-sm ml-auto lg:hidden"
              >
                <AdjustmentsHorizontalIcon className="size-4" />
                {formatMessage({ id: 'filters', defaultMessage: 'Filters' })}
              </button>
            )}
          </div>
        )}
        {children}
      </div>

      {hasFilters && (
        <Dialog open={open} onClose={setOpen} className="relative z-1050 lg:hidden">
          <DialogBackdrop
            transition
            className="fixed inset-0 bg-overlay transition-opacity duration-300 data-closed:opacity-0"
          />
          <DialogPanel
            transition
            className="fixed inset-x-0 bottom-0 flex max-h-[85vh] flex-col rounded-t-2xl bg-surface shadow-pop transition duration-300 ease-out data-closed:translate-y-full"
          >
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <DialogTitle className="text-base font-semibold">
                {formatMessage({ id: 'filters', defaultMessage: 'Filters' })}
              </DialogTitle>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="btn-icon -mr-2"
                aria-label={formatMessage({ id: 'close', defaultMessage: 'Close' })}
              >
                <XMarkIcon className="size-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <FilterSidebar filters={filters} />
            </div>
            <div className="border-t border-border p-4">
              <button type="button" onClick={() => setOpen(false)} className="btn btn-primary w-full">
                {resultCount !== null
                  ? formatMessage(
                      { id: 'show_results', defaultMessage: 'Show {count} results' },
                      { count: resultCount },
                    )
                  : formatMessage({ id: 'done', defaultMessage: 'Done' })}
              </button>
            </div>
          </DialogPanel>
        </Dialog>
      )}
    </div>
  );
};

export default FilterLayout;
