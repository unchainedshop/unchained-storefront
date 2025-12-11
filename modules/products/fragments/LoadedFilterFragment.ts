import { gql } from '@apollo/client';

const LoadedFilterFragment = gql`
  fragment LoadedFilterFragment on LoadedFilter {
    definition {
      type
      _id
      texts {
        _id
        title
      }
      key
    }
    filteredProductsCount
    productsCount
    isSelected

    options {
      definition {
        _id
        texts {
          _id
          title
        }
        value
      }
      filteredProductsCount
      isSelected
    }
  }
`;

export default LoadedFilterFragment;
