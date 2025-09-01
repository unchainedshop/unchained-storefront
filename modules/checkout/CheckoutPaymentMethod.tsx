import dynamic from 'next/dynamic';

import { FormattedMessage, defineMessages, useIntl } from 'react-intl';
import CryptopayCheckoutButton from './CryptopayCheckoutButton';
import InvoiceCheckoutButton from './InvoiceCheckoutButton';
import DatatransCheckoutButton from './DatatransCheckoutButton';
import PostfinancenCheckoutButton from './PostfinancenCheckoutButton';
import useUpdateCartPayment from '../cart/hooks/useUpdateCartPayment';

const StripeCheckoutButton = dynamic(() => import('./StripeCheckoutButton'), {
  ssr: false,
});

const CheckoutButtons = {
  'shop.unchained.payment.cryptopay': CryptopayCheckoutButton,
  'shop.unchained.invoice': InvoiceCheckoutButton,
  'shop.unchained.invoice-prepaid': InvoiceCheckoutButton,
  'shop.unchained.datatrans': DatatransCheckoutButton,
  'shop.unchained.payment.stripe': StripeCheckoutButton,
  'shop.unchained.payment.postfinance-checkout': PostfinancenCheckoutButton,
};

const PaymentLabels = defineMessages({
  'shop.unchained.payment.cryptopay': {
    id: 'shop.unchained.payment.cryptopay',
    defaultMessage: 'Cryptocurrencies',
  },
  'shop.unchained.invoice': {
    id: 'shop.unchained.invoice',
    defaultMessage: 'Invoice Post-Paid',
  },
  'shop.unchained.invoice-prepaid': {
    id: 'shop.unchained.invoice-prepaid',
    defaultMessage: 'Invoice Pre-Paid',
  },
  'shop.unchained.datatrans': {
    id: 'shop.unchained.datatrans',
    defaultMessage: 'Online Payment Gateway (Datatrans)',
  },
  'shop.unchained.payment.stripe': {
    id: 'shop.unchained.payment.stripe',
    defaultMessage: 'Online Payment Gateway (Stripe)',
  },
  'shop.unchained.payment.postfinance-checkout': {
    id: 'shop.unchained.payment.postfinance-checkout',
    defaultMessage: 'Online Payment Gateway (Postfinance Checkout)',
  },
});

const CheckoutPaymentMethod = ({ cart, disabled = false }) => {
  const { updateCartPayment } = useUpdateCartPayment();
  const { formatMessage } = useIntl();

  const setPaymentProvider = async (event) => {
    const formData = new FormData(event.target.form);
    const paymentProviderId = formData.get('paymentProviderId');
    try {
      await updateCartPayment({
        paymentProviderId,
      });
    } catch (e) {
      event.target.form.reset();
    }
  };

  const interfaceId = cart.payment?.provider?.interface?._id;
  const CheckoutButton = CheckoutButtons[interfaceId] ?? (() => null);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-lg p-6 border border-slate-200 dark:border-0">
      <h2 className="text-lg font-medium text-slate-900 dark:text-white mb-4">
        {formatMessage({
          id: 'payment-method',
          defaultMessage: 'Payment method',
        })}
      </h2>
      <form>
        <div className="space-y-4">
          {cart.supportedPaymentProviders.map((provider) => (
            <div className="flex items-center" key={provider._id}>
              <input
                type="radio"
                id={provider._id}
                name="paymentProviderId"
                value={provider._id}
                defaultChecked={cart.payment?.provider?._id === provider._id}
                onChange={setPaymentProvider}
                className="h-4 w-4 border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <label
                htmlFor={provider._id}
                className="ml-3 block text-sm font-medium text-slate-900 dark:text-white"
              >
                <FormattedMessage
                  {...(PaymentLabels[provider.interface._id] || {
                    id: provider.interface._id,
                  })}
                />
              </label>
            </div>
          ))}
        </div>
      </form>
      {!disabled && <CheckoutButton order={cart} />}
    </div>
  );
};

export default CheckoutPaymentMethod;
