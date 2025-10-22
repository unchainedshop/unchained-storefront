import { useRouter } from 'next/router';
import React from 'react';
import useEnrollment from '../../modules/products/hooks/useEnrollment';
import Loading from '../../modules/common/components/Loading';
import useFormatDateTime from '../../modules/common/utils/useFormatDateTime';
import useTerminateEnrollment from '../../modules/products/hooks/useTerminateEnrollment';
import { useIntl } from 'react-intl';

const EnrollmentDetailPage = () => {
  const router = useRouter();
  const { formatDateTime } = useFormatDateTime();
  const { formatMessage } = useIntl();
  const { enrollment, loading } = useEnrollment({
    enrollmentId: router.query._id as string,
  });
  const { terminateEnrollment } = useTerminateEnrollment();

  if (loading) return <Loading />;

  if (!enrollment)
    return (
      <div className="max-w-2xl mx-auto mt-10 text-center text-gray-500">
        {formatMessage({
          id: 'enrollment.not_found',
          defaultMessage: 'Enrollment not found.',
        })}
      </div>
    );

  const {
    enrollmentNumber,
    status,
    created,
    updated,
    user,
    contact,
    plan,
    currency,
    isExpired,
  } = enrollment;
  const createdAt = formatDateTime(created);
  const updatedAt = formatDateTime(updated);

  const handleTerminate = async () => {
    try {
      await terminateEnrollment({ enrollmentId: enrollment._id });
    } catch (err) {
      console.error('Failed to terminate enrollment:', err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-6 bg-white shadow-md rounded-2xl p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">
          {formatMessage({
            id: 'enrollment.details.title',
            defaultMessage: 'Enrollment Details',
          })}
        </h2>

        <span
          className={`px-3 py-1 text-sm rounded-full ${
            status === 'ACTIVE'
              ? 'bg-green-100 text-green-700'
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
              id: 'enrollment.number',
              defaultMessage: 'Enrollment Number:',
            })}
          </p>
          <p>{enrollmentNumber}</p>

          <p className="font-medium text-gray-500">
            {formatMessage({
              id: 'enrollment.created',
              defaultMessage: 'Created:',
            })}
          </p>
          <p>{createdAt}</p>

          <p className="font-medium text-gray-500">
            {formatMessage({
              id: 'enrollment.updated',
              defaultMessage: 'Last Updated:',
            })}
          </p>
          <p>{updatedAt}</p>

          <p className="font-medium text-gray-500">
            {formatMessage({
              id: 'enrollment.currency',
              defaultMessage: 'Currency:',
            })}
          </p>
          <p>{currency?.isoCode}</p>

          <p className="font-medium text-gray-500">
            {formatMessage({
              id: 'enrollment.expired',
              defaultMessage: 'Expired:',
            })}
          </p>
          <p>{isExpired ? 'Yes' : 'No'}</p>
        </div>

        <hr className="my-4" />

        {/* User Info */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            {formatMessage({
              id: 'enrollment.user_info',
              defaultMessage: 'User Information',
            })}
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <p className="font-medium text-gray-500">
              {formatMessage({ id: 'user.name', defaultMessage: 'Name:' })}
            </p>
            <p>{user?.name}</p>

            <p className="font-medium text-gray-500">
              {formatMessage({
                id: 'user.username',
                defaultMessage: 'Username:',
              })}
            </p>
            <p>{user?.username}</p>

            <p className="font-medium text-gray-500">
              {formatMessage({ id: 'user.email', defaultMessage: 'Email:' })}
            </p>
            <p>{contact?.emailAddress}</p>

            {contact?.telNumber && (
              <>
                <p className="font-medium text-gray-500">
                  {formatMessage({
                    id: 'user.phone',
                    defaultMessage: 'Phone:',
                  })}
                </p>
                <p>{contact.telNumber}</p>
              </>
            )}
          </div>
        </div>

        <hr className="my-4" />

        {/* Plan Info */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            {formatMessage({
              id: 'enrollment.plan_info',
              defaultMessage: 'Plan Information',
            })}
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <p className="font-medium text-gray-500">
              {formatMessage({
                id: 'plan.product',
                defaultMessage: 'Product:',
              })}
            </p>
            <p>{plan?.product?.texts?.title}</p>

            <p className="font-medium text-gray-500">
              {formatMessage({
                id: 'plan.quantity',
                defaultMessage: 'Quantity:',
              })}
            </p>
            <p>{plan?.quantity}</p>
          </div>
        </div>

        {/* Terminate Button */}
        {status !== 'TERMINATED' && (
          <div className="pt-6 flex justify-end">
            <button
              onClick={handleTerminate}
              className={`px-5 py-2 rounded-lg font-medium transition bg-red-100 text-red-700 hover:bg-red-200`}
            >
              {formatMessage({
                id: 'enrollment.terminate',
                defaultMessage: 'Terminate Enrollment',
              })}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnrollmentDetailPage;
