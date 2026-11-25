import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useIntl, FormattedMessage } from 'react-intl';
import { CreditCardIcon, PlusIcon } from '@heroicons/react/24/outline';
import AccountLayout from '../../modules/auth/components/AccountLayout';
import useUser from '../../modules/auth/hooks/useUser';
import usePaymentCredentials from '../../modules/checkout/hooks/usePaymentCredentials';
import { PaymentLabels } from '../../modules/checkout/CheckoutPaymentMethod';
import EmptyState from '../../modules/common/components/EmptyState';
import Loading from '../../modules/common/components/Loading';
import MetaTags from '../../modules/common/components/MetaTags';

// Payment interfaces whose credentials can be registered outside of checkout.
const RegistrationForms = {
  'shop.unchained.payment.stripe': dynamic(() => import('../../modules/checkout/StripeAddPaymentMethod'), {
    ssr: false,
  }),
};

const ProviderLabel = ({ provider }) => {
  const label = PaymentLabels[provider?.interface?._id];
  return label ? <FormattedMessage {...label} /> : <>{provider?.interface?.label || provider?.type}</>;
};

const PaymentMethodsPage = () => {
  const { formatMessage } = useIntl();
  const { cart } = useUser();
  const { paymentCredentials, loading, markPreferred, remove } = usePaymentCredentials();
  const [adding, setAdding] = useState<string | null>(null);
  const registrableProviders = (cart?.supportedPaymentProviders || []).filter(
    (provider) => RegistrationForms[provider.interface?._id],
  );
  const AddForm = adding
    ? RegistrationForms[registrableProviders.find((p) => p._id === adding)?.interface?._id]
    : null;

  const title = formatMessage({ id: 'payment_methods', defaultMessage: 'Payment methods' });

  return (
    <>
      <MetaTags title={title} />
      <AccountLayout
        title={title}
        actions={
          !adding &&
          registrableProviders.map((provider) => (
            <button key={provider._id} type="button" className="btn btn-secondary btn-sm" onClick={() => setAdding(provider._id)}>
              <PlusIcon className="size-4" />
              {formatMessage({ id: 'add_payment_method', defaultMessage: 'Add' })} <ProviderLabel provider={provider} />
            </button>
          ))
        }
      >
        {AddForm && (
          <div className="card mb-6 p-5 sm:p-6">
            <AddForm paymentProviderId={adding} onDone={() => setAdding(null)} />
          </div>
        )}

        {loading ? (
          <Loading />
        ) : !paymentCredentials.length ? (
          <EmptyState
            icon={CreditCardIcon}
            title={formatMessage({ id: 'payment_methods_empty', defaultMessage: 'No saved payment methods' })}
            description={formatMessage({
              id: 'payment_methods_empty_text',
              defaultMessage: 'Save a payment method to check out faster next time.',
            })}
          />
        ) : (
          <ul className="space-y-3">
            {paymentCredentials.map((credentials) => (
              <li key={credentials._id} className="card flex flex-wrap items-center gap-4 p-4 sm:p-5">
                <span className="flex size-11 items-center justify-center rounded-lg bg-accent-soft text-accent-foreground">
                  <CreditCardIcon className="size-6" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-medium">
                    <ProviderLabel provider={credentials.paymentProvider} />
                  </p>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {credentials.isPreferred && (
                      <span className="badge badge-accent">
                        {formatMessage({ id: 'preferred', defaultMessage: 'Preferred' })}
                      </span>
                    )}
                    {!credentials.isValid && (
                      <span className="badge badge-danger">
                        {formatMessage({ id: 'payment_method_invalid', defaultMessage: 'Needs attention' })}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  {!credentials.isPreferred && (
                    <button type="button" className="btn btn-secondary btn-sm" onClick={() => markPreferred(credentials._id)}>
                      {formatMessage({ id: 'make_preferred', defaultMessage: 'Make preferred' })}
                    </button>
                  )}
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm text-danger"
                    onClick={() => {
                      if (window.confirm(formatMessage({ id: 'remove_payment_method_confirm', defaultMessage: 'Remove this payment method?' })))
                        remove(credentials._id);
                    }}
                  >
                    {formatMessage({ id: 'remove', defaultMessage: 'Remove' })}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </AccountLayout>
    </>
  );
};

export default PaymentMethodsPage;
