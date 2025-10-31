import React, { useMemo, useState } from 'react';
import FilterCard from './FilterCard';
import useRouteFilterQuery from '../hooks/useFilterContext';

const RangeFilterCard = ({ title, searchParamName, rangeItems = [] }) => {
  const { filterQuery, setFilterValues } = useRouteFilterQuery();

  const numericValues = useMemo(
    () =>
      Array.from(
        new Set(
          rangeItems.map((r) => Number(r.value)).filter((v) => !isNaN(v)),
        ),
      ).sort((a, b) => a - b),
    [rangeItems],
  );

  const minValue = numericValues[0] ?? 0;
  const maxValue = numericValues[numericValues.length - 1] ?? 100;

  const matched = filterQuery.find((f) => f.key === searchParamName);
  const initialMin = matched?.value?.split(',')[0]
    ? Number(matched.value.split(',')[0])
    : minValue;
  const initialMax = matched?.value?.split(',')[1]
    ? Number(matched.value.split(',')[1])
    : maxValue;

  const [min, setMin] = useState(initialMin);
  const [max, setMax] = useState(initialMax);

  const apply = () => {
    const newMin = Math.min(min, max);
    const newMax = Math.max(min, max);
    setFilterValues(searchParamName, [`${newMin},${newMax}`]);
  };

  const reset = () => {
    setMin(minValue);
    setMax(maxValue);
    setFilterValues(searchParamName, []);
  };

  return (
    <FilterCard title={title}>
      <div className="d-flex flex-column gap-2 mt-2">
        <div className="d-flex justify-content-between">
          <span>
            {min} – {max}
          </span>
        </div>

        <input
          type="range"
          min={minValue}
          max={maxValue}
          list={`range-${searchParamName}`}
          step={1}
          value={min}
          onChange={(e) => setMin(Number(e.target.value))}
        />
        <input
          type="range"
          min={minValue}
          max={maxValue}
          list={`range-${searchParamName}`}
          step={1}
          value={max}
          onChange={(e) => setMax(Number(e.target.value))}
        />

        <datalist id={`range-${searchParamName}`}>
          {numericValues.map((v) => (
            <option key={v} value={v} label={v.toString()} />
          ))}
        </datalist>

        <div className="d-flex gap-2 mt-2">
          <button className="color-blue fs-8" onClick={apply}>
            Apply
          </button>
          <button className="color-gray fs-8" onClick={reset}>
            Reset
          </button>
        </div>
      </div>
    </FilterCard>
  );
};

export default RangeFilterCard;
