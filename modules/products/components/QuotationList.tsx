import React from 'react';
import Link from 'next/link';
import { useIntl } from 'react-intl';
import useFormatDateTime from '../../common/utils/useFormatDateTime';

const QuotationList = ({ quotations }) => {
  const { formatDateTime } = useFormatDateTime();
  const { formatMessage } = useIntl();

  if (!quotations?.length)
    return (
      <div className="text-center text-subtle-foreground mt-10">
        {formatMessage({
          id: 'quotation_list_empty',
          defaultMessage: 'No quotations found.',
        })}
      </div>
    );

  return (
    <section
      id="quotations-view"
      className="space-y-6 mt-5 sm:px-6 lg:col-span-9 lg:col-start-4 lg:px-0"
      aria-labelledby="account-details-heading"
    >
      <div className="max-w-5xl mx-auto mt-6">
        <h2 className="text-2xl font-semibold text-foreground mb-4">
          {formatMessage({
            id: 'quotation_list_title',
            defaultMessage: 'Quotation Requests',
          })}
        </h2>

        <div className="grid gap-4">
          {quotations.map((q) => {
            const createdAt = q.created ? formatDateTime(q.created) : '—';
            const expiresAt = q.expires ? formatDateTime(q.expires) : null;
            const statusColor =
              q.status === 'REQUESTED'
                ? 'bg-accent-soft text-accent'
                : q.status === 'REJECTED'
                  ? 'bg-danger-soft text-danger'
                  : q.status === 'FULFILLED'
                    ? 'bg-success-soft text-success'
                    : 'bg-muted text-subtle-foreground';

            return (
              <div
                key={q._id}
                className="bg-surface shadow-md rounded-2xl p-5 border border-border hover:shadow-lg transition"
              >
                <div className="flex justify-between items-center mb-3">
                  <div className="flex flex-col">
                    <Link
                      href={`/product/${q.product?.texts?.slug}`}
                      className="text-lg font-semibold text-accent hover:underline"
                    >
                      {q.product?.texts?.title || 'Untitled Product'}
                    </Link>
                    <Link
                      href={`/quotation/${q._id}`}
                      className="text-lg font-semibold text-accent hover:underline"
                    >
                      <>
                        {formatMessage({
                          id: 'quotation_number',
                          defaultMessage: 'Quotation ID:',
                        })}{' '}
                        {q.quotationNumber || q._id.slice(-6)}
                      </>
                    </Link>
                  </div>

                  <span
                    className={`px-3 py-1 text-xs rounded-full font-semibold ${statusColor}`}
                  >
                    {q.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                  <p className="font-medium text-subtle-foreground">
                    {formatMessage({
                      id: 'quotation_user',
                      defaultMessage: 'Requested By:',
                    })}
                  </p>
                  <p>{q.user?.name || 'Anonymous'}</p>

                  <p className="font-medium text-subtle-foreground">
                    {formatMessage({
                      id: 'quotation_email',
                      defaultMessage: 'Email:',
                    })}
                  </p>
                  <p>{q.user?.primaryEmail?.address || '—'}</p>

                  <p className="font-medium text-subtle-foreground">
                    {formatMessage({
                      id: 'quotation_created',
                      defaultMessage: 'Created:',
                    })}
                  </p>
                  <p>{createdAt}</p>

                  <p className="font-medium text-subtle-foreground">
                    {formatMessage({
                      id: 'quotation_currency',
                      defaultMessage: 'Currency:',
                    })}
                  </p>
                  <p>{q.currency?.isoCode}</p>

                  {expiresAt && (
                    <>
                      <p className="font-medium text-subtle-foreground">
                        {formatMessage({
                          id: 'quotation_expires',
                          defaultMessage: 'Expires:',
                        })}
                      </p>
                      <p>{expiresAt}</p>
                    </>
                  )}
                </div>
                {q?.configuration?.length > 0 && (
                  <div className="mt-4 border-t pt-3">
                    <h3 className="text-sm font-semibold text-muted-foreground mb-1 w-100">
                      Dialog
                    </h3>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {q.configuration.map((conf, idx) => (
                        <li key={idx}>
                          <span className="font-medium">{conf.key}:</span>{' '}
                          {conf.value}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default QuotationList;
