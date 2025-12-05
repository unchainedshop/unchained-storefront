import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import CurrentUserFragment from '../fragments/CurrentUserFragment';
import { useAppContext } from '../../common/components/AppContextWrapper';
import { useIntl } from 'react-intl';

export const USER_QUERY = gql`
  query User($currency: String, $locale: Locale) {
    me {
      ...CurrentUser
      tokens {
        _id
        walletAddress
        chainId
        tokenSerialNumber
        ercMetadata
        product {
          _id
        }
        status
        quantity
        isInvalidateable
        expiryDate
        contractAddress
        accessKey
      }
    }
  }
  ${CurrentUserFragment}
`;

const useUser = () => {
  const { selectedCurrency } = useAppContext();
  const { locale } = useIntl();
  const { data, loading, error, refetch } = useQuery<any>(USER_QUERY, {
    variables: {
      currency: selectedCurrency,
      locale,
    },
  });

  return {
    loading,
    error,
    user: data?.me,
    cart: data?.me?.cart,
    refetch,
  };
};

export default useUser;
