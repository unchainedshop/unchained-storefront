import FormattedPrice from './FormattedPrice';
import FormattedPriceRange from './FormattedPriceRange';
import PriceTiers from '../../products/components/PriceTiers';

const ProductPrice = ({ product, compact = false }) => {
  if (!product) {
    return <span>N/A</span>;
  }
  if (product?.leveledCatalogPrices?.length > 1)
    return (
      <PriceTiers
        leveledCatalogPrices={product?.leveledCatalogPrices}
        compact={compact}
      />
    );
  // The engine prices a bundle without its own price as the sum of its items.
  if (product.__typename === 'BundleProduct')
    return <FormattedPrice price={product.simulatedPrice || product.catalogPrice} />;

  if (product.simulatedPriceRange) {
    return <FormattedPriceRange priceRange={product.simulatedPriceRange} />;
  }

  if (product.catalogPriceRange) {
    return <FormattedPriceRange priceRange={product.catalogPriceRange} />;
  }

  return <FormattedPrice price={product.simulatedPrice} />;
};

export default ProductPrice;
