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

export const PaymentLabels = defineMessages({
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
    <label
      className={`flex cursor-pointer items-center justify-between gap-4 rounded-lg border px-4 py-3.5 transition-colors ${
        selected
          ? 'border-primary bg-accent-soft ring-1 ring-primary'
          : 'border-input bg-surface hover:border-subtle-foreground'
      }`}
    >
      <span className="flex items-center gap-3">
        <input
          type="radio"
          name="paymentProviderId"
          checked={selected}
          onChange={() => onSelect(provider._id)}
          className="size-4 accent-primary"
        />
        <span className="text-sm font-medium">
          <FormattedMessage {...label} />
        </span>
      </span>
      {selected && (
        <span className="text-xs font-semibold text-accent">
          {formatMessage({ id: 'selected', defaultMessage: 'Selected' })}
        </span>
      )}
    </label>
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
    <div>
      <div className="space-y-3">
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
