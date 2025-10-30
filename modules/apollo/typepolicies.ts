import { offsetLimitPagination } from '@apollo/client/utilities';

export const keyMappings: any = {
  ProductSearchResult: {
    fields: {
      products: offsetLimitPagination(),
    },
  },
  ProductTexts: {
    keyArgs: ['forceLocale'],
  },
  Price: {
    keyArgs: ['currencyCode'],
  },
  PriceRange: {
    keyArgs: ['currencyCode'],
  },
  PriceLevel: {
    keyArgs: ['currencyCode'],
  },
};

export const keyFields: any = {
  keyFields: (result: any) => {
    if (result?._id && result?.__typename) {
      return `${result?.__typename}:${result?._id}`;
    }
    if (result?.id && result?.__typename) {
      return `${result.__typename}:${result.id}`;
    }
    return null;
  },
};

export default { ...keyMappings, ...keyFields };
