import classNames from 'classnames';
import { useIntl, FormattedMessage } from 'react-intl';
import FormattedPrice from '../common/components/FormattedPrice';
import EditableAddressPanel from './EditableAddressPanel';
import { useState } from 'react';

const ShippingAddressSelector = ({ currentDelivery, onUpdateAddress }) => {
  const { formatMessage } = useIntl();
  const [editMode, setEditMode] = useState(!currentDelivery.address);

  const toggleEditMode = () => setEditMode(!editMode);

  const handleSubmit = ({ __typename = null, ...address }) => {
    onUpdateAddress(currentDelivery.provider._id, address);
    setEditMode(false);
  };

  return (
    <div className="mt-4 bg-white dark:bg-slate-900 rounded-lg p-4 border border-slate-200 dark:border-0 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {formatMessage({
            id: 'delivery_address',
            defaultMessage: 'Delivery address',
          })}
        </h3>
        {!editMode && (
          <button
            type="button"
            onClick={toggleEditMode}
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm"
          >
            {formatMessage({
              id: 'edit-address',
              defaultMessage: 'Edit Address',
            })}
          </button>
        )}
      </div>

      <EditableAddressPanel
        editing={editMode}
        address={currentDelivery.address || {}}
        onSubmit={handleSubmit}
        onToggle={toggleEditMode}
      />
    </div>
  );
};

const CheckoutDeliverySelector = ({
  providers = [],
  currentDelivery,
  currencyCode = 'CHF',
  onSelectProvider = null,
  onSelectLocation = null,
  onUpdateAddress = null,
}) => {
  const { formatMessage } = useIntl();
  if (!providers.length) return null;

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {formatMessage({
            id: 'delivery_method',
            defaultMessage: 'Delivery Method',
          })}
        </h3>
        <div className="flex flex-wrap gap-2">
          {providers.map((provider) => {
            const isSelected = currentDelivery.provider?._id === provider._id;
            const price = provider?.simulatedPrice || {
              amount: 0,
              currencyCode,
            };

            return (
              <button
                key={provider._id}
                type="button"
                disabled={!provider.isActive}
                className={classNames(
                  'px-4 py-2 rounded-md border text-sm transition-colors',
                  {
                    'bg-slate-900 text-white border-slate-900': isSelected,
                    'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-white':
                      !isSelected && provider.isActive,
                    'bg-slate-200 text-slate-400 cursor-not-allowed':
                      !provider.isActive,
                  },
                )}
                onClick={() => onSelectProvider(provider._id)}
              >
                <div className="flex flex-col items-center">
                  <span className="font-medium">
                    {provider.type === 'SHIPPING' ? (
                      <FormattedMessage
                        id="shipping"
                        defaultMessage="Shipping"
                      />
                    ) : provider.type === 'PICKUP' ? (
                      <FormattedMessage id="pickup" defaultMessage="Pickup" />
                    ) : (
                      provider.type
                    )}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    <FormattedPrice price={price} />
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {currentDelivery.pickUpLocations?.length > 0 && onSelectLocation && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {formatMessage({
              id: 'pickup_location',
              defaultMessage: 'Pickup Location',
            })}
          </h3>
          <div className="flex flex-wrap gap-2">
            {currentDelivery.pickUpLocations.map((loc) => {
              const isSelected =
                currentDelivery?.activePickUpLocation?._id === loc._id;
              return (
                <button
                  key={loc._id}
                  type="button"
                  className={classNames(
                    'px-4 py-2 rounded-md border text-left text-sm transition-colors flex-1 min-w-[150px]',
                    {
                      'bg-slate-900 text-white border-slate-900': isSelected,
                      'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-white':
                        !isSelected,
                    },
                  )}
                  onClick={() =>
                    onSelectLocation(currentDelivery?.provider?._id, loc._id)
                  }
                >
                  <div>
                    <span className="font-medium">{loc.name}</span>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {loc.address.addressLine}, {loc.address.city}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {currentDelivery?.provider?.type === 'SHIPPING' && onUpdateAddress && (
        <ShippingAddressSelector
          key={currentDelivery?.address}
          currentDelivery={currentDelivery}
          onUpdateAddress={onUpdateAddress}
        />
      )}
    </div>
  );
};

export default CheckoutDeliverySelector;
