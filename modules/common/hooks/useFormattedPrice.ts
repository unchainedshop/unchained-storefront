import { useIntl } from 'react-intl';
import formatPrice from '../utils/formatPrice';
import useSupportedCurrencies from '../utils/useSupportedCurrencies';

/**
 * Hook for formatting prices consistently across the application
 * Always use this instead of manual formatting for consistency
 */
const useFormattedPrice = () => {
  const { locale } = useIntl();
  const { currencies } = useSupportedCurrencies();

  const formatPriceForDisplay = (price: any) => {
    // Handle null/undefined cases
    if (!price || !price.currencyCode) {
      return 'N/A';
    }

    // Find currency definition from GraphQL
    const currencyDefinition = currencies?.find(
      (currency) => currency.isoCode === price.currencyCode,
    );

    // Use GraphQL decimals if available, otherwise default to 2
    const decimals = currencyDefinition?.decimals ?? 2;

    // Format using our robust formatPrice function
    return formatPrice({
      amount: price.amount,
      currencyCode: price.currencyCode,
      decimals: decimals,
      hack: true, // Always convert from smallest unit
      locale: locale,
    });
  };

  return {
    formatPrice: formatPriceForDisplay,
  };
};

export default useFormattedPrice;
