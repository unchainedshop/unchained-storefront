import { gql } from '@apollo/client';
import TokenFragment from '../fragments/TokenFragment';
import { useMutation } from '@apollo/client/react';
import { useAppContext } from '../../common/components/AppContextWrapper';
import { useIntl } from 'react-intl';

const InvalidateTokenMutation = gql`
  mutation InvalidateToken($tokenId: ID!, $locale: Locale, $currency: String) {
    invalidateToken(tokenId: $tokenId) {
      ...TokenFragment
    }
  }
  ${TokenFragment}
`;

const useInvalidateTicket = () => {
  const { locale } = useIntl();
  const { selectedCurrency } = useAppContext();
  const [invalidateTokenMutation] = useMutation(InvalidateTokenMutation, {
    variables: { locale, currency: selectedCurrency },
  });

  const invalidateTicket = async ({ tokenId }) => {
    const result = await invalidateTokenMutation({
      variables: { tokenId },
      refetchQueries: ['SoldTickets'],
    });
    return result;
  };
  return { invalidateTicket };
};

export default useInvalidateTicket;
