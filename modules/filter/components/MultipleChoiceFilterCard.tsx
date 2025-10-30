import React, { useMemo, useState } from 'react';
import FilterCard from './FilterCard';
import useFilterContext from '../hooks/useFilterContext';
import Button from '../../common/components/Button';

const MultipleChoiceFilterCard = ({
  title,
  searchParamName,
  options = [],
  limit = 4,
  onSettingsClicked,
}) => {
  const { formState, setFilterValues } = useFilterContext();
  const current = useMemo(
    () => formState[searchParamName] || [],
    [formState, searchParamName],
  );
  const [itemLimit, setItemLimit] = useState(limit);

  if (!options.length) return null;

  const onToggle = (value: string, checked: boolean) => {
    if (checked)
      setFilterValues(
        searchParamName,
        Array.from(new Set([...current, value])),
      );
    else
      setFilterValues(
        searchParamName,
        current.filter((v) => v !== value),
      );
  };

  const selectAll = () =>
    setFilterValues(
      searchParamName,
      options.map((o) => o.value),
    );
  const reset = () => setFilterValues(searchParamName, []);

  return (
    <FilterCard title={title} onSettingsClicked={onSettingsClicked}>
      {options.length > 1 && (
        <div className="filter-select mb-2">
          <Button onClick={selectAll} className="fs-8">
            Select all
          </Button>
          <span className="mx-2">·</span>
          <Button onClick={reset} className="fs-8">
            Reset
          </Button>
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

              {opt.showSettings && onSettingsClicked && (
                <Button onClick={() => onSettingsClicked(opt.value)}>
                  <i className="icon icon-edit" />
                </Button>
              )}
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
