import useSupportedCurrencies from '../utils/useSupportedCurrencies';
import { useAppContext } from './AppContextWrapper';

const CurrencySelector = ({ className = '' }) => {
  const { currencies } = useSupportedCurrencies();
  const { selectedCurrency, changeCurrency } = useAppContext();
  return (
    <>
      <select
        className={`ml-2 ml-md-3 text-center ${className}`}
        onChange={(e) => {
          changeCurrency(e.target.value);
        }}
        defaultValue={selectedCurrency}
      >
        {currencies.map((currency) => (
          <option key={currency._id} value={currency.isoCode}>
            {currency.isoCode}
          </option>
        ))}
      </select>
    </>
  );
};
export default CurrencySelector;
