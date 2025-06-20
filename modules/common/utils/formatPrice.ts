import { formatCurrency } from "@coingecko/cryptoformat";

export const roundUp = (amount, decimals) => {
  if (decimals <= 2) return amount;
  return Math.ceil(amount * 100000) / 100000;
};

const formatPrice = (rawPrice) => {
  const { amount, currencyCode, decimals = 2, hack = true } = rawPrice || {};
  if (amount === undefined || amount === null) return "N/A";

  let fixedAmount = amount;
  if (hack) {
    const dec = Math.min(decimals, 9);
    fixedAmount = amount / 10 ** dec;
  }

  // Simplify presentation of crypto prices (round up to 7 decimals)
  const roundedUpAmount = roundUp(fixedAmount, decimals);
  return formatCurrency(roundedUpAmount, currencyCode);
};

export default formatPrice;
