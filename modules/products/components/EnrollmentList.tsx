import React from 'react';
import Link from 'next/link';
import { useIntl } from 'react-intl';
import useFormatDateTime from '../../common/utils/useFormatDateTime';

const EnrollmentList = ({ enrollments }) => {
  const { formatMessage } = useIntl();
  const { formatDateTime } = useFormatDateTime();

  if (!enrollments?.length) {
    return (
      <div className="text-center text-gray-500 mt-10">
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
      className="space-y-6 mt-5 sm:px-6 lg:col-span-9 lg:col-start-4 lg:px-0"
      aria-labelledby="account-details-heading"
    >
      <h3
        id="account-details-heading"
        className="text-lg font-medium leading-6 text-slate-900 dark:text-white"
      >
        {formatMessage({
          id: 'subscriptions',
          defaultMessage: 'Subscriptions',
        })}
      </h3>
      {enrollments.map((enrollment) => {
        const { _id, enrollmentNumber, status, periods, plan, user } =
          enrollment;
        return (
          <Link key={_id} href={`/enrollment?_id=${_id}`}>
            <div className="flex justify-between items-center mb-2">
              <div>
                <p className="text-gray-500 text-sm">
                  {formatMessage({
                    id: 'enrollment.number',
                    defaultMessage: 'Enrollment:',
                  })}{' '}
                  <span className="font-medium">{enrollmentNumber || '—'}</span>
                </p>
                <p className="text-gray-700 font-semibold">
                  {user?.name || '—'}
                </p>
              </div>
              <span
                className={`px-3 py-1 text-sm rounded-full ${
                  status === 'ACTIVE'
                    ? 'bg-green-100 text-green-700'
                    : status === 'TERMINATED'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-gray-100 text-gray-500'
                }`}
              >
                {status}
              </span>
            </div>

            <div className="mb-2">
              <p className="text-gray-500 text-sm font-medium">
                {formatMessage({
                  id: 'plan.product',
                  defaultMessage: 'Product:',
                })}
              </p>
              {plan?.product ? (
                <Link
                  href={`/product/${plan.product.texts?.slug}`}
                  className="text-blue-600 hover:underline font-medium"
                >
                  {plan.product.texts?.title}
                </Link>
              ) : (
                <p className="text-gray-400">—</p>
              )}
            </div>

            <div>
              <p className="text-gray-500 text-sm font-medium">
                {formatMessage({
                  id: 'enrollment.periods',
                  defaultMessage: 'Enrollment Periods:',
                })}
              </p>
              <ul className="text-gray-700 ml-2 list-disc">
                {periods?.map((period, idx) => (
                  <li key={idx}>
                    {period.isTrial
                      ? `${formatMessage({ id: 'enrollment.trial', defaultMessage: 'Trial' })}: `
                      : `${formatMessage({ id: 'enrollment.active_period', defaultMessage: 'Active Period' })}: `}
                    {formatDateTime(period.start)} →{' '}
                    {formatDateTime(period.end)}
                  </li>
                ))}
              </ul>
            </div>
          </Link>
        );
      })}
    </section>
  );
};

export default EnrollmentList;
