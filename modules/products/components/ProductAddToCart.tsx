import AddToCartButton from '../../cart/components/AddToCartButton';
import getProductAvailability from '../utils/getProductAvailability';

const ProductAddToCart = ({ isConfigurable, resolvedProducts, product }) => {
  if (isConfigurable) {
    if (resolvedProducts?.length === 1) {
      const resolved = resolvedProducts[0];
      return (
        <AddToCartButton key={resolved._id} productId={resolved._id} />
      );
    }
    return null;
  }

  const { status } = getProductAvailability(product);
  return (
    <AddToCartButton
      key={product._id}
      productId={product._id}
      disabled={status === 'OUT_OF_STOCK'}
    />
  );
};

export default ProductAddToCart;
