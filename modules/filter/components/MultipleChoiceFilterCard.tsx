import React, { useMemo, useState } from 'react';
import FilterCard from './FilterCard';
import useRouteFilterQuery from '../hooks/useRouteFilterQuery';

const MultipleChoiceFilterCard = ({
  title,
  searchParamName,
  options = [],
  limit = 4,
}) => {
  const { filterQuery, setFilterValues } = useRouteFilterQuery();
  const [itemLimit, setItemLimit] = useState(limit);
  const current = useMemo(() => {
    return filterQuery
      .filter((f) => f.key === searchParamName)
      .map((f) => f.value)
      .filter(Boolean) as string[];
  }, [filterQuery, searchParamName]);

  if (!options.length) return null;

  const onToggle = (value: string, checked: boolean) => {
    let values = [...current];
    if (checked) {
      values = Array.from(new Set([...values, value]));
    } else {
      values = values.filter((v) => v !== value);
    }
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
        <div className="filter-actions d-flex flex-wrap gap-2 mb-3">
          {current.length !== options.length ? (
            <a
              onClick={selectAll}
              className="px-3 py-1 fs-8 bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 focus:outline-none focus:ring-1 focus:ring-blue-300 transition"
            >
              Select all
            </a>
          ) : null}
          {current.length ? (
            <a
              onClick={reset}
              className="px-3 py-1 fs-8 bg-red-50 text-red-700 rounded-full hover:bg-red-100 focus:outline-none focus:ring-1 focus:ring-red-300 transition"
            >
              Reset
            </a>
          ) : null}
        </div>
      )}

      <div className="d-flex flex-column gap-2 mt-2">
        {options.slice(0, itemLimit).map((opt) => {
          const id = `${searchParamName}:${String(opt.value).replace(/\s+/g, '_')}`;
          return (
            <div
              key={opt.value}
              className="d-flex align-items-center justify-content-between"
            >
              <div className="d-flex align-items-center gap-2">
                <input
                  id={id}
                  type="checkbox"
                  value={opt.value}
                  checked={current.includes(opt.value)}
                  onChange={(e) => onToggle(opt.value, e.target.checked)}
                />
                <label htmlFor={id}>{opt.label}</label>
              </div>
            </div>
          );
        })}
      </div>

      {options.length > itemLimit && (
        <button
          className="color-blue fs-8 mt-2"
          onClick={() => setItemLimit(Infinity)}
        >
          Show more
        </button>
      )}
    </FilterCard>
  );
};

export default MultipleChoiceFilterCard;
