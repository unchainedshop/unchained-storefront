import React from 'react';
import classNames from 'classnames';

const FilterCard = ({ title, children = null, className = '' }) => {
  return (
    <div
      className={classNames(
        'filter-card rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-slate-800',
        className,
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 m-0">
          {title}
        </h4>
      </div>

      <div>{children}</div>
    </div>
  );
};

export default FilterCard;
