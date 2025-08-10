const calculateBundlePriceRange = (bundleItems) => {
  if (!bundleItems || bundleItems.length === 0) {
    return null;
  }

  let minAmount = Infinity;
  let maxAmount = -Infinity;
  let currencyCode = null;
  let isTaxable = false;
  let isNetPrice = false;

  for (const item of bundleItems) {
    const product = item.product;
    const quantity = item.quantity || 1;

    let price = null;

    if (product?.simulatedPrice) {
      price = product.simulatedPrice;
    } else if (product?.simulatedPriceRange) {
      const range = product.simulatedPriceRange;
      minAmount = Math.min(minAmount, (range.minPrice?.amount || 0) * quantity);
      maxAmount = Math.max(maxAmount, (range.maxPrice?.amount || 0) * quantity);
      currencyCode = currencyCode || range.minPrice?.currencyCode;
      isTaxable = isTaxable || range.minPrice?.isTaxable;
      isNetPrice = isNetPrice || range.minPrice?.isNetPrice;
      continue;
    } else if (product?.catalogPriceRange) {
      const range = product.catalogPriceRange;
      minAmount = Math.min(minAmount, (range.minPrice?.amount || 0) * quantity);
      maxAmount = Math.max(maxAmount, (range.maxPrice?.amount || 0) * quantity);
      currencyCode = currencyCode || range.minPrice?.currencyCode;
      isTaxable = isTaxable || range.minPrice?.isTaxable;
      isNetPrice = isNetPrice || range.minPrice?.isNetPrice;
      continue;
    }

    if (price && price.amount !== undefined) {
      const totalAmount = price.amount * quantity;
      minAmount = Math.min(minAmount, totalAmount);
      maxAmount = Math.max(maxAmount, totalAmount);
      currencyCode = currencyCode || price.currencyCode;
      isTaxable = isTaxable || price.isTaxable;
      isNetPrice = isNetPrice || price.isNetPrice;
    }
  }

  if (minAmount === Infinity || maxAmount === -Infinity) {
    return null;
  }

  return {
    minPrice: {
      amount: minAmount,
      currencyCode,
      isTaxable,
      isNetPrice,
    },
    maxPrice: {
      amount: maxAmount,
      currencyCode,
      isTaxable,
      isNetPrice,
    },
  };
};

export default calculateBundlePriceRange;
