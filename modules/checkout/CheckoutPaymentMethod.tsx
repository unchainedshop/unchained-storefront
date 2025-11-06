import dynamic from 'next/dynamic';
import { useState } from 'react';
import { FormattedMessage, defineMessages, useIntl } from 'react-intl';
import useUpdateCartPayment from '../cart/hooks/useUpdateCartPayment';
import CryptopayCheckoutButton from './CryptopayCheckoutButton';
import InvoiceCheckoutButton from './InvoiceCheckoutButton';
import DatatransCheckoutButton from './DatatransCheckoutButton';
import PostfinancenCheckoutButton from './PostfinancenCheckoutButton';
import SaferpayCheckoutButton from './SaferpayCheckoutButton';
import PayrexxCheckoutButton from './PayrexxCheckoutButton';
import PaypalCheckoutButton from './PaypalCheckoutButton';

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
  'shop.unchained.payment.saferpay': SaferpayCheckoutButton,
  'shop.unchained.payment.payrexx': PayrexxCheckoutButton,
  'shop.unchained.payment.paypal': PaypalCheckoutButton,
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
  'shop.unchained.payment.saferpay': {
    id: 'shop.unchained.payment.saferpay-checkout',
    defaultMessage: 'Online Payment Gateway (Saferpay Checkout)',
  },
  'shop.unchained.payment.payrexx': {
    id: 'shop.unchained.payment.payrexx-checkout',
    defaultMessage: 'Online Payment Gateway (Payrexx Checkout)',
  },
  'shop.unchained.payment.paypal': {
    id: 'shop.unchained.payment.paypal-checkout',
    defaultMessage: 'Online Payment Gateway (Paypal Checkout)',
  },
});

const PaymentOption = ({ provider, selected, onSelect }) => {
  const { formatMessage } = useIntl();
  const label = PaymentLabels[provider.interface._id] || {
    id: provider.interface._id,
  };

  return (
    <div
      onClick={() => onSelect(provider._id)}
      className={`flex justify-between items-center p-5 rounded-xl cursor-pointer transition-all border shadow-sm hover:shadow-md ${
        selected
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 shadow-md'
          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900'
      }`}
    >
      <div className="flex items-center space-x-4">
        <input
          type="radio"
          name="paymentProviderId"
          checked={selected}
          onChange={() => onSelect(provider._id)}
          className="h-5 w-5 text-blue-600 focus:ring-blue-500"
          aria-checked={selected}
        />
        <span className="font-medium text-slate-800 dark:text-slate-200 text-base">
          <FormattedMessage {...label} />
        </span>
      </div>
      {selected && (
        <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
          {formatMessage({ id: 'selected', defaultMessage: 'Selected' })}
        </span>
      )}
    </div>
  );
};

const CheckoutPaymentMethod = ({
  cart,
  disabled = false,
  hideOptions = false,
}) => {
  const { updateCartPayment } = useUpdateCartPayment();
  const { formatMessage } = useIntl();
  const [selectedProvider, setSelectedProvider] = useState(
    cart.payment?.provider?._id,
  );

  const handleSelect = async (providerId) => {
    setSelectedProvider(providerId);
    try {
      await updateCartPayment({ paymentProviderId: providerId });
    } catch {
      setSelectedProvider(cart.payment?.provider?._id);
    }
  };
  const interfaceId = cart.payment?.provider?.interface?._id;
  const CheckoutButton = CheckoutButtons[interfaceId] ?? (() => null);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-md">
      <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-6">
        {formatMessage({
          id: 'payment-method',
          defaultMessage: 'Payment method',
        })}
      </h2>

      <div className="space-y-4">
        {!hideOptions &&
          cart.supportedPaymentProviders.map((provider) => (
            <PaymentOption
              key={provider._id}
              provider={provider}
              selected={selectedProvider === provider._id}
              onSelect={handleSelect}
            />
          ))}
      </div>

      {!disabled && (
        <div className="mt-6">
          <CheckoutButton order={cart} />
        </div>
      )}
    </div>
  );
};

export default CheckoutPaymentMethod;
