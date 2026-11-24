import React from 'react';
import Link from 'next/link';
import { useIntl } from 'react-intl';
import useFormatDateTime from '../../common/utils/useFormatDateTime';

const EnrollmentList = ({ enrollments }) => {
  const { formatMessage } = useIntl();
  const { formatDateTime } = useFormatDateTime();

  if (!enrollments?.length) {
    return (
      <div className="text-center text-subtle-foreground mt-10">
        {formatMessage({
          id: 'enrollments.empty',
          defaultMessage: 'No enrollments found.',
        })}
      </div>
    );
  }
  return (
    <section
      id="subscriptions-view"
      className="space-y-4"
          >
      {enrollments.map((enrollment) => {
        const { _id, enrollmentNumber, status, periods, plan, user, expires } =
          enrollment;
        return (
          <div key={enrollment._id} className="card p-5">
            <div className="flex justify-between items-center mb-2">
              <div>
                <Link
                  key={_id}
                  className="text-accent hover:underline font-medium"
                  href={`/enrollment?_id=${_id}`}
                >
                  <p>
                    {formatMessage({
                      id: 'subscription_number',
                      defaultMessage: 'Subscription:',
                    })}{' '}
                    <span className="font-medium">
                      {enrollmentNumber || '—'}
                    </span>
                  </p>
                </Link>
                <p className="text-muted-foreground font-semibold">
                  {user?.name || '—'}
                </p>
              </div>
              <span
                className={`px-3 py-1 text-sm rounded-full ${
                  status === 'ACTIVE'
                    ? 'bg-success-soft text-success'
                    : status === 'TERMINATED'
                      ? 'bg-danger-soft text-danger'
                      : 'bg-muted text-subtle-foreground'
                }`}
              >
                {status}
                {status !== 'TERMINATED' && expires && (
                  <span className="ml-2">
                    {formatMessage(
                      {
                        id: 'subscription_ends_on',
                        defaultMessage: 'ends {date}',
                      },
                      { date: formatDateTime(expires) },
                    )}
                  </span>
                )}
              </span>
            </div>

            <div className="mb-2">
              <p className="text-subtle-foreground text-sm font-medium">
                {formatMessage({
                  id: 'product',
                  defaultMessage: 'Product',
                })}
                :
              </p>
              {plan?.product ? (
                <Link
                  href={`/product/${plan.product.texts?.slug}`}
                  className="text-accent hover:underline font-medium"
                >
                  {plan.product.texts?.title}
                </Link>
              ) : (
                <p className="text-subtle-foreground">—</p>
              )}
            </div>

            <div>
              <p className="text-subtle-foreground text-sm font-medium">
                {formatMessage({
                  id: 'enrollment_periods',
                  defaultMessage: 'Enrollment Periods:',
                })}
              </p>
              <ul className="text-muted-foreground ml-2 list-disc">
                {periods?.map((period, idx) => (
                  <li key={`${idx}${period.start}`}>
                    {period.isTrial
                      ? `${formatMessage({ id: 'enrollment_trial', defaultMessage: 'Trial' })}: `
                      : `${formatMessage({ id: 'enrollment_active_period', defaultMessage: 'Active Period' })}: `}
                    {formatDateTime(period.start)} →{' '}
                    {formatDateTime(period.end)}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      })}
    </section>
  );
};

export default EnrollmentList;
