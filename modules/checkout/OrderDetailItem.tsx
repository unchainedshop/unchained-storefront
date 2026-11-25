import { TruckIcon } from '@heroicons/react/24/outline';
import useFormatDateTime from '../common/utils/useFormatDateTime';
import getProductAvailability from '../products/utils/getProductAvailability';
import Link from 'next/link';
import { useIntl } from 'react-intl';
import FormattedPrice from '../common/components/FormattedPrice';
import ImageWithFallback from '../common/components/ImageWithFallback';
import getProductHref from '../common/utils/getProductHref';
import { PhotoIcon } from '@heroicons/react/20/solid';
import getEngineURL from '../common/utils/getEngineURL';

const OrderDetailItem = ({ item, delivered = false }) => {
  const { formatMessage } = useIntl();
  const engineURL = getEngineURL();
  const printTicketUrl = item?.tokens?.length
    ? `${engineURL.origin}/rest/print_tickets/?orderId=${item?.order?._id}&otp=not-needed`
    : null;
  const title = item?.product?.texts?.title || item?.product?.texts?.subtitle;
  const { formatDateTime } = useFormatDateTime();
  const { earliestDelivery } = getProductAvailability({ simulatedDispatches: item?.dispatches });
  const expectedDelivery = !delivered && earliestDelivery;
  return (
    <li className="flex items-center gap-4 py-4">
      <Link
        href={getProductHref(item.product.texts.slug)}
        className="flex min-w-0 flex-1 items-center gap-4"
      >
        <span className="relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted">
          {item.product?.media?.length ? (
            <ImageWithFallback
              src={`${item.product?.media[0].file.url}`}
              alt={title}
              className="size-full object-cover"
              width={64}
              height={64}
            />
          ) : (
            <PhotoIcon className="size-7 text-subtle-foreground" />
          )}
        </span>
        <span className="min-w-0">
          {item?.product?.texts?.brand && (
            <span className="block text-xs uppercase tracking-wider text-subtle-foreground">
              {item.product.texts.brand}
            </span>
          )}
          <span className="block truncate text-sm font-medium text-foreground hover:text-accent">
            {title}
          </span>
          <span className="mt-0.5 block text-xs text-muted-foreground">
            {item?.quantity} × <FormattedPrice price={item?.unitPrice} />
          </span>
          {expectedDelivery && (
            <span className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
              <TruckIcon className="size-3.5" />
              {formatMessage(
                { id: 'availability_delivery_by', defaultMessage: 'Arrives by {date}' },
                { date: formatDateTime(expectedDelivery, { weekday: 'short', day: 'numeric', month: 'short' }) },
              )}
            </span>
          )}
        </span>
      </Link>

      <div className="flex flex-col items-end gap-2">
        <span className="text-sm font-semibold">
          <FormattedPrice price={item?.total || item?.unitPrice} />
        </span>
        {printTicketUrl && (
          <a href={printTicketUrl} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm print:hidden">
            {formatMessage({ id: 'print_tickets', defaultMessage: 'Print Tickets' })}
          </a>
        )}
      </div>
    </li>
  );
};

export default OrderDetailItem;
