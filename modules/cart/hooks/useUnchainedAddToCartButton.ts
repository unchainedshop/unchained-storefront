import { useState, useEffect } from 'react';
import useAddCartProduct from './useAddCartProduct';

const DEFAULT_MAX_QUANTITY = 100;

const useUnchainedAddToCartButton = ({
  productId,
  configuration,
  maxQuantity = DEFAULT_MAX_QUANTITY,
}) => {
  const [
    addCartProduct,
    { loading: isAddInProgress, called: isAddedToCart, reset },
  ] = useAddCartProduct() as any;
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    let timeoutHandler;
    if (isAddedToCart) {
      timeoutHandler = setTimeout(() => {
        setQuantity(1);
        reset();
      }, 5000);
    }
    return () => {
      clearTimeout(timeoutHandler);
    };
  }, [isAddedToCart]);

  const increaseQuantity = () => {
    if (quantity < maxQuantity) setQuantity(quantity + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const changeQuantity = (e) => {
    const { value } = e.target;
    const newQuantity = parseInt(value, 10);
    if (Number.isNaN(newQuantity)) {
      setQuantity(undefined);
    } else if (newQuantity > 0 && newQuantity <= maxQuantity)
      setQuantity(newQuantity);
  };

  const submitForm = async () => {
    if (!quantity) setQuantity(1);
    await addCartProduct({ productId, quantity: quantity || 1, configuration });
  };

  return {
    submitForm,
    increaseQuantity,
    decreaseQuantity,
    changeQuantity,
    isAddInProgress,
    isAddedToCart,
    maxQuantity,
    quantity,
  };
};

export default useUnchainedAddToCartButton;
