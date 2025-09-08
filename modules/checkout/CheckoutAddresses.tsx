import { useState } from 'react';
import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import { useIntl } from 'react-intl';
import AddressForm from './AddressForm';
import AddressPanel from './AddressPanel';
import Button from '../common/components/Button';

export const UPDATE_CART_BILLING_ADDRESS_MUTATION = gql`
  mutation UpdateCartBillingAddress($billingAddress: AddressInput) {
    updateCart(billingAddress: $billingAddress) {
      _id
      billingAddress {
        firstName
        lastName
        addressLine
        addressLine2
        postalCode
        city
        regionCode
        countryCode
      }
    }
  }
`;

export const UPDATE_ORDER_DELIVERY_ADDRESS_MUTATION = gql`
  mutation UpdateOrderDeliveryAddress(
    $orderDeliveryId: ID!
    $address: AddressInput
  ) {
    updateOrderDeliveryShipping(
      orderDeliveryId: $orderDeliveryId
      address: $address
    ) {
      _id
      address {
        firstName
        lastName
        addressLine
        addressLine2
        postalCode
        city
        regionCode
        countryCode
      }
    }
  }
`;

const EditableAddressPanel = ({ editing, address, onSubmit, onToggle }) => {
  if (editing)
    return (
      <AddressForm address={address} onSubmit={onSubmit} onCancel={onToggle} />
    );
  return <AddressPanel address={address} onEdit={onToggle} />;
};

const CheckoutAddresses = ({ cart, isInitial }) => {
  const { formatMessage } = useIntl();
  const [lastBillingAddress, setLastBillingAddress] = useState(null);
  const [billingAddressEditMode, setBillingAddressEditMode] = useState(false);
  const [deliveryAddressEditMode, setDeliveryAddressEditMode] =
    useState(isInitial);

  const [updateCartMutation] = useMutation<any>(
    UPDATE_CART_BILLING_ADDRESS_MUTATION,
  );
  const [updateOrderDeliveryAddressMutation] = useMutation<any>(
    UPDATE_ORDER_DELIVERY_ADDRESS_MUTATION,
  );

  const deliveryAddress = {
    ...(cart.delivery?.address || cart.billingAddress || {}),
  };
  if (deliveryAddress?.__typename !== undefined) {
    delete deliveryAddress.__typename;
  }

  const billingAddress = { ...(cart.billingAddress || {}) };
  if (billingAddress?.__typename !== undefined) {
    delete billingAddress.__typename;
  }

  const isBillingAddressDifferent = Boolean(cart.delivery?.address);

  const updateBillingAddress = async (address) => {
    await updateCartMutation({
      variables: {
        billingAddress: address,
      },
    });
    setLastBillingAddress(billingAddress);
    setBillingAddressEditMode(false);
  };

  const updateDeliveryAddress = async (address) => {
    if (isBillingAddressDifferent) {
      await updateOrderDeliveryAddressMutation({
        variables: {
          orderDeliveryId: cart.delivery._id,
          address,
        },
      });
    } else {
      await updateCartMutation({
        variables: {
          billingAddress: address,
        },
      });
    }
    setDeliveryAddressEditMode(false);
  };

  const toggleBillingAddress = async (event) => {
    if (!event.target.checked) {
      await Promise.all([
        updateCartMutation({
          variables: {
            billingAddress: lastBillingAddress || deliveryAddress,
          },
        }),
        updateOrderDeliveryAddressMutation({
          variables: {
            orderDeliveryId: cart.delivery._id,
            address: deliveryAddress,
          },
        }),
      ]);
    } else {
      // Billing Address should be the same as Delivery!
      await Promise.all([
        updateCartMutation({
          variables: {
            billingAddress: deliveryAddress,
          },
        }),
        updateOrderDeliveryAddressMutation({
          variables: {
            orderDeliveryId: cart.delivery._id,
            address: null,
          },
        }),
      ]);
      setBillingAddressEditMode(false);
    }
  };

  const toggleDeliveryAddressEditMode = () =>
    setDeliveryAddressEditMode(!deliveryAddressEditMode);
  const toggleBillingAddressEditMode = () =>
    setBillingAddressEditMode(!billingAddressEditMode);

  return (
    <div className="space-y-8">
      {/* Delivery Address Section */}
      <div className="bg-white dark:bg-slate-900 rounded-lg p-6 border border-slate-200 dark:border-0">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-slate-900 dark:text-white">
            {formatMessage({
              id: 'delivery-address',
              defaultMessage: 'Delivery address',
            })}
          </h2>
          {!deliveryAddressEditMode && (
            <Button
              type="button"
              variant="link"
              onClick={toggleDeliveryAddressEditMode}
              text={formatMessage({
                id: 'edit-address',
                defaultMessage: 'Edit Address',
              })}
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              fullWidth={false}
            />
          )}
        </div>
        <EditableAddressPanel
          editing={deliveryAddressEditMode}
          address={deliveryAddress}
          onSubmit={updateDeliveryAddress}
          onToggle={toggleDeliveryAddressEditMode}
        />
      </div>

      {/* Billing Address Section */}
      {!isInitial && (
        <div className="bg-white dark:bg-slate-900 rounded-lg p-6 border border-slate-200 dark:border-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-slate-900 dark:text-white">
              {formatMessage({
                id: 'billing-address',
                defaultMessage: 'Billing address',
              })}
            </h2>
            {isBillingAddressDifferent && !billingAddressEditMode && (
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

          <div className="mb-4">
            <label className="flex items-center">
              <input
                id="isBillingAddressDifferent"
                type="checkbox"
                defaultChecked={!isBillingAddressDifferent}
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

          {isBillingAddressDifferent && (
            <EditableAddressPanel
              editing={billingAddressEditMode}
              address={billingAddress}
              onSubmit={updateBillingAddress}
              onToggle={toggleBillingAddressEditMode}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default CheckoutAddresses;
