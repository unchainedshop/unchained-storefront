import formatPrice from "../utils/formatPrice";
import useSupportedCurrencies from "../utils/useSupportedCurrencies";

const FormattedPrice = ({ price }) => {
  const { currencies } = useSupportedCurrencies();
  const currencyDefinition = currencies?.find(
    (currency) => currency.isoCode === price?.currencyCode,
  );
  if (!currencyDefinition) return <> {formatPrice(null)} </>;
  return (
    <> {formatPrice({ ...price, decimals: currencyDefinition?.decimals })} </>
  );
};

export default FormattedPrice;
