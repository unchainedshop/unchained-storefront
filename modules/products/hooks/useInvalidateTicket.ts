import { gql } from '@apollo/client';
import TokenFragment from '../fragments/TokenFragment';
import { useMutation } from '@apollo/client/react';
import { useAppContext } from '../../common/components/AppContextWrapper';

const InvalidateTokenMutation = gql`
  mutation InvalidateToken($tokenId: ID!, $currency: String) {
    invalidateToken(tokenId: $tokenId) {
      ...TokenFragment
    }
  }
  ${TokenFragment}
`;

const useInvalidateTicket = () => {
  const { selectedCurrency } = useAppContext();
  const [invalidateTokenMutation] = useMutation(InvalidateTokenMutation, {
    variables: { currency: selectedCurrency },
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
