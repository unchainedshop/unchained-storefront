import Link from 'next/link';
import classNames from 'classnames';
import { useIntl } from 'react-intl';
import {
  ArrowPathIcon,
  CheckIcon,
  CreditCardIcon,
  MapPinIcon,
  PrinterIcon,
  TruckIcon,
  UserIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import OrderDetailItem from './OrderDetailItem';
import useAddMultipleCartProducts from '../cart/hooks/useAddMultipleCartProducts';
import { useAppContext } from '../common/components/AppContextWrapper';
import OrderDetailBilling from './OrderDetailBilling';
import OrderStatusBadge from '../orders/components/OrderStatusBadge';
import FormattedPrice from '../common/components/FormattedPrice';
import useFormatDateTime from '../common/utils/useFormatDateTime';
import { getInterfaceLabel } from '../common/utils/utils';

const Panel = ({ icon: Icon = null, title, aside = null, children }) => (
  <section className="card p-5 sm:p-6">
    <div className="mb-4 flex items-center justify-between gap-3">
      <h2 className="flex items-center gap-2 text-base font-semibold">
        {Icon && <Icon className="size-5 text-subtle-foreground" />}
        {title}
      </h2>
      {aside}
    </div>
    {children}
  </section>
);

const Address = ({ address, country = null }) =>
  address ? (
    <address className="text-sm not-italic leading-relaxed text-muted-foreground">
      <span className="block font-medium text-foreground">
        {[address.firstName, address.lastName].filter(Boolean).join(' ')}
      </span>
      {address.company && <span className="block">{address.company}</span>}
      <span className="block">{address.addressLine}</span>
      {address.addressLine2 && <span className="block">{address.addressLine2}</span>}
      <span className="block">
        {[address.postalCode, address.city].filter(Boolean).join(' ')}
      </span>
      {country && (
        <span className="block">
          {country.flagEmoji} {country.name}
        </span>
      )}
    </address>
  ) : null;

const OrderDetail = ({ order }) => {
  const { formatMessage } = useIntl();
  const { formatDateTime } = useFormatDateTime();
  const { addMultipleCartProducts, loading: adding } = useAddMultipleCartProducts();
  const { toggleCart } = useAppContext();
  if (!order) return null;

  const buyAgain = async () => {
    await addMultipleCartProducts(
      (order.items || []).map((item) => ({ productId: item.product?._id, quantity: item.quantity })),
    );
    toggleCart(true);
  };

  const date = (value) => (value ? formatDateTime(value, { dateStyle: 'medium', timeStyle: 'short' }) : null);
  const rejected = order.status === 'REJECTED';
  const delivery = order.delivery;
  const shippingAddress = delivery && 'address' in delivery ? delivery.address : null;
  const pickUpLocation = delivery && 'activePickUpLocation' in delivery ? delivery.activePickUpLocation : null;

  const steps = [
    { label: formatMessage({ id: 'status_placed', defaultMessage: 'Placed' }), at: order.ordered || order.created, done: true },
    rejected
      ? { label: formatMessage({ id: 'status_rejected', defaultMessage: 'Rejected' }), at: order.updated, done: true, failed: true }
      : { label: formatMessage({ id: 'status_confirmed', defaultMessage: 'Confirmed' }), at: order.confirmed, done: Boolean(order.confirmed) },
    ...(rejected
      ? []
      : [{ label: formatMessage({ id: 'status_fulfilled', defaultMessage: 'Fulfilled' }), at: order.fulfilled, done: Boolean(order.fulfilled) }]),
  ];
  const doneCount = steps.filter((s) => s.done).length;

  return (
    <div className="space-y-6">
      <section className="card overflow-hidden">
        <div className="flex flex-col gap-4 border-b border-border p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight">
                {formatMessage({ id: 'order_number_heading', defaultMessage: 'Order #{number}' }, { number: order.orderNumber || order._id })}
              </h1>
              <OrderStatusBadge status={order.status} />
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {formatMessage({ id: 'order_placed_on', defaultMessage: 'Placed on {date}' }, { date: date(order.ordered || order.created) })}
              {' · '}
              {formatMessage(
                { id: 'item_count', defaultMessage: '{count, plural, one {# item} other {# items}}' },
                { count: order.items?.reduce((acc, item) => acc + item.quantity, 0) || 0 },
              )}
            </p>
          </div>
          <div className="flex gap-2 print:hidden">
            <button type="button" disabled={adding} onClick={buyAgain} className="btn btn-primary btn-sm">
              <ArrowPathIcon className="size-4" />
              {formatMessage({ id: 'buy_again', defaultMessage: 'Buy again' })}
            </button>
            <button type="button" onClick={() => window.print()} className="btn btn-secondary btn-sm">
              <PrinterIcon className="size-4" />
              {formatMessage({ id: 'print_button', defaultMessage: 'Print' })}
            </button>
            <Link href="/orders" className="btn btn-ghost btn-sm">
              {formatMessage({ id: 'all_orders', defaultMessage: 'All orders' })}
            </Link>
          </div>
        </div>

        <ol className="grid gap-4 p-5 sm:grid-cols-3 sm:p-6" aria-label={formatMessage({ id: 'order_status', defaultMessage: 'Order status' })}>
          {steps.map((step, index) => (
            <li key={step.label} className="flex items-center gap-3 sm:flex-col sm:items-start">
              <div className="flex items-center gap-2 sm:w-full">
                <span
                  className={classNames(
                    'flex size-8 shrink-0 items-center justify-center rounded-full',
                    step.failed
                      ? 'bg-danger text-white'
                      : step.done
                        ? 'bg-success text-white'
                        : 'border border-input bg-surface text-subtle-foreground',
                  )}
                >
                  {step.failed ? <XMarkIcon className="size-4" /> : step.done ? <CheckIcon className="size-4" /> : index + 1}
                </span>
                {index < steps.length - 1 && (
                  <span
                    className={classNames('hidden h-0.5 flex-1 rounded-full sm:block', index + 1 < doneCount ? 'bg-success' : 'bg-border')}
                  />
                )}
              </div>
              <div>
                <p className="text-sm font-semibold">{step.label}</p>
                <p className="text-xs text-muted-foreground">{step.done ? date(step.at) : '—'}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="min-w-0 space-y-6">
          <Panel
            title={formatMessage({ id: 'order_items', defaultMessage: 'Order Items' })}
            aside={<span className="text-sm text-muted-foreground">{order.items?.length}</span>}
          >
            <ul className="-my-4 divide-y divide-border">
              {order.items?.map((item) => (
                <OrderDetailItem key={item._id} item={item} delivered={Boolean(delivery?.delivered) || order.status === 'FULFILLED' || rejected} />
              ))}
            </ul>
          </Panel>
          <Panel icon={UserIcon} title={formatMessage({ id: 'customer', defaultMessage: 'Customer' })}>
            <div className="space-y-3">
              {(order.contact?.emailAddress || order.contact?.telNumber) && (
                <p className="text-sm text-muted-foreground">
                  {order.contact?.emailAddress && <span className="block">{order.contact.emailAddress}</span>}
                  {order.contact?.telNumber && <span className="block">{order.contact.telNumber}</span>}
                </p>
              )}
              <div>
                <p className="mb-1 text-xs font-medium uppercase tracking-wider text-subtle-foreground">
                  {formatMessage({ id: 'billing_address', defaultMessage: 'Billing address' })}
                </p>
                <Address address={order.billingAddress} country={order.country} />
              </div>
            </div>
          </Panel>
        </div>

        <div className="min-w-0 space-y-6">
          <Panel title={formatMessage({ id: 'order_summary', defaultMessage: 'Order Summary' })}>
            <OrderDetailBilling order={order} />
          </Panel>

          <Panel icon={TruckIcon} title={formatMessage({ id: 'delivery', defaultMessage: 'Delivery' })} aside={<OrderStatusBadge status={delivery?.status} />}>
            <div className="space-y-3 text-sm">
              <p className="font-medium">
                {delivery?.provider?.interface?.label || getInterfaceLabel(delivery?.provider?.interface)}
                {delivery?.fee?.amount ? (
                  <span className="ml-2 font-normal text-muted-foreground">
                    · <FormattedPrice price={delivery.fee} />
                  </span>
                ) : null}
              </p>
              {shippingAddress && <Address address={shippingAddress} />}
              {pickUpLocation && (
                <p className="flex items-center gap-2 text-muted-foreground">
                  <MapPinIcon className="size-4" />
                  {pickUpLocation.name}
                </p>
              )}
              {delivery?.delivered && (
                <p className="text-xs text-subtle-foreground">
                  {formatMessage({ id: 'delivered_on_date', defaultMessage: 'Delivered on {date}' }, { date: date(delivery.delivered) })}
                </p>
              )}
            </div>
          </Panel>

          <Panel icon={CreditCardIcon} title={formatMessage({ id: 'payment', defaultMessage: 'Payment' })} aside={<OrderStatusBadge status={order.payment?.status} />}>
            <div className="space-y-1 text-sm">
              <p className="font-medium">{order.payment?.provider?.interface?.label || getInterfaceLabel(order.payment?.provider?.interface)}</p>
              {order.payment?.paid && (
                <p className="text-xs text-subtle-foreground">
                  {formatMessage({ id: 'paid_on_date', defaultMessage: 'Paid on {date}' }, { date: date(order.payment.paid) })}
                </p>
              )}
            </div>
          </Panel>

        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
