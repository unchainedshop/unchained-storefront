import { useIntl } from 'react-intl';

const tone = {
  PAID: 'badge-success',
  FULFILLED: 'badge-success',
  DELIVERED: 'badge-success',
  CONFIRMED: 'badge-accent',
  PROPOSED: 'badge-accent',
  REQUESTED: 'badge-warning',
  PROCESSING: 'badge-warning',
  PENDING: 'badge-warning',
  OPEN: 'badge-warning',
  REFUNDED: 'badge-warning',
  RETURNED: 'badge-warning',
  REJECTED: 'badge-danger',
  EXPIRED: 'badge-danger',
};

const OrderStatusBadge = ({ status }: { status?: string | null }) => {
  const { formatMessage } = useIntl();
  if (!status) return null;

  const labels = {
    OPEN: formatMessage({ id: 'status_open', defaultMessage: 'Open' }),
    PENDING: formatMessage({ id: 'status_pending', defaultMessage: 'Pending' }),
    CONFIRMED: formatMessage({ id: 'status_confirmed', defaultMessage: 'Confirmed' }),
    FULFILLED: formatMessage({ id: 'status_fulfilled', defaultMessage: 'Fulfilled' }),
    REJECTED: formatMessage({ id: 'status_rejected', defaultMessage: 'Rejected' }),
    PAID: formatMessage({ id: 'status_paid', defaultMessage: 'Paid' }),
    REFUNDED: formatMessage({ id: 'status_refunded', defaultMessage: 'Refunded' }),
    DELIVERED: formatMessage({ id: 'status_delivered', defaultMessage: 'Delivered' }),
    RETURNED: formatMessage({ id: 'status_returned', defaultMessage: 'Returned' }),
    REQUESTED: formatMessage({ id: 'status_requested', defaultMessage: 'Requested' }),
    PROCESSING: formatMessage({ id: 'status_processing', defaultMessage: 'In progress' }),
    PROPOSED: formatMessage({ id: 'status_proposed', defaultMessage: 'Offer ready' }),
    EXPIRED: formatMessage({ id: 'status_expired', defaultMessage: 'Expired' }),
  };

  return (
    <span className={`badge ${tone[status] || ''}`}>
      <span className="size-1.5 rounded-full bg-current" />
      {labels[status] || status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  );
};

export default OrderStatusBadge;
