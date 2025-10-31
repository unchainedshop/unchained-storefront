'use client';

import React, { useMemo } from 'react';
import FilterCard from './FilterCard';
import useRouteFilterQuery from '../hooks/useFilterContext';

const SwitchFilterCard = ({ title, searchParamName, label }) => {
  const { filterQuery, setFilterValues } = useRouteFilterQuery();
  const checked = useMemo(() => {
    const found = filterQuery.find((f) => f.key === searchParamName);
    return found?.value === 'true';
  }, [filterQuery, searchParamName]);

  const toggle = () => {
    setFilterValues(searchParamName, checked ? [] : ['true']);
  };

  return (
    <FilterCard title={title}>
      <label className="d-flex align-items-center gap-2 mt-2">
        <input type="checkbox" checked={checked} onChange={toggle} />
        {label ?? title}
      </label>
    </FilterCard>
  );
};

export default SwitchFilterCard;
