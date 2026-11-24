import { useIntl } from 'react-intl';
import useSupportedCurrencies from '../utils/useSupportedCurrencies';
import { useAppContext } from './AppContextWrapper';

const CurrencySelector = ({ className = '' }) => {
  const { currencies } = useSupportedCurrencies();
  const { selectedCurrency, changeCurrency } = useAppContext();
  const { formatMessage } = useIntl();
  if (!currencies?.length || currencies.length < 2) return null;

  return (
    <select
      aria-label={formatMessage({ id: 'currency', defaultMessage: 'Currency' })}
      className={`input w-auto py-1.5 pr-8 text-sm ${className}`}
      onChange={(e) => changeCurrency(e.target.value)}
      value={selectedCurrency}
    >
      {currencies.map((currency) => (
        <option key={currency._id} value={currency.isoCode}>
          {currency.isoCode}
        </option>
      ))}
    </select>
  );
};

export default CurrencySelector;
