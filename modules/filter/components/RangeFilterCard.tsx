import React, { useEffect, useState, useMemo } from 'react';
import FilterCard from './FilterCard';
import useRouteFilterQuery from '../hooks/useFilterContext';
const RangeFilterCard = ({
  title,
  searchParamName,
  min = 0,
  max = 100,
  step = 1,
  unit,
}) => {
  const { filterQuery, setFilterValues } = useRouteFilterQuery();
  const initial = useMemo(() => {
    const matched = filterQuery.find((f) => f.key === searchParamName);
    if (!matched || !matched.value) return [min, max];
    const numbers = matched.value.split(',').map(Number);
    return [numbers[0] ?? min, numbers[1] ?? max];
  }, [filterQuery, searchParamName, min, max]);

  const [range, setRange] = useState<[number, number]>([
    initial[0],
    initial[1],
  ]);
  useEffect(() => {
    setFilterValues(searchParamName, [`${range[0]},${range[1]}`]);
  }, [range[0], range[1], searchParamName, setFilterValues]);

  return (
    <FilterCard title={title}>
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
