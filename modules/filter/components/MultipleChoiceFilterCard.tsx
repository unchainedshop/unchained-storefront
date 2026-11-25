import React, { useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import FilterCard from './FilterCard';
import useRouteFilterQuery from '../hooks/useRouteFilterQuery';

const MultipleChoiceFilterCard = ({
  title,
  searchParamName,
  options = [],
  limit = 4,
}) => {
  const { formatMessage } = useIntl();
  const { filterQuery, setFilterValues } = useRouteFilterQuery();
  const [itemLimit, setItemLimit] = useState(limit);

  const current = useMemo(() => {
    return filterQuery
      .filter((f) => f.key === searchParamName)
      .map((f) => f.value)
      .filter(Boolean) as string[];
  }, [filterQuery, searchParamName]);

  if (!options.length) return null;

  // --- Handlers ---
  const onToggle = (value: string, checked: boolean) => {
    let values = [...current];
    values = checked
      ? Array.from(new Set([...values, value]))
      : values.filter((v) => v !== value);

    setFilterValues(searchParamName, values);
  };

  const selectAll = () =>
    setFilterValues(
      searchParamName,
      options.map((o) => o.value),
    );

  const reset = () => setFilterValues(searchParamName, []);

  return (
    <FilterCard title={title}>
      {options.length > 1 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {current.length !== options.length && (
            <button
              onClick={selectAll}
              className="rounded-full bg-accent-soft px-3 py-1 text-xs font-medium text-accent hover:bg-accent-soft focus:outline-none focus:ring-2 focus:ring-ring transition"
            >
              {formatMessage({ id: 'selectAll', defaultMessage: 'Select all' })}
            </button>
          )}

          {current.length > 0 && (
            <button
              onClick={reset}
              className="rounded-full bg-danger-soft px-3 py-1 text-xs font-medium text-danger hover:bg-danger-soft focus:outline-none focus:ring-2 focus:ring-danger transition"
            >
              {formatMessage({ id: 'reset', defaultMessage: 'Reset' })}
            </button>
          )}
        </div>
      )}

      <div className="flex flex-col gap-2 mt-2">
        {options.slice(0, itemLimit).map((opt) => {
          const id = `${searchParamName}:${String(opt.value).replace(/\s+/g, '_')}`;
          return (
            <div key={opt.value} className="flex items-center gap-2">
              <input
                id={id}
                type="checkbox"
                value={opt.value}
                checked={current.includes(opt.value)}
                onChange={(e) => onToggle(opt.value, e.target.checked)}
                className="h-4 w-4 rounded border-input text-accent focus:ring-ring"
              />
              <label
                htmlFor={id}
                className="text-sm text-muted-foreground cursor-pointer"
              >
                {opt.label}
              </label>
            </div>
          );
        })}
      </div>

      {options.length > itemLimit && (
        <button
          onClick={() => setItemLimit(Infinity)}
          className="mt-3 text-sm font-medium text-accent hover:text-accent focus:outline-none focus:underline"
        >
          {formatMessage({ id: 'showMore', defaultMessage: 'Show more' })}
        </button>
      )}
    </FilterCard>
  );
};

export default MultipleChoiceFilterCard;
