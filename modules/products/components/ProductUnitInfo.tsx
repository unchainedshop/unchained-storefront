import { useIntl } from 'react-intl';

// "per box · 6 pcs" from the engine's sales unit fields; nothing when unset.
const ProductUnitInfo = ({ product, className = '' }) => {
  const { formatMessage } = useIntl();
  const { salesUnit, salesQuantityPerUnit, baseUnit } = product || {};
  if (!salesUnit && !salesQuantityPerUnit) return null;

  const parts = [
    salesUnit && formatMessage({ id: 'per_sales_unit', defaultMessage: 'per {unit}' }, { unit: salesUnit }),
    salesQuantityPerUnit && [salesQuantityPerUnit, baseUnit].filter(Boolean).join(' '),
  ].filter(Boolean);

  return <span className={`text-sm font-normal text-muted-foreground ${className}`}>{parts.join(' · ')}</span>;
};

export default ProductUnitInfo;
