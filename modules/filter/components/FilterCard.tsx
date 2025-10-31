import React from 'react';
import classNames from 'classnames';
import Button from '../../common/components/Button';

const FilterCard = ({ title, children = null, className = '' }) => {
  return (
    <div
      className={classNames(
        'filter-card border rounded-2xl p-3 bg-white shadow-sm',
        className,
      )}
    >
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h4 className="fs-6 fw-semibold m-0">{title}</h4>
      </div>

      <div className="filter-card__body">{children}</div>
    </div>
  );
};

export default FilterCard;
