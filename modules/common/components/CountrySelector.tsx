import { useApolloClient } from '@apollo/client/react';
import { useIntl } from 'react-intl';
import useCountries from '../hooks/useCountries';
import { useAppContext } from './AppContextWrapper';

const CountrySelector = ({ className = '' }) => {
  const { countries } = useCountries();
  const { selectedCountry, changeCountry, changeCurrency } = useAppContext();
  const { formatMessage } = useIntl();
  const client = useApolloClient();
  if (countries.length < 2) return null;

  const current = selectedCountry || countries.find((country) => country.isBase)?.isoCode || countries[0]?.isoCode;

  const onChange = async (isoCode: string) => {
    changeCountry(isoCode);
    const defaultCurrency = countries.find((country) => country.isoCode === isoCode)?.defaultCurrency?.isoCode;
    if (defaultCurrency) changeCurrency(defaultCurrency);
    // Prices, taxes and delivery options depend on the country header.
    await client.refetchQueries({ include: 'active' });
  };

  return (
    <select
      aria-label={formatMessage({ id: 'shipping_country', defaultMessage: 'Shipping country' })}
      className={`input w-auto py-1.5 pr-8 text-sm ${className}`}
      value={current}
      onChange={(e) => onChange(e.target.value)}
    >
      {countries.map((country) => (
        <option key={country._id} value={country.isoCode}>
          {country.flagEmoji} {country.name || country.isoCode}
        </option>
      ))}
    </select>
  );
};

export default CountrySelector;
