'use client';
import React from 'react';
import Button from '../../common/components/Button';
import useRouteFilterQuery from '../hooks/useFilterContext';
import DynamicFilterCard from './DynamicFilterCard';

const FilterSidebar = ({ filters }) => {
  const { resetFilters } = useRouteFilterQuery();

  return (
    <div className="filter-sidebar">
      <div className="mb-3">
        <Button onClick={resetFilters} className="fs-8 color-blue">
          Reset all filters
        </Button>
      </div>
      {filters.map((filter) => (
        <DynamicFilterCard filter={filter} key={filter._id} />
      ))}
    </div>
  );
};

export default FilterSidebar;
