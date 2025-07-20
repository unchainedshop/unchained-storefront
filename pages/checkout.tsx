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
      <div className="min-h-screen bg-white dark:bg-slate-950">
        <div className="container mx-auto py-8">
          <div className="mb-8">
            <h1 className="text-3xl tracking-tight text-slate-900 dark:text-white">
              {intl.formatMessage({
                id: 'checkout',
                defaultMessage: 'Checkout',
              })}
            </h1>
          </div>
          <Checkout />
        </div>
      </div>
    </>
  );
};

export default CheckoutPage;
