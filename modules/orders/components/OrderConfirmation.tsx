import { useState } from 'react';
import Link from 'next/link';
import { useIntl } from 'react-intl';
import {
  ArrowRightIcon,
  BanknotesIcon,
  CalendarDaysIcon,
  CheckIcon,
  ClipboardDocumentIcon,
  CreditCardIcon,
  EnvelopeIcon,
  TruckIcon,
} from '@heroicons/react/24/outline';

import OrderDetail from '../../checkout/OrderDetail';
import { useAppContext } from '../../common/components/AppContextWrapper';
import ConfettiCelebration from '../../common/components/ConfettiCelebration';
import AnimatedCheckmark from '../../common/components/AnimatedCheckmark';
import FadeInSection from '../../common/components/FadeInSection';
import FormattedPrice from '../../common/components/FormattedPrice';
import useFormatDateTime from '../../common/utils/useFormatDateTime';

const Fact = ({ icon: Icon, label, children }) => (
  <div className="flex items-start gap-3 rounded-xl border border-border bg-surface p-4">
    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent-foreground">
      <Icon className="size-5" />
    </span>
    <div className="min-w-0">
      <dt className="text-xs font-medium uppercase tracking-wider text-subtle-foreground">{label}</dt>
      <dd className="mt-0.5 truncate text-sm font-semibold">{children}</dd>
    </div>
  </div>
);

const OrderConfirmation = ({ order }) => {
  const { emailSupportDisabled } = useAppContext();
  const { formatMessage } = useIntl();
  const { formatDateTime } = useFormatDateTime();
  const [copied, setCopied] = useState(false);

  const firstName = order.billingAddress?.firstName;
  const email = order.contact?.emailAddress;
  const deliveryType = order.delivery?.provider?.type;
  const paymentLabel = order.payment?.provider?.interface?.label;

  const copyOrderNumber = async () => {
    await navigator.clipboard?.writeText(order.orderNumber || order._id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const steps = [
    {
      title: formatMessage({ id: 'next_step_received', defaultMessage: 'Order received' }),
      text: formatMessage({ id: 'next_step_received_text', defaultMessage: 'We have your order and payment details.' }),
      done: true,
    },
    {
      title: formatMessage({ id: 'next_step_processing', defaultMessage: 'Being prepared' }),
      text: formatMessage({ id: 'next_step_processing_text', defaultMessage: 'We pack your items with care.' }),
      done: Boolean(order.confirmed),
    },
    {
      title:
        deliveryType === 'PICKUP'
          ? formatMessage({ id: 'next_step_pickup', defaultMessage: 'Ready for pickup' })
          : formatMessage({ id: 'next_step_shipped', defaultMessage: 'On its way' }),
      text:
        deliveryType === 'PICKUP'
          ? formatMessage({ id: 'next_step_pickup_text', defaultMessage: 'We let you know when you can collect it.' })
          : formatMessage({ id: 'next_step_shipped_text', defaultMessage: 'You get tracking details as soon as it ships.' }),
      done: Boolean(order.fulfilled),
    },
  ];

  return (
    <>
      <ConfettiCelebration trigger={!!order} duration={3000} particleCount={80} />

      <div className="mx-auto max-w-4xl space-y-6">
        <FadeInSection className="print:hidden">
          <section className="relative isolate overflow-hidden rounded-2xl border border-border bg-surface px-6 py-12 text-center shadow-card sm:px-12">
            <div
              aria-hidden
              className="absolute inset-0 -z-10 bg-[radial-gradient(60%_80%_at_50%_0%,var(--success-soft),transparent),radial-gradient(40%_60%_at_100%_100%,var(--accent-soft),transparent)]"
            />
            <div className="flex justify-center">
              <AnimatedCheckmark size="lg" delay={300} />
            </div>
            <p className="mt-6 text-sm font-semibold uppercase tracking-widest text-success">
              {formatMessage({ id: 'order_confirmation', defaultMessage: 'Order Confirmation' })}
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              {firstName
                ? formatMessage({ id: 'thank_you_name', defaultMessage: 'Thank you, {name}!' }, { name: firstName })
                : formatMessage({ id: 'thank_you', defaultMessage: 'Thank you for your order!' })}
            </h1>
            <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
              {formatMessage({
                id: 'order_received_processing',
                defaultMessage: 'Your order has been received and is being processed.',
              })}
              {!emailSupportDisabled && email && (
                <>
                  {' '}
                  {formatMessage(
                    { id: 'confirmation_sent_to', defaultMessage: 'A confirmation is on its way to {email}.' },
                    { email: <strong key="email" className="font-medium text-foreground">{email}</strong> },
                  )}
                </>
              )}
            </p>

            <button
              type="button"
              onClick={copyOrderNumber}
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm transition-colors hover:border-input"
              aria-label={formatMessage({ id: 'copy_order_number', defaultMessage: 'Copy order number' })}
            >
              <span className="text-muted-foreground">
                {formatMessage({ id: 'order_number_short', defaultMessage: 'Order' })}
              </span>
              <span className="font-mono font-semibold">#{order.orderNumber || order._id}</span>
              {copied ? (
                <CheckIcon className="size-4 text-success" />
              ) : (
                <ClipboardDocumentIcon className="size-4 text-subtle-foreground" />
              )}
            </button>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/shop" className="btn btn-primary">
                {formatMessage({ id: 'continue_shopping', defaultMessage: 'Continue Shopping' })}
                <ArrowRightIcon className="size-4" />
              </Link>
            </div>
          </section>
        </FadeInSection>

        <FadeInSection delay={300} className="print:hidden">
          <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Fact icon={CalendarDaysIcon} label={formatMessage({ id: 'order_date', defaultMessage: 'Order date' })}>
              {formatDateTime(order.ordered || order.created, { dateStyle: 'medium' })}
            </Fact>
            <Fact icon={BanknotesIcon} label={formatMessage({ id: 'order_total', defaultMessage: 'Total' })}>
              <FormattedPrice price={order.total} />
            </Fact>
            <Fact icon={CreditCardIcon} label={formatMessage({ id: 'payment', defaultMessage: 'Payment' })}>
              {paymentLabel || order.payment?.provider?.type || '—'}
            </Fact>
            <Fact icon={deliveryType === 'PICKUP' ? EnvelopeIcon : TruckIcon} label={formatMessage({ id: 'delivery', defaultMessage: 'Delivery' })}>
              {deliveryType === 'PICKUP'
                ? formatMessage({ id: 'pickup', defaultMessage: 'Pickup' })
                : formatMessage({ id: 'shipping', defaultMessage: 'Shipping' })}
            </Fact>
          </dl>
        </FadeInSection>

        <FadeInSection delay={500} className="print:hidden">
          <section className="card p-6 sm:p-8">
            <h2 className="text-lg font-semibold">
              {formatMessage({ id: 'what_happens_next', defaultMessage: 'What happens next' })}
            </h2>
            <ol className="mt-6 grid gap-6 sm:grid-cols-3">
              {steps.map((step, index) => (
                <li key={step.title} className="relative flex gap-3 sm:flex-col">
                  {index < steps.length - 1 && (
                    <span
                      aria-hidden
                      className="absolute left-4 top-9 h-[calc(100%-1rem)] w-px bg-border sm:left-9 sm:top-4 sm:h-px sm:w-[calc(100%-1.5rem)]"
                    />
                  )}
                  <span
                    className={`relative flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                      step.done ? 'bg-success text-white' : 'border border-input bg-surface text-muted-foreground'
                    }`}
                  >
                    {step.done ? <CheckIcon className="size-4" /> : index + 1}
                  </span>
                  <div>
                    <p className="font-semibold">{step.title}</p>
                    <p className="mt-0.5 text-sm text-muted-foreground">{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        </FadeInSection>

        <FadeInSection delay={700}>
          <OrderDetail order={order} />
        </FadeInSection>
      </div>
    </>
  );
};

export default OrderConfirmation;
