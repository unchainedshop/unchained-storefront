import React from 'react';
import FormattedPrice from '../../common/components/FormattedPrice';
import formatPrice from '../../common/utils/formatPrice';

const PriceTiers = ({ leveledCatalogPrices, compact = false }) => {
  if (!leveledCatalogPrices?.length) return null;

  const tiers = leveledCatalogPrices;

  if (compact) {
    const firstTier = tiers[0];
    const bulkTiers = tiers
      .slice(1)
      .map((tier) => `${tier.maxQuantity}+ ${formatPrice(tier.price)}`);

    return (
      <div className="text-sm text-gray-700">
        <span className="font-semibold text-lg">
          <FormattedPrice price={firstTier.price} />
        </span>
        {bulkTiers.length > 0 && (
          <span className="ml-2 text-gray-500">({bulkTiers.join(', ')})</span>
        )}
      </div>
    );
  }

  return (
    <ul className="text-sm text-gray-700 space-y-1">
      {tiers.map((tier, i) => (
        <li key={i} className="flex items-center gap-2">
          <span
            className={`font-medium text-gray-700 ${i === 0 ? 'text-lg' : ''}`}
          >
            {i === 0 ? '' : `${tier.maxQuantity}+`}
          </span>
          <span
            className={`font-semibold text-gray-900 ${i === 0 ? 'text-xl' : ''}`}
          >
            <FormattedPrice price={tier.price} />
          </span>
        </li>
      ))}
    </ul>
  );
};

export default PriceTiers;
