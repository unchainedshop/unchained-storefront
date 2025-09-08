import FormattedPrice from './FormattedPrice';
import FormattedPriceRange from './FormattedPriceRange';
import calculateBundlePriceRange from '../../products/utils/calculateBundlePriceRange';

const ProductPrice = ({ product }) => {
  if (!product) {
    return <span>N/A</span>;
  }

  if (product.__typename === 'BundleProduct') {
    const priceRange = calculateBundlePriceRange(product.bundleItems);
    return <FormattedPriceRange priceRange={priceRange} />;
  }

  if (product.simulatedPriceRange) {
    return <FormattedPriceRange priceRange={product.simulatedPriceRange} />;
  }

  if (product.catalogPriceRange) {
    return <FormattedPriceRange priceRange={product.catalogPriceRange} />;
  }

  return <FormattedPrice price={product.simulatedPrice} />;
};

export default ProductPrice;
