import React, { useMemo } from 'react';
import FilterCard from './FilterCard';
import useFilterContext from '../hooks/useFilterContext';

const SingleChoiceFilterCard = ({
  title,
  searchParamName,
  options,
  defaultChecked = false,
  onSettingsClicked,
}) => {
  const { formState, setFilterValues } = useFilterContext();
  const current = useMemo(
    () => formState[searchParamName]?.[0] ?? defaultChecked ?? '',
    [formState, searchParamName, defaultChecked],
  );

  if (!options?.length) return null;

  return (
    <FilterCard title={title} onSettingsClicked={onSettingsClicked}>
      <div className="d-flex flex-column gap-2 mt-2">
        {options.map((opt) => {
          const id = `${searchParamName}_${String(opt.value).replace(/\s+/g, '_')}`;
          return (
            <div key={opt.value} className="d-flex align-items-center gap-2">
              <input
                id={id}
                type="radio"
                name={searchParamName}
                value={opt.value}
                checked={current === opt.value}
                onChange={() => setFilterValues(searchParamName, [opt.value])}
              />
              <label htmlFor={id}>{opt.label}</label>
            </div>
          );
        })}
      </div>
    </FilterCard>
  );
};

export default SingleChoiceFilterCard;
