import React, { useEffect, useState } from 'react';
import FilterCard from './FilterCard';
import useFilterContext from '../hooks/useFilterContext';

const RangeFilterCard = ({
  title,
  searchParamName,
  min = 0,
  max = 100,
  step = 1,
  unit,
  onSettingsClicked,
}) => {
  const { formState, setFilterValues } = useFilterContext();
  const initial = formState[searchParamName]?.map(Number) ?? [min, max];
  const [range, setRange] = useState<[number, number]>([
    initial[0] ?? min,
    initial[1] ?? max,
  ]);

  useEffect(() => {
    setFilterValues(searchParamName, [String(range[0]), String(range[1])]);
  }, [range[0], range[1]]);

  return (
    <FilterCard title={title} onSettingsClicked={onSettingsClicked}>
      <div className="d-flex align-items-center gap-2 mt-2">
        <input
          type="number"
          value={range[0]}
          min={min}
          max={range[1]}
          step={step}
          onChange={(e) => setRange([Number(e.target.value || min), range[1]])}
        />
        <span>–</span>
        <input
          type="number"
          value={range[1]}
          min={range[0]}
          max={max}
          step={step}
          onChange={(e) => setRange([range[0], Number(e.target.value || max)])}
        />
        {unit && <span>{unit}</span>}
      </div>
    </FilterCard>
  );
};

export default RangeFilterCard;
