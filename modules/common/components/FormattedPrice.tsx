import { useIntl } from 'react-intl';
import formatPrice from '../utils/formatPrice';
import useSupportedCurrencies from '../utils/useSupportedCurrencies';

const FormattedPrice = ({ price }) => {
  const { locale } = useIntl();
  const { currencies, loading } = useSupportedCurrencies();

  // Handle case where price is null/undefined
  if (!price || !price.currencyCode) {
    return <span>N/A</span>;
  }

  // Handle loading state
  if (loading) {
    return <span>—</span>;
  }

  // Find currency definition from GraphQL
  const currencyDefinition = currencies?.find(
    (currency) => currency.isoCode === price.currencyCode,
  );

  // Use GraphQL decimals if available, otherwise default to 2 for standard currencies
  const decimals = currencyDefinition?.decimals ?? 2;

  // Format the price with consistent parameters
  const formattedPrice = formatPrice({
    amount: price.amount,
    currencyCode: price.currencyCode,
    decimals: decimals,
    hack: true, // Always convert from smallest unit
    locale: locale,
  });

  return <span>{formattedPrice}</span>;
};

export default FormattedPrice;
