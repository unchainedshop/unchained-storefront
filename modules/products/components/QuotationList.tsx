import { useState } from 'react';
import FormattedPrice from '../../common/components/FormattedPrice';
import OrderStatusBadge from '../../orders/components/OrderStatusBadge';
import { useAppContext } from '../../common/components/AppContextWrapper';
import getMediaUrl from '../../common/utils/getMediaUrl';
import getProductHref from '../../common/utils/getProductHref';
import useAnswerQuotation from '../hooks/useAnswerQuotation';
import EmptyState from '../../common/components/EmptyState';
import { DocumentTextIcon } from '@heroicons/react/24/outline';
import React from 'react';
import Link from 'next/link';
import { useIntl } from 'react-intl';
import useFormatDateTime from '../../common/utils/useFormatDateTime';

const QuotationCard = ({ quotation: q }) => {
  const { formatDateTime } = useFormatDateTime();
  const { formatMessage } = useIntl();
  const { toggleCart } = useAppContext();
  const { acceptQuotation, rejectQuotation } = useAnswerQuotation();
  const [busy, setBusy] = useState(false);
  const imageUrl = getMediaUrl(q.product);
  const canAnswer = q.status === 'PROPOSED' && !q.isExpired;

  const answer = async (action) => {
    setBusy(true);
    try {
      await action();
    } finally {
      setBusy(false);
    }
  };

  const facts = [
    [formatMessage({ id: 'quotation_created', defaultMessage: 'Requested' }), formatDateTime(q.created, { dateStyle: 'medium' })],
    q.quantity ? [formatMessage({ id: 'quantity', defaultMessage: 'Quantity' }), q.quantity] : null,
    q.expires ? [formatMessage({ id: 'quotation_expires', defaultMessage: 'Valid until' }), formatDateTime(q.expires, { dateStyle: 'medium' })] : null,
    q.price ? [formatMessage({ id: 'quotation_offer', defaultMessage: 'Offer' }), <FormattedPrice key="price" price={q.price} />] : null,
  ].filter(Boolean);

  return (
    <li className="card overflow-hidden">
      <div className="flex gap-4 p-5">
        <Link
          href={getProductHref(q.product?.texts?.slug)}
          className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted"
        >
          {imageUrl ? (
            <img src={imageUrl} alt="" className="size-full object-cover" />
          ) : (
            <DocumentTextIcon className="size-7 text-subtle-foreground" />
          )}
        </Link>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <Link href={getProductHref(q.product?.texts?.slug)} className="font-semibold hover:text-accent">
                {q.product?.texts?.title}
              </Link>
              <p className="text-xs text-subtle-foreground">
                {formatMessage(
                  { id: 'quotation_number_heading', defaultMessage: 'Quote #{number}' },
                  { number: q.quotationNumber || q._id.slice(-6) },
                )}
              </p>
            </div>
            <OrderStatusBadge status={q.isExpired && q.status === 'PROPOSED' ? 'EXPIRED' : q.status} />
          </div>
          <dl className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 text-sm sm:grid-cols-4">
            {facts.map(([label, value]) => (
              <div key={label as string}>
                <dt className="text-xs text-subtle-foreground">{label}</dt>
                <dd className="font-medium">{value}</dd>
              </div>
            ))}
          </dl>
          {q.configuration?.length > 0 && (
            <details className="mt-3 text-sm">
              <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                {formatMessage({ id: 'quotation_your_request', defaultMessage: 'Your request' })}
              </summary>
              <dl className="mt-2 space-y-1 text-muted-foreground">
                {q.configuration.map((conf) => (
                  <div key={conf.key} className="flex gap-2">
                    <dt className="font-medium capitalize">{conf.key}:</dt>
                    <dd>{conf.value}</dd>
                  </div>
                ))}
              </dl>
            </details>
          )}
        </div>
      </div>
      {canAnswer && (
        <div className="flex flex-wrap items-center justify-end gap-2 border-t border-border bg-accent-soft/40 px-5 py-3">
          <p className="mr-auto text-sm text-muted-foreground">
            {formatMessage({ id: 'quotation_offer_ready', defaultMessage: 'Your offer is ready.' })}
          </p>
          <button
            type="button"
            disabled={busy}
            onClick={() =>
              window.confirm(formatMessage({ id: 'quotation_decline_confirm', defaultMessage: 'Decline this offer?' })) &&
              answer(() => rejectQuotation(q._id))
            }
            className="btn btn-ghost btn-sm"
          >
            {formatMessage({ id: 'quotation_decline', defaultMessage: 'Decline' })}
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() =>
              answer(async () => {
                await acceptQuotation(q._id);
                toggleCart(true);
              })
            }
            className="btn btn-primary btn-sm"
          >
            {formatMessage({ id: 'quotation_accept', defaultMessage: 'Accept and add to cart' })}
          </button>
        </div>
      )}
    </li>
  );
};

const QuotationList = ({ quotations }) => {
  const { formatMessage } = useIntl();

  if (!quotations?.length)
    return (
      <EmptyState icon={DocumentTextIcon} title={formatMessage({ id: 'quotations_empty', defaultMessage: 'No quotation requests yet' })} description={formatMessage({ id: 'quotations_empty_text', defaultMessage: 'Request a quote on a product page and track it here.' })}>
        <Link href="/shop" className="btn btn-secondary">
          {formatMessage({ id: 'continue_shopping', defaultMessage: 'Continue Shopping' })}
        </Link>
      </EmptyState>
    );

  return (
    <ul className="space-y-4">
      {quotations.map((q) => (
        <QuotationCard key={q._id} quotation={q} />
      ))}
    </ul>
  );
};

export default QuotationList;
