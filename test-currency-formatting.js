// Test CHF currency formatting
// Run with: node test-currency-formatting.js

// Mock the formatCurrency function
const formatCurrency = (amount, currency) => `${amount} ${currency}`;

// Currency configuration
const CURRENCY_CONFIG = {
  CHF: {
    locale: "de-CH",
    decimals: 2,
    isStandardCurrency: true,
  },
  EUR: {
    locale: "de-DE",
    decimals: 2,
    isStandardCurrency: true,
  },
  USD: {
    locale: "en-US",
    decimals: 2,
    isStandardCurrency: true,
  },
};

const formatPrice = (rawPrice) => {
  const {
    amount,
    currencyCode,
    decimals = 2,
    hack = true,
    locale,
  } = rawPrice || {};

  if (amount === undefined || amount === null || !currencyCode) {
    return "N/A";
  }

  const currencyConfig = CURRENCY_CONFIG[currencyCode] || {
    locale: locale || "en-US",
    decimals: decimals,
    isStandardCurrency: true,
  };

  let fixedAmount = amount;

  if (hack && currencyConfig.isStandardCurrency) {
    fixedAmount = amount / 100;
  }

  const roundedAmount = Math.round(fixedAmount * 100) / 100;

  if (currencyConfig.isStandardCurrency && typeof Intl !== "undefined") {
    try {
      const formatter = new Intl.NumberFormat(currencyConfig.locale, {
        style: "currency",
        currency: currencyCode,
        minimumFractionDigits: currencyConfig.decimals,
        maximumFractionDigits: currencyConfig.decimals,
      });

      return formatter.format(roundedAmount);
    } catch (error) {
      return `${currencyCode} ${roundedAmount.toFixed(currencyConfig.decimals)}`;
    }
  }

  return formatCurrency(roundedAmount, currencyCode);
};

// Test cases
console.log("Testing CHF currency formatting:");
console.log("");

// Test the exact values from the screenshot
console.log("Test 1 - Individual item price (237150 rappen):");
const result1 = formatPrice({
  amount: 237150,
  currencyCode: "CHF",
  decimals: 2,
  hack: true,
});
console.log(`Expected: CHF 2'371.50`);
console.log(`Actual:   ${result1}`);
console.log("");

console.log("Test 2 - Large amount (11439500 rappen):");
const result2 = formatPrice({
  amount: 11439500,
  currencyCode: "CHF",
  decimals: 2,
  hack: true,
});
console.log(`Expected: CHF 114'395.00`);
console.log(`Actual:   ${result2}`);
console.log("");

console.log("Test 3 - Zero amount:");
const result3 = formatPrice({
  amount: 0,
  currencyCode: "CHF",
  decimals: 2,
  hack: true,
});
console.log(`Expected: CHF 0.00`);
console.log(`Actual:   ${result3}`);
console.log("");

console.log("Test 4 - Small amount (50 rappen):");
const result4 = formatPrice({
  amount: 50,
  currencyCode: "CHF",
  decimals: 2,
  hack: true,
});
console.log(`Expected: CHF 0.50`);
console.log(`Actual:   ${result4}`);
