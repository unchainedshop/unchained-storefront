import React from 'react';
import SingleChoiceFilterCard from './SingleChoiceFilterCard';
import MultipleChoiceFilterCard from './MultipleChoiceFilterCard';
import SwitchFilterCard from './SwitchFilterCard';
import RangeFilterCard from './RangeFilterCard';

const DynamicFilterCard = ({ filter, onSettingsClicked }) => {
  const { definition, options } = filter;
  const filterType = definition?.type;

  const filterItems = options?.map((opt: any) => ({
    label: opt.label || opt.value,
    value: opt.value,
  }));

  switch (filterType) {
    case 'SINGLE_CHOICE':
      return (
        <SingleChoiceFilterCard
          title={definition?.texts?.title}
          searchParamName={definition.key}
          options={filterItems}
          onSettingsClicked={onSettingsClicked}
        />
      );

    case 'MULTI_CHOICE':
      return (
        <MultipleChoiceFilterCard
          title={definition.texts?.title}
          searchParamName={definition.key}
          options={filterItems}
          onSettingsClicked={onSettingsClicked}
        />
      );

    case 'SWITCH':
      return (
        <SwitchFilterCard
          title={definition.label}
          searchParamName={definition.key}
          label={definition.label}
          onSettingsClicked={onSettingsClicked}
        />
      );

    case 'RANGE':
      return (
        <RangeFilterCard
          title={definition.label}
          searchParamName={definition.key}
          min={definition.minValue}
          max={definition.maxValue}
          unit={definition.unit}
          onSettingsClicked={onSettingsClicked}
        />
      );

    default:
      return null;
  }
};

export default DynamicFilterCard;
