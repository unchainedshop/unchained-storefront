import React from 'react';
import classNames from 'classnames';

const FilterCard = ({ title, children = null, className = '' }) => {
  return (
    <div
      className={classNames(
        'filter-card rounded-2xl border border-border bg-surface p-4 shadow-sm ',
        className,
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-foreground m-0">
          {title}
        </h4>
      </div>

      <div>{children}</div>
    </div>
  );
};

export default FilterCard;
