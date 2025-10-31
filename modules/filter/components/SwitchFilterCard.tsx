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

  const handleToggle = () => {
    setFilterValues(searchParamName, [isChecked ? 'false' : 'true']);
  };

  const handleReset = () => {
    setFilterValues(searchParamName, []);
  };

  return (
    <FilterCard title={title}>
      <div className="d-flex flex-column gap-3 mt-2">
        <label
          className="d-flex align-items-center gap-3"
          style={{ cursor: 'pointer' }}
        >
          <div
            onClick={handleToggle}
            style={{
              position: 'relative',
              width: '46px',
              height: '24px',
              backgroundColor: isChecked ? '#007bff' : '#cbd5e1',
              borderRadius: '9999px',
              transition: 'background-color 0.25s ease',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: '3px',
                left: isChecked ? '26px' : '3px',
                width: '18px',
                height: '18px',
                background: '#fff',
                borderRadius: '50%',
                transition: 'left 0.25s ease',
              }}
            />
          </div>
        </label>

        {selectedValue ? (
          <button
            type="button"
            onClick={handleReset}
            style={{
              alignSelf: 'flex-start',
              background: 'transparent',
              color: '#6b7280',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              padding: '3px 10px',
              fontSize: '0.8rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#f3f4f6')}
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = 'transparent')
            }
          >
            Reset
          </button>
        ) : null}
      </div>
    </FilterCard>
  );
};

export default SwitchFilterCard;
