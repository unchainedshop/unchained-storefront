import { gql } from '@apollo/client';
import TokenFragment from '../fragments/TokenFragment';
import { useMutation } from '@apollo/client/react';

const InvalidateTokenMutation = gql`
  mutation InvalidateToken($tokenId: ID!) {
    invalidateToken(tokenId: $tokenId) {
      ...TokenFragment
    }
  }
  ${TokenFragment}
`;

const useInvalidateTicket = () => {
  const [invalidateTokenMutation] = useMutation(InvalidateTokenMutation);

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
