import AddToCartButton from '../../cart/components/AddToCartButton';

const ProductAddToCart = ({ isConfigurable, resolvedProducts, product }) => {
  if (isConfigurable) {
    if (resolvedProducts?.length === 1) {
      const resolved = resolvedProducts[0];
      return (
        <AddToCartButton
          key={resolved._id}
          productId={resolved._id}
          {...resolved}
        />
      );
    }
    return null;
  }

  return (
    <AddToCartButton key={product._id} productId={product._id} {...product} />
  );
};

export default ProductAddToCart;
