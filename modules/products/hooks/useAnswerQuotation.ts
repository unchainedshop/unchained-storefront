import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import type * as GQL from '../../apollo/generated';

const AddCartQuotationMutation = gql`
  mutation AddCartQuotation($quotationId: ID!) {
    addCartQuotation(quotationId: $quotationId) {
      _id
    }
  }
`;

const RejectQuotationMutation = gql`
  mutation RejectQuotation($quotationId: ID!) {
    rejectQuotation(quotationId: $quotationId) {
      _id
      status
      rejected
    }
  }
`;

const useAnswerQuotation = () => {
  const [addCartQuotationMutation] = useMutation<GQL.AddCartQuotationMutation, GQL.AddCartQuotationMutationVariables>(
    AddCartQuotationMutation,
    { refetchQueries: ['User', 'UserQuotations'] },
  );
  const [rejectQuotationMutation] = useMutation<GQL.RejectQuotationMutation, GQL.RejectQuotationMutationVariables>(
    RejectQuotationMutation,
    { refetchQueries: ['UserQuotations'] },
  );

  return {
    acceptQuotation: (quotationId: string) => addCartQuotationMutation({ variables: { quotationId } }),
    rejectQuotation: (quotationId: string) => rejectQuotationMutation({ variables: { quotationId } }),
  };
};

export default useAnswerQuotation;
