import React, { useState, useMemo } from 'react';
import RangeSlider from 'react-range-slider-input';
import 'react-range-slider-input/dist/style.css';
import useRouteFilterQuery from '../hooks/useRouteFilterQuery';
import FilterCard from './FilterCard';
import { useIntl } from 'react-intl';

const RangeFilterCard = ({ title, searchParamName, rangeItems = [] }) => {
  const { formatMessage } = useIntl();
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
  const minValue = Math.min(...[...numericValues, 0]);
  const maxValue = Math.max(...[...numericValues, 0]);

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
      <div className="mt-2">
        <div className="mb-1 text-sm">
          {value[0]} – {value[1]}
        </div>

        <RangeSlider
          min={minValue}
          max={maxValue}
          step={1}
          value={value}
          onInput={onSliderChange}
        />

        <div className="flex gap-2 mt-2">
          <button onClick={apply} className="btn‑apply">
            {formatMessage({ id: 'apply', defaultMessage: 'Apply' })}
          </button>
          <button onClick={reset} className="btn‑reset">
            {formatMessage({ id: 'reset', defaultMessage: 'Reset' })}
          </button>
        </div>
      </div>
    </FilterCard>
  );
};

export default RangeFilterCard;
