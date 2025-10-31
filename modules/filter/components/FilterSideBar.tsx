import React from 'react';
import Button from '../../common/components/Button';
import useRouteFilterQuery from '../hooks/useRouteFilterQuery';
import DynamicFilterCard from './DynamicFilterCard';
import { useIntl } from 'react-intl';

const FilterSidebar = ({ filters }) => {
  const { formatMessage } = useIntl();
  const { resetFilters } = useRouteFilterQuery();

  return (
    <div className="filter-sidebar">
      <div className="mb-3">
        <Button onClick={resetFilters} className="fs-8 color-blue">
          {formatMessage({
            id: 'reset_all_filters',
            defaultMessage: 'Reset all filters',
          })}
        </Button>
      </div>
      {filters.map((filter) => (
        <DynamicFilterCard filter={filter} key={filter._id} />
      ))}
    </div>
  );
};

export default FilterSidebar;
