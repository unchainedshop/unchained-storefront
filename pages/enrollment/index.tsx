import { useRouter } from 'next/router';
import React from 'react';
import useEnrollment from '../../modules/products/hooks/useEnrollment';
import Loading from '../../modules/common/components/Loading';
import useFormatDateTime from '../../modules/common/utils/useFormatDateTime';
import useTerminateEnrollment from '../../modules/products/hooks/useTerminateEnrollment';
import useActivateEnrollment from '../../modules/products/hooks/useActivateEnrollment';
import { useIntl } from 'react-intl';
import toast from 'react-hot-toast';
import Link from 'next/link';

const EnrollmentDetailPage = () => {
  const router = useRouter();
  const { formatDateTime } = useFormatDateTime();
  const { formatMessage } = useIntl();
  const { enrollment, loading } = useEnrollment({
    enrollmentId: router.query?._id as string,
  });
  const { activateEnrollment } = useActivateEnrollment();
  const { terminateEnrollment } = useTerminateEnrollment();

  if (loading) return <Loading />;

  if (!enrollment && !loading)
    return (
      <div className="max-w-2xl mx-auto mt-10 text-center text-gray-500">
        {formatMessage({
          id: 'enrollment_not_found',
          defaultMessage: 'Enrollment not found.',
        })}
      </div>
    );

  const {
    _id,
    enrollmentNumber,
    status,
    created,
    updated,
    user,
    contact,
    plan,
    currency,
    isExpired,
    expires,
    periods,
  } = enrollment;

  const createdAt = formatDateTime(created);
  const updatedAt = formatDateTime(updated);
  const expiryDate = expires ? formatDateTime(expires) : null;

  const handleTerminate = async () => {
    try {
      await terminateEnrollment({ enrollmentId: _id });
    } catch (err) {
      toast.error(
        formatMessage({
          id: 'subscription_terminate_error',
          defaultMessage: 'Failed to terminate subscription.',
        }),
      );
      console.error('Failed to terminate enrollment:', err);
    }
  };

  const handleActivateEnrollment = async () => {
    try {
      await activateEnrollment({ enrollmentId: _id });
    } catch (err) {
      toast.error(
        formatMessage({
          id: 'subscription_activate_error',
          defaultMessage: 'Failed to activate subscription.',
        }),
      );
      console.error('Error activating enrollment:', err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-6 bg-white shadow-md rounded-2xl p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">
          {formatMessage({
            id: 'subscription_details_title',
            defaultMessage: 'Subscription Details',
          })}
        </h2>

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

      <div className="space-y-4 text-sm text-gray-700">
        <div className="grid grid-cols-2 gap-2">
          <p className="font-medium text-gray-500">
            {formatMessage({
              id: 'subscription_number',
              defaultMessage: 'Subscription:',
            })}
          </p>
          <p>{enrollmentNumber || '—'}</p>

          <p className="font-medium text-gray-500">
            {formatMessage({
              id: 'enrollment_created',
              defaultMessage: 'Created:',
            })}
          </p>
          <p>{createdAt}</p>

          <p className="font-medium text-gray-500">
            {formatMessage({
              id: 'enrollment_expiry_date',
              defaultMessage: 'Expiry Date:',
            })}
          </p>
          <p>{expiryDate || '—'}</p>

          <p className="font-medium text-gray-500">
            {formatMessage({
              id: 'enrollment_updated',
              defaultMessage: 'Last Updated:',
            })}
          </p>
          <p>{updatedAt}</p>

          <p className="font-medium text-gray-500">
            {formatMessage({
              id: 'enrollment_currency',
              defaultMessage: 'Currency:',
            })}
          </p>
          <p>{currency?.isoCode}</p>

          <p className="font-medium text-gray-500">
            {formatMessage({
              id: 'enrollment_expired',
              defaultMessage: 'Expired:',
            })}
          </p>
          <p>
            {isExpired
              ? formatMessage({ id: 'yes', defaultMessage: 'Yes' })
              : formatMessage({ id: 'no', defaultMessage: 'No' })}
          </p>
        </div>

        <hr className="my-4" />

        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            {formatMessage({
              id: 'enrollment_user_info',
              defaultMessage: 'User Information',
            })}
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <p className="font-medium text-gray-500">
              {formatMessage({ id: 'user_name', defaultMessage: 'Name:' })}
            </p>
            <p>{user?.name}</p>

            <p className="font-medium text-gray-500">
              {formatMessage({
                id: 'user_username',
                defaultMessage: 'Username:',
              })}
            </p>
            <p>{user?.username || '—'}</p>

            <p className="font-medium text-gray-500">
              {formatMessage({ id: 'user_email', defaultMessage: 'Email:' })}
            </p>
            <p>{contact?.emailAddress}</p>

            {contact?.telNumber && (
              <>
                <p className="font-medium text-gray-500">
                  {formatMessage({
                    id: 'user_phone',
                    defaultMessage: 'Phone:',
                  })}
                </p>
                <p>{contact.telNumber}</p>
              </>
            )}
          </div>
        </div>

        <hr className="my-4" />

        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            {formatMessage({
              id: 'subscription_plan_info_header',
              defaultMessage: 'Subscription detail',
            })}
          </h3>

          <div className="grid grid-cols-2 gap-2 mb-2">
            <p className="font-medium text-gray-500">
              {formatMessage({
                id: 'product',
                defaultMessage: 'Product',
              })}
              :
            </p>
            {plan?.product ? (
              <Link
                href={`/product/${plan.product.texts?.slug}`}
                className="text-blue-600 hover:underline text-left cursor-pointer"
              >
                {plan.product.texts?.title}
              </Link>
            ) : (
              <p className="text-gray-400">—</p>
            )}

            <p className="font-medium text-gray-500">
              {formatMessage({
                id: 'subscription_quantity',
                defaultMessage: 'Quantity:',
              })}
            </p>
            <p>{plan?.quantity}</p>
          </div>
          {plan?.product?.plan && (
            <div className="mt-2 border-t border-gray-100 pt-2">
              <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
                <p className="font-medium text-gray-500">
                  {formatMessage({
                    id: 'usage_type',
                    defaultMessage: 'Usage type',
                  })}
                  :
                </p>
                <p>{plan.product.plan.usageCalculationType}</p>

                <p className="font-medium text-gray-500">
                  {formatMessage({
                    id: 'subscription_billing_interval',
                    defaultMessage: 'Billing interval',
                  })}
                  :
                </p>
                <p>
                  {plan.product.plan.billingIntervalCount}{' '}
                  {plan.product.plan.billingInterval.toLowerCase()}
                </p>

                <p className="font-medium text-gray-500">
                  {formatMessage({
                    id: 'subscription_trial_interval',
                    defaultMessage: 'Trial interval',
                  })}
                  :
                </p>
                <p>
                  {plan.product.plan.trialIntervalCount}{' '}
                  {plan.product.plan.trialInterval.toLowerCase()}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-4">
          <h4 className="text-md font-semibold text-gray-800 mb-2">
            {formatMessage({
              id: 'subscription_periods',
              defaultMessage: 'Subscription Periods',
            })}
          </h4>
          <div className="flex flex-col gap-2">
            {periods?.map((period, idx) => {
              const periodLabel = period.isTrial
                ? formatMessage({
                    id: 'trial_subscription',
                    defaultMessage: 'Trial',
                  })
                : formatMessage({
                    id: 'active_subscription',
                    defaultMessage: 'Active',
                  });

              let badgeColor;
              if (enrollment.isExpired) badgeColor = 'bg-red-100 text-red-800';
              else {
                badgeColor = period.isTrial
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-green-100 text-green-700';
              }
              return (
                <div
                  key={idx}
                  className="flex justify-between items-center p-3 border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition"
                >
                  <div>
                    <p className="text-sm text-gray-500">
                      {formatDateTime(period.start)} →{' '}
                      {formatDateTime(period.end)}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${badgeColor}`}
                  >
                    {enrollment?.isExpired ? 'Expired' : periodLabel}
                  </span>
                </div>
              );
            })}
            {!periods ||
              (periods.length === 0 && (
                <p className="text-gray-400 italic">
                  {formatMessage({
                    id: 'enrollment_no_periods',
                    defaultMessage: 'No enrollment periods available.',
                  })}
                </p>
              ))}
          </div>
        </div>

        <div className="pt-6 flex justify-end gap-3">
          {status !== 'ACTIVE' && status !== 'TERMINATED' && (
            <button
              onClick={handleActivateEnrollment}
              className="px-5 py-2 rounded-lg font-medium transition bg-blue-100 text-blue-700 hover:bg-blue-200"
            >
              {formatMessage({
                id: 'enrollment_activate',
                defaultMessage: 'Activate Enrollment',
              })}
            </button>
          )}

          {status !== 'TERMINATED' && (
            <button
              onClick={handleTerminate}
              className="px-5 py-2 rounded-lg font-medium transition bg-red-100 text-red-700 hover:bg-red-200"
            >
              {formatMessage({
                id: 'enrollment_terminate',
                defaultMessage: 'Terminate Enrollment',
              })}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnrollmentDetailPage;
