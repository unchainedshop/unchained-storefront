import React, { useMemo } from 'react';
import FilterCard from './FilterCard';
import useRouteFilterQuery from '../hooks/useRouteFilterQuery';

const SwitchFilterCard = ({ title, searchParamName }) => {
  const { filterQuery, setFilterValues } = useRouteFilterQuery();
  const selectedValue = useMemo(() => {
    const found = filterQuery.find((f) => f.key === searchParamName);
    return found?.value ?? '';
  }, [filterQuery, searchParamName]);

  const isChecked = selectedValue === 'true';

  return (
    <FilterCard title={title}>
      <div className="mt-2 flex flex-col gap-3">
        {/* Native checkbox + CSS-only knob (no JS-computed styles) */}
        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            className="peer sr-only"
            checked={isChecked}
            onChange={() =>
              setFilterValues(searchParamName, [isChecked ? 'false' : 'true'])
            }
          />
          <span className="relative h-6 w-[46px] rounded-full bg-slate-300 transition-colors peer-checked:bg-blue-500 after:absolute after:top-[3px] after:left-[3px] after:h-[18px] after:w-[18px] after:rounded-full after:bg-white after:transition-transform after:content-[''] peer-checked:after:translate-x-[22px]" />
        </label>

        {selectedValue ? (
          <button
            type="button"
            onClick={() => setFilterValues(searchParamName, [])}
            className="self-start rounded-md border border-slate-300 px-2.5 py-0.5 text-xs text-slate-500 transition-colors hover:bg-slate-100"
          >
            Reset
          </button>
        ) : null}
      </div>
    </FilterCard>
  );
};

export default SwitchFilterCard;
