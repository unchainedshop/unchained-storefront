import { useState } from 'react';
import { useIntl } from 'react-intl';
import Button from '../common/components/Button';
import EditableAddressPanel from './EditableAddressPanel';
import useUpdateCartBillingAddress from '../orders/hooks/useUpdateCartBillingAddress';

const areAddressesEqual = (deliveryAddress = {}, billingAddress = {}) => {
  if (!deliveryAddress || !billingAddress) return false;
  const keys = Array.from(
    new Set([
      ...Object.keys(deliveryAddress || {}),
      ...Object.keys(billingAddress || {}),
    ]),
  ).filter((key) => key !== '__typename');
  return keys.every((key) => deliveryAddress?.[key] === billingAddress?.[key]);
};

const CheckoutBillingAddress = ({ cart, isInitial }) => {
  const { formatMessage } = useIntl();
  const [lastBillingAddress, setLastBillingAddress] = useState(null);
  const [billingAddressEditMode, setBillingAddressEditMode] =
    useState(isInitial);
  const { updateCartBillingAddress } = useUpdateCartBillingAddress();

  const deliveryAddress = cart.delivery?.address
    ? { ...cart.delivery?.address }
    : null;
  if (deliveryAddress?.__typename !== undefined) {
    delete deliveryAddress.__typename;
  }
  const billingAddress = { ...(cart.billingAddress || {}) };
  const isBillingAddressSame = areAddressesEqual(
    deliveryAddress,
    billingAddress,
  );

  if (billingAddress?.__typename !== undefined) {
    delete billingAddress.__typename;
  }

  const updateBillingAddress = async (address) => {
    await updateCartBillingAddress({
      address,
    });
    setLastBillingAddress(billingAddress);
    setBillingAddressEditMode(false);
  };

  const toggleBillingAddress = async (event) => {
    if (!event.target.checked) {
      await updateCartBillingAddress({
        address: lastBillingAddress || deliveryAddress,
      });
    } else {
      await updateCartBillingAddress({
        address: deliveryAddress,
      });
      setBillingAddressEditMode(false);
    }
  };
  const toggleBillingAddressEditMode = () =>
    setBillingAddressEditMode(!billingAddressEditMode);

  return (
    <div className="space-y-8">
      <div className="bg-white dark:bg-slate-900 rounded-lg p-6 border border-slate-200 dark:border-0">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-slate-900 dark:text-white">
            {formatMessage({
              id: 'billing-address',
              defaultMessage: 'Billing address',
            })}
          </h2>
          {!billingAddressEditMode && (
            <Button
              type="button"
              variant="link"
              onClick={toggleBillingAddressEditMode}
              text={formatMessage({
                id: 'edit-address',
                defaultMessage: 'Edit Address',
              })}
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              fullWidth={false}
            />
          )}
        </div>

        {billingAddressEditMode ? (
          <div className="mb-4">
            <label className="flex items-center">
              <input
                key={isBillingAddressSame.toString()}
                id="isBillingAddressSame"
                type="checkbox"
                defaultChecked={isBillingAddressSame}
                onChange={toggleBillingAddress}
                className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-500 focus:ring-offset-0 dark:border-0 dark:bg-slate-700"
              />
              <span className="ml-3 text-sm font-medium text-slate-700 dark:text-slate-300">
                {formatMessage({
                  id: 'billing-same-as-delivery',
                  defaultMessage: 'Billing Address Same as Delivery',
                })}
              </span>
            </label>
          </div>
        ) : null}
        <EditableAddressPanel
          editing={billingAddressEditMode}
          address={billingAddress}
          onSubmit={updateBillingAddress}
          onToggle={toggleBillingAddressEditMode}
        />
      </div>
    </div>
  );
};

export default CheckoutBillingAddress;
