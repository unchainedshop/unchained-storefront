import { offsetLimitPagination } from '@apollo/client/utilities';

// InMemoryCache already normalizes entities on `__typename` + `_id`, so only
// field-level policies are needed here.
const typePolicies: any = {
  ProductSearchResult: {
    fields: {
      products: offsetLimitPagination(),
    },
  },
  ProductTexts: { keyArgs: ['forceLocale'] },
  Price: { keyArgs: ['currencyCode'] },
  PriceRange: { keyArgs: ['currencyCode'] },
  PriceLevel: { keyArgs: ['currencyCode'] },
};

export default typePolicies;
