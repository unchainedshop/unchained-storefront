import React, { useMemo } from 'react';
import FilterCard from './FilterCard';
import useRouteFilterQuery from '../hooks/useRouteFilterQuery';

const SingleChoiceFilterCard = ({
  title,
  searchParamName,
  options = [],
  defaultChecked = null,
}) => {
  const { filterQuery, setFilterValues } = useRouteFilterQuery();

  const currentValue = useMemo(() => {
    const matched = filterQuery.find((f) => f.key === searchParamName);
    return matched?.value || defaultChecked;
  }, [filterQuery, searchParamName, defaultChecked]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterValues(searchParamName, [e.target.value]);
  };

  if (!options.length) return null;

  return (
    <FilterCard title={title}>
      <div className="mt-3 flex flex-col gap-2">
        {options.map(({ label, value }) => {
          const id = `${searchParamName}_${String(value).replace(/\s+/g, '_')}`;
          return (
            <div key={value} className="flex items-center gap-2">
              <input
                id={id}
                type="radio"
                name={searchParamName}
                value={value}
                checked={currentValue === value}
                onChange={onChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300"
              />
              <label
                htmlFor={id}
                className="text-sm text-slate-700 dark:text-slate-300 cursor-pointer"
              >
                {label}
              </label>
            </div>
          );
        })}
      </div>
    </FilterCard>
  );
};

export default SingleChoiceFilterCard;
