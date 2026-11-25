import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import type * as GQL from '../../apollo/generated';

const ExportTokenMutation = gql`
  mutation ExportToken($tokenId: ID!, $quantity: Int!, $recipientWalletAddress: String!) {
    exportToken(tokenId: $tokenId, quantity: $quantity, recipientWalletAddress: $recipientWalletAddress) {
      _id
      status
      walletAddress
    }
  }
`;

const useExportToken = () => {
  const [exportTokenMutation, { loading }] = useMutation<GQL.ExportTokenMutation, GQL.ExportTokenMutationVariables>(
    ExportTokenMutation,
    { refetchQueries: ['TokenScanInfo'] },
  );

  return {
    exportToken: (variables: GQL.ExportTokenMutationVariables) => exportTokenMutation({ variables }),
    loading,
  };
};

export default useExportToken;
