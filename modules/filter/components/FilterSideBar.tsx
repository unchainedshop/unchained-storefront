import React from 'react';
import { useIntl } from 'react-intl';

import Button from '../../common/components/Button';
import useRouteFilterQuery from '../hooks/useRouteFilterQuery';
import DynamicFilterCard from './DynamicFilterCard';

const FilterSidebar = ({ filters = [] }) => {
  const { formatMessage } = useIntl();
  const { resetFilters } = useRouteFilterQuery();

  if (!filters.length) return null;

  return (
    <aside className="w-full lg:w-64 space-y-4">
      <div className="mb-4">
        <Button
          onClick={resetFilters}
          className="w-full rounded-lg bg-danger-soft px-4 py-2 text-sm font-semibold text-danger hover:bg-danger-soft focus:outline-none focus:ring-2 focus:ring-danger transition"
        >
          {formatMessage({
            id: 'reset_all_filters',
            defaultMessage: 'Reset all filters',
          })}
        </Button>
      </div>

      <div className="space-y-4">
        {filters.map((filter) => (
          <DynamicFilterCard key={filter._id} filter={filter} />
        ))}
      </div>
    </aside>
  );
};

export default FilterSidebar;
