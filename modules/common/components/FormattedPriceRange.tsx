import { useIntl } from 'react-intl';
import FormattedPrice from './FormattedPrice';

const FormattedPriceRange = ({ priceRange }) => {
  const intl = useIntl();

  if (!priceRange?.minPrice || !priceRange?.maxPrice) {
    return <span>N/A</span>;
  }

  const minPrice = priceRange.minPrice;
  const maxPrice = priceRange.maxPrice;

  if (minPrice.amount === maxPrice.amount) {
    return <FormattedPrice price={minPrice} />;
  }

  return (
    <span>
      <FormattedPrice price={minPrice} />
      <span className="mx-1">
        {intl.formatMessage({
          id: 'price_range_separator',
          defaultMessage: '–',
        })}
      </span>
      <FormattedPrice price={maxPrice} />
    </span>
  );
};

export default FormattedPriceRange;
