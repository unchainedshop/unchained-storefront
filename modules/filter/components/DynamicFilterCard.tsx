import React from 'react';
import SingleChoiceFilterCard from './SingleChoiceFilterCard';
import MultipleChoiceFilterCard from './MultipleChoiceFilterCard';
import SwitchFilterCard from './SwitchFilterCard';
import RangeFilterCard from './RangeFilterCard';

const DynamicFilterCard = ({ filter }) => {
  const { definition, options } = filter;
  const filterType = definition?.type;
  const filterItems = options?.map((opt: any) => ({
    label: opt.definition.texts?.title || opt.definition.value,
    value: opt.definition.value,
  }));

  switch (filterType) {
    case 'SINGLE_CHOICE':
      return (
        <SingleChoiceFilterCard
          title={definition?.texts?.title}
          searchParamName={definition.key}
          options={filterItems}
        />
      );

    case 'MULTI_CHOICE':
      return (
        <MultipleChoiceFilterCard
          title={definition.texts?.title}
          searchParamName={definition.key}
          options={filterItems}
        />
      );

    case 'SWITCH':
      return (
        <SwitchFilterCard
          title={definition.texts?.title}
          searchParamName={definition.key}
          label={definition.texts?.subtitle}
        />
      );

    case 'RANGE':
      return (
        <RangeFilterCard
          title={definition.texts?.title}
          searchParamName={definition.key}
          min={definition.minValue}
          max={definition.maxValue}
          unit={definition.unit}
        />
      );

    default:
      return null;
  }
};

export default DynamicFilterCard;
