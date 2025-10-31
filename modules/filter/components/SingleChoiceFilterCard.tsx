import React, { useMemo } from 'react';
import FilterCard from './FilterCard';
import useRouteFilterQuery from '../hooks/useRouteFilterQuery';

const SingleChoiceFilterCard = ({
  title,
  searchParamName,
  options,
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

  if (!options?.length) return null;

  return (
    <FilterCard title={title}>
      <div className="d-flex flex-column gap-12px gap-lg-2 mt-2">
        {options.map(({ label, value }) => (
          <div
            className="radio-group__item d-flex align-items-center"
            key={value}
          >
            <input
              className="form-field-input"
              id={`${searchParamName}_${value}`}
              type="radio"
              name={searchParamName}
              value={value}
              checked={currentValue === value}
              onChange={onChange}
            />
            <label htmlFor={`${searchParamName}_${value}`}>{label}</label>
          </div>
        ))}
      </div>
    </FilterCard>
  );
};

export default SingleChoiceFilterCard;
