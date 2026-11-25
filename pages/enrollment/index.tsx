import { useRouter } from 'next/router';
import React, { useState } from 'react';
import useEnrollment from '../../modules/products/hooks/useEnrollment';
import Loading from '../../modules/common/components/Loading';
import useFormatDateTime from '../../modules/common/utils/useFormatDateTime';
import useTerminateEnrollment from '../../modules/products/hooks/useTerminateEnrollment';
import useActivateEnrollment from '../../modules/products/hooks/useActivateEnrollment';
import { useIntl } from 'react-intl';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { MinusIcon, PlusIcon } from '@heroicons/react/20/solid';
import useUpdateEnrollment from '../../modules/products/hooks/useUpdateEnrollment';
import EditableAddressPanel from '../../modules/checkout/EditableAddressPanel';
import AddressPanel from '../../modules/checkout/AddressPanel';

const EnrollmentDetailPage = () => {
  const router = useRouter();
  const { formatDateTime } = useFormatDateTime();
  const { formatMessage } = useIntl();
  const { enrollment, loading } = useEnrollment({
    enrollmentId: router.query?._id as string,
  });
  const { activateEnrollment } = useActivateEnrollment();
  const { terminateEnrollment, loading: terminating } =
    useTerminateEnrollment();
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [editingAddress, setEditingAddress] = useState(false);
  const { updateQuantity, updateBillingAddress, loading: updating } = useUpdateEnrollment();
  const [cancelComment, setCancelComment] = useState('');

  if (loading) return <Loading />;

  if (!enrollment && !loading)
    return (
      <div className="max-w-2xl mx-auto mt-10 text-center text-subtle-foreground">
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
    minimumCommitmentEnd,
  } = enrollment;
  const cancellationScheduled = status !== 'TERMINATED' && Boolean(expires);
  const editable = ['ACTIVE', 'PAUSED', 'INITIAL'].includes(status) && !cancellationScheduled && Boolean(plan?.product);

  const createdAt = formatDateTime(created);
  const updatedAt = formatDateTime(updated);
  const expiryDate = expires ? formatDateTime(expires) : null;

  const handleTerminate = async () => {
    try {
      await terminateEnrollment({ enrollmentId: _id, comment: cancelComment });
      setConfirmCancel(false);
      setCancelComment('');
      toast.success(
        formatMessage({
          id: 'subscription_cancel_success',
          defaultMessage: 'Your subscription has been cancelled.',
        }),
      );
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
    <div className="max-w-3xl mx-auto mt-6 card p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-foreground">
          {formatMessage({
            id: 'subscription_details_title',
            defaultMessage: 'Subscription Details',
          })}
        </h2>

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
        </span>
      </div>

      <div className="space-y-4 text-sm text-muted-foreground">
        <div className="grid grid-cols-2 gap-2">
          <p className="font-medium text-subtle-foreground">
            {formatMessage({
              id: 'subscription_number',
              defaultMessage: 'Subscription:',
            })}
          </p>
          <p>{enrollmentNumber || '—'}</p>

          <p className="font-medium text-subtle-foreground">
            {formatMessage({
              id: 'enrollment_created',
              defaultMessage: 'Created:',
            })}
          </p>
          <p>{createdAt}</p>

          <p className="font-medium text-subtle-foreground">
            {formatMessage({
              id: 'enrollment_expiry_date',
              defaultMessage: 'Expiry Date:',
            })}
          </p>
          <p>{expiryDate || '—'}</p>

          {minimumCommitmentEnd && (
            <>
              <p className="font-medium text-subtle-foreground">
                {formatMessage({
                  id: 'enrollment_minimum_commitment_end',
                  defaultMessage: 'Minimum term until:',
                })}
              </p>
              <p>{formatDateTime(minimumCommitmentEnd)}</p>
            </>
          )}

          <p className="font-medium text-subtle-foreground">
            {formatMessage({
              id: 'enrollment_updated',
              defaultMessage: 'Last Updated:',
            })}
          </p>
          <p>{updatedAt}</p>

          <p className="font-medium text-subtle-foreground">
            {formatMessage({
              id: 'enrollment_currency',
              defaultMessage: 'Currency:',
            })}
          </p>
          <p>{currency?.isoCode}</p>

          <p className="font-medium text-subtle-foreground">
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
          <div className="mb-2 flex items-center justify-between gap-3">
            <h3 className="text-lg font-semibold">
              {formatMessage({ id: 'billing_address', defaultMessage: 'Billing address' })}
            </h3>
            {editable && !editingAddress && (
              <button type="button" onClick={() => setEditingAddress(true)} className="link text-sm">
                {formatMessage({ id: 'edit-address', defaultMessage: 'Edit Address' })}
              </button>
            )}
          </div>
          {editable ? (
            <EditableAddressPanel
              editing={editingAddress}
              address={enrollment.billingAddress || {}}
              onToggle={() => setEditingAddress(!editingAddress)}
              onSubmit={async (address) => {
                await updateBillingAddress(_id, address);
                setEditingAddress(false);
              }}
            />
          ) : (
            <AddressPanel address={enrollment.billingAddress || {}} onEdit={null} />
          )}
        </div>

        <hr className="my-4" />

        <div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            {formatMessage({
              id: 'enrollment_user_info',
              defaultMessage: 'User Information',
            })}
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <p className="font-medium text-subtle-foreground">
              {formatMessage({ id: 'user_name', defaultMessage: 'Name:' })}
            </p>
            <p>{user?.name}</p>

            <p className="font-medium text-subtle-foreground">
              {formatMessage({
                id: 'user_username',
                defaultMessage: 'Username:',
              })}
            </p>
            <p>{user?.username || '—'}</p>

            <p className="font-medium text-subtle-foreground">
              {formatMessage({ id: 'user_email', defaultMessage: 'Email:' })}
            </p>
            <p>{contact?.emailAddress}</p>

            {contact?.telNumber && (
              <>
                <p className="font-medium text-subtle-foreground">
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
          <h3 className="text-lg font-semibold text-foreground mb-2">
            {formatMessage({
              id: 'subscription_plan_info_header',
              defaultMessage: 'Subscription detail',
            })}
          </h3>

          <div className="grid grid-cols-2 gap-2 mb-2">
            <p className="font-medium text-subtle-foreground">
              {formatMessage({
                id: 'product',
                defaultMessage: 'Product',
              })}
              :
            </p>
            {plan?.product ? (
              <Link
                href={`/product/${plan.product.texts?.slug}`}
                className="text-accent hover:underline text-left cursor-pointer"
              >
                {plan.product.texts?.title}
              </Link>
            ) : (
              <p className="text-subtle-foreground">—</p>
            )}

            <p className="font-medium text-subtle-foreground">
              {formatMessage({
                id: 'subscription_quantity',
                defaultMessage: 'Quantity:',
              })}
            </p>
            {editable ? (
              <div className="inline-flex w-fit items-center rounded-full border border-input">
                <button
                  type="button"
                  disabled={updating || plan.quantity <= 1}
                  onClick={() => updateQuantity(enrollment, plan.quantity - 1)}
                  aria-label={formatMessage({ id: 'decrease_quantity', defaultMessage: 'Decrease quantity' })}
                  className="flex size-8 items-center justify-center rounded-full text-muted-foreground hover:text-foreground disabled:opacity-40"
                >
                  <MinusIcon className="size-4" />
                </button>
                <span className="w-8 text-center font-medium">{plan.quantity}</span>
                <button
                  type="button"
                  disabled={updating}
                  onClick={() => updateQuantity(enrollment, plan.quantity + 1)}
                  aria-label={formatMessage({ id: 'increase_quantity', defaultMessage: 'Increase quantity' })}
                  className="flex size-8 items-center justify-center rounded-full text-muted-foreground hover:text-foreground disabled:opacity-40"
                >
                  <PlusIcon className="size-4" />
                </button>
              </div>
            ) : (
              <p>{plan?.quantity}</p>
            )}
          </div>
          {plan?.product?.plan && (
            <div className="mt-2 border-t border-border pt-2">
              <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                <p className="font-medium text-subtle-foreground">
                  {formatMessage({
                    id: 'usage_type',
                    defaultMessage: 'Usage type',
                  })}
                  :
                </p>
                <p>{plan.product.plan.usageCalculationType}</p>

                <p className="font-medium text-subtle-foreground">
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

                <p className="font-medium text-subtle-foreground">
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
          <h4 className="text-md font-semibold text-foreground mb-2">
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
              if (enrollment.isExpired) badgeColor = 'bg-danger-soft text-danger';
              else {
                badgeColor = period.isTrial
                  ? 'bg-warning-soft text-warning'
                  : 'bg-success-soft text-success';
              }
              return (
                <div
                  key={idx}
                  className="flex justify-between items-center p-3 border border-border rounded-lg shadow-sm hover:shadow-md transition"
                >
                  <div>
                    <p className="text-sm text-subtle-foreground">
                      {formatDateTime(period.start)} →{' '}
                      {formatDateTime(period.end)}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${badgeColor}`}
                  >
                    {enrollment?.isExpired
                      ? formatMessage({
                          id: 'enrollment_period_expired',
                          defaultMessage: 'Expired',
                        })
                      : periodLabel}
                  </span>
                </div>
              );
            })}
            {!periods?.length && (
              <p className="text-subtle-foreground italic">
                {formatMessage({
                  id: 'enrollment_no_periods',
                  defaultMessage: 'No enrollment periods available.',
                })}
              </p>
            )}
          </div>
        </div>

        {cancellationScheduled && (
          <div className="rounded-lg bg-warning-soft p-4 text-warning">
            {formatMessage(
              {
                id: 'subscription_cancellation_scheduled',
                defaultMessage:
                  'Cancelled. Your subscription stays active until {date}.',
              },
              { date: expiryDate },
            )}
          </div>
        )}

        {confirmCancel && (
          <div className="rounded-lg border border-danger/40 bg-danger-soft p-4 space-y-3">
            <p className="font-medium text-danger">
              {formatMessage({
                id: 'subscription_cancel_confirm',
                defaultMessage:
                  'Do you really want to cancel this subscription? It ends after the current period or the minimum term, whichever is later.',
              })}
            </p>
            <label
              htmlFor="cancel-comment"
              className="block text-sm text-muted-foreground"
            >
              {formatMessage({
                id: 'subscription_cancel_feedback',
                defaultMessage: 'Why are you leaving? (optional)',
              })}
            </label>
            <textarea
              id="cancel-comment"
              rows={3}
              maxLength={1000}
              value={cancelComment}
              onChange={(e) => setCancelComment(e.target.value)}
              className="block w-full rounded-md border border-input p-2 text-sm"
            />
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirmCancel(false)}
                className="px-4 py-2 rounded-lg font-medium bg-surface text-muted-foreground border border-input hover:bg-muted"
              >
                {formatMessage({
                  id: 'subscription_keep',
                  defaultMessage: 'Keep subscription',
                })}
              </button>
              <button
                type="button"
                disabled={terminating}
                onClick={handleTerminate}
                className="px-4 py-2 rounded-lg font-medium bg-danger text-white hover:bg-danger/90 disabled:opacity-50"
              >
                {formatMessage({
                  id: 'subscription_cancel_confirm_button',
                  defaultMessage: 'Yes, cancel',
                })}
              </button>
            </div>
          </div>
        )}

        <div className="pt-6 flex justify-end gap-3">
          {status !== 'ACTIVE' && status !== 'TERMINATED' && (
            <button
              onClick={handleActivateEnrollment}
              className="px-5 py-2 rounded-lg font-medium transition bg-accent-soft text-accent hover:bg-accent-soft"
            >
              {formatMessage({
                id: 'enrollment_activate',
                defaultMessage: 'Activate Enrollment',
              })}
            </button>
          )}

          {status !== 'TERMINATED' && !cancellationScheduled && !confirmCancel && (
            <button
              type="button"
              onClick={() => setConfirmCancel(true)}
              className="px-5 py-2 rounded-lg font-medium transition bg-danger-soft text-danger hover:bg-danger-soft"
            >
              {formatMessage({
                id: 'subscription_cancel',
                defaultMessage: 'Cancel subscription',
              })}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnrollmentDetailPage;
