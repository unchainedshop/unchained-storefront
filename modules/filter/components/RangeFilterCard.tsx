import React, { useState, useMemo } from 'react';
import RangeSlider from 'react-range-slider-input';
import 'react-range-slider-input/dist/style.css';
import { useIntl } from 'react-intl';

import useRouteFilterQuery from '../hooks/useRouteFilterQuery';
import FilterCard from './FilterCard';

const RangeFilterCard = ({ title, searchParamName, rangeItems = [] }) => {
  const { formatMessage } = useIntl();
  const { filterQuery, setFilterValues } = useRouteFilterQuery();

  const numericValues = useMemo(() => {
    const values = rangeItems
      .map((r) => Number(r.value))
      .filter((v) => !isNaN(v));

    return Array.from(new Set(values)).sort((a, b) => a - b);
  }, [rangeItems]);

  const minValue = Math.min(...numericValues, 0);
  const maxValue = Math.max(...numericValues, 0);

  const matched = filterQuery.find((f) => f.key === searchParamName);
  const initial = matched?.value
    ? matched.value.split(',').map(Number)
    : [minValue, maxValue];

  const [value, setValue] = useState<[number, number]>([
    initial[0] ?? minValue,
    initial[1] ?? maxValue,
  ]);

  const onSliderChange = (newValue: number[]) => {
    setValue([newValue[0], newValue[1]]);
  };

  const apply = () => {
    setFilterValues(searchParamName, [`${value[0]},${value[1]}`]);
  };

  const reset = () => {
    setValue([minValue, maxValue]);
    setFilterValues(searchParamName, []);
  };

  return (
    <FilterCard title={title}>
      <div className="mt-3">
        <div className="mb-2 flex justify-between text-sm font-medium text-slate-600 dark:text-slate-300">
          <span>{value[0]}</span>
          <span>{value[1]}</span>
        </div>

        <RangeSlider
          min={minValue}
          max={maxValue}
          step={1}
          value={value}
          onInput={onSliderChange}
          className="accent-blue-600"
        />

        <div className="mt-3 flex gap-2">
          <button
            onClick={apply}
            className="flex-1 rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
          >
            {formatMessage({ id: 'apply', defaultMessage: 'Apply' })}
          </button>

          <button
            onClick={reset}
            className="flex-1 rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            {formatMessage({ id: 'reset', defaultMessage: 'Reset' })}
          </button>
        </div>
      </div>
    </FilterCard>
  );
};

export default RangeFilterCard;
