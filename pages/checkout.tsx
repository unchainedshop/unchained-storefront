import { useIntl } from 'react-intl';
import Checkout from '../modules/checkout/Checkout';

import MetaTags from '../modules/common/components/MetaTags';

const CheckoutPage = () => {
  const intl = useIntl();

  return (
    <>
      <MetaTags
        title={intl.formatMessage({
          id: 'checkout',
          defaultMessage: 'Checkout',
        })}
      />
      <h1 className="mb-8 text-3xl font-bold tracking-tight">
        {intl.formatMessage({ id: 'checkout', defaultMessage: 'Checkout' })}
      </h1>
      <Checkout />
    </>
  );
};

export default CheckoutPage;
