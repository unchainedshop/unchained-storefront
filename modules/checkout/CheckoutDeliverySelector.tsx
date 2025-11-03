import classNames from 'classnames';
import { useIntl, FormattedMessage } from 'react-intl';
import FormattedPrice from '../common/components/FormattedPrice';

export default function CheckoutDeliverySelector({
  providers = [],
  currentDelivery,
  currencyCode = 'CHF',
  onSelectProvider,
  onSelectLocation,
  isDisabled = false,
}) {
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
            const price = provider.fee || {
              amount: 0,
              currencyCode,
            };

            return (
              <button
                key={provider._id}
                type="button"
                disabled={!provider.isActive || isDisabled}
                className={classNames(
                  'px-4 py-2 rounded-md border text-sm transition-colors',
                  {
                    'bg-slate-900 text-white border-slate-900': isSelected,
                    'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-white':
                      !isSelected && provider.isActive && !isDisabled,
                    'bg-slate-200 text-slate-400 cursor-not-allowed':
                      !provider.isActive || isDisabled,
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
                  disabled={isDisabled}
                  className={classNames(
                    'px-4 py-2 rounded-md border text-left text-sm transition-colors flex-1 min-w-[150px]',
                    {
                      'bg-slate-900 text-white border-slate-900': isSelected,
                      'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-white':
                        !isSelected && !isDisabled,
                      'bg-slate-200 text-slate-400 cursor-not-allowed':
                        isDisabled,
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
    </div>
  );
}
