import React from 'react';
import FormattedPrice from '../../common/components/FormattedPrice';
import formatPrice from '../../common/utils/formatPrice';
import { useIntl } from 'react-intl';

const PriceTiers = ({ leveledCatalogPrices, compact = false }) => {
  const { formatMessage } = useIntl();
  if (!leveledCatalogPrices?.length) return null;

  const tiers = leveledCatalogPrices
    .filter((p) => !(p.minQuantity === 0 && p.maxQuantity === 0))
    .map((tier, index) =>
      index === 0 && tier.minQuantity === 0
        ? { ...tier, minQuantity: 1 }
        : tier,
    );

  if (compact) {
    const firstTier = tiers[0];
    const bulkTiers = tiers.slice(1).map((tier, i) => {
      const label =
        tier.minQuantity === tier.maxQuantity
          ? `${tier.minQuantity}`
          : `${tier.minQuantity}+`;
      return `${label} ${formatPrice(tier.price)}`;
    });

    return (
      <div className="text-sm text-gray-700">
        <span className="font-semibold">
          <FormattedPrice price={firstTier.price} />
        </span>
        {bulkTiers.length > 0 && (
          <span className="ml-2 text-gray-500">({bulkTiers.join(', ')})</span>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-3 w-full max-w-sm text-sm">
      <h3 className="text-sm font-semibold text-gray-800 mb-2">
        {formatMessage({
          id: 'buy_more_save_more',
          defaultMessage: 'Buy more, save more',
        })}
      </h3>

      <ul className="space-y-1">
        {tiers.map((tier, i) => {
          const label =
            tier.minQuantity === tier.maxQuantity
              ? `${tier.minQuantity}`
              : `${tier.minQuantity}+`;

          return (
            <li
              key={i}
              className="flex justify-between items-center py-1 px-2 rounded hover:bg-gray-50 transition-colors border border-gray-100"
            >
              <span className="text-gray-700 font-medium">{label}</span>
              <span className="text-gray-900 font-semibold">
                <FormattedPrice price={tier.price} />
              </span>
            </li>
          );
        })}
      </ul>

      <p className="mt-2 text-xs text-gray-500">
        {formatMessage({
          id: 'discount_applied_at_checkout',
          defaultMessage: 'Discounts automatically applied at checkout.',
        })}
      </p>
    </div>
  );
};

export default PriceTiers;
