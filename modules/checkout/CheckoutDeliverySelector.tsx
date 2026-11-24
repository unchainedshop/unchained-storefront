import classNames from 'classnames';
import { useIntl, FormattedMessage } from 'react-intl';
import FormattedPrice from '../common/components/FormattedPrice';
import EditableAddressPanel from './EditableAddressPanel';
import { useState } from 'react';
import { CheckCircleIcon } from '@heroicons/react/20/solid';

const ShippingAddressSelector = ({ currentDelivery, onUpdateAddress }) => {
  const { formatMessage } = useIntl();
  const [editMode, setEditMode] = useState(!currentDelivery.address);

  const toggleEditMode = () => setEditMode(!editMode);

  const handleSubmit = ({ __typename = null, ...address }) => {
    onUpdateAddress(currentDelivery?.provider?._id, address);
    setEditMode(false);
  };

  return (
    <div className="mt-2 space-y-4 rounded-lg border border-border p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">
          {formatMessage({
            id: 'delivery_address',
            defaultMessage: 'Delivery address',
          })}
        </h3>
        {!editMode && (
          <button
            type="button"
            onClick={toggleEditMode}
            className="text-accent hover:text-accent text-sm"
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

  const pickUpLocations =
    providers.find(({ _id }) => _id === currentDelivery?.provider?._id)
      ?.pickUpLocations || [];

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-muted-foreground">
          {formatMessage({
            id: 'delivery_method',
            defaultMessage: 'Delivery Method',
          })}
        </h3>
        <div className="flex flex-wrap gap-3">
          {providers.map((provider) => {
            const isSelected = currentDelivery?.provider?._id === provider._id;
            const price = provider?.simulatedPrice || {
              amount: 0,
              currencyCode,
            };

            return (
              <button
                key={provider._id}
                type="button"
                disabled={!provider.isActive}
                aria-pressed={isSelected}
                className={classNames(
                  'relative min-w-[9rem] flex-1 rounded-lg border px-4 py-3 text-left text-sm transition-colors',
                  {
                    'border-primary bg-accent-soft text-foreground ring-1 ring-primary': isSelected,
                    'border-input bg-surface hover:border-subtle-foreground':
                      !isSelected && provider.isActive,
                    'cursor-not-allowed border-border bg-muted text-subtle-foreground':
                      !provider.isActive,
                  },
                )}
                onClick={() => onSelectProvider(provider._id)}
              >
                {isSelected && (
                  <CheckCircleIcon className="absolute right-3 top-3 size-5 text-primary" />
                )}
                <div className="flex flex-col">
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
                  <span className="text-xs text-subtle-foreground">
                    <FormattedPrice price={price} />
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {pickUpLocations.length > 0 && onSelectLocation && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">
            {formatMessage({
              id: 'pickup_location',
              defaultMessage: 'Pickup Location',
            })}
          </h3>
          <div className="flex flex-wrap gap-3">
            {pickUpLocations.map((loc) => {
              const isSelected =
                currentDelivery?.activePickUpLocation?._id === loc._id;
              return (
                <button
                  key={loc._id}
                  type="button"
                  aria-pressed={isSelected}
                  className={classNames(
                    'min-w-[150px] flex-1 rounded-lg border px-4 py-3 text-left text-sm transition-colors',
                    {
                      'border-primary bg-accent-soft text-foreground ring-1 ring-primary': isSelected,
                      'border-input bg-surface hover:border-subtle-foreground': !isSelected,
                    },
                  )}
                  onClick={() =>
                    onSelectLocation(currentDelivery?.provider?._id, loc._id)
                  }
                >
                  <div>
                    <span className="font-medium">{loc.name}</span>
                    <p className="text-xs text-subtle-foreground mt-1">
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
