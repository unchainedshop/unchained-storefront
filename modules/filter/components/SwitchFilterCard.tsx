import React from 'react';
import FilterCard from './FilterCard';
import useFilterContext from '../hooks/useFilterContext';

const SwitchFilterCard = ({
  title,
  searchParamName,
  label,
  onSettingsClicked,
}) => {
  const { formState, setFilterValues } = useFilterContext();
  const checked = Boolean(formState[searchParamName]?.[0] === 'true');

  const toggle = () => {
    setFilterValues(searchParamName, checked ? [] : ['true']);
  };

  return (
    <FilterCard title={title} onSettingsClicked={onSettingsClicked}>
      <label className="d-flex align-items-center gap-2 mt-2">
        <input type="checkbox" checked={checked} onChange={toggle} />
        {label ?? title}
      </label>
    </FilterCard>
  );
};

export default SwitchFilterCard;
