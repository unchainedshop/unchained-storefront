import { useMutation } from '@apollo/client/react';
import useLoginAsGuest from '../../auth/hooks/useLoginAsGuest';
import useUser from '../../auth/hooks/useUser';
import { gql } from '@apollo/client';

export const REQUEST_PRODUCT_QUOTATION_MUTATION = gql`
  mutation RequestQuotation(
    $productId: ID!
    $configuration: [ProductConfigurationParameterInput!]
  ) {
    requestQuotation(productId: $productId, configuration: $configuration) {
      _id
    }
  }
`;

const useConditionalRequestProductQuotation = () => {
  const { user } = useUser();
  const [requestProductQuotation] = useMutation(
    REQUEST_PRODUCT_QUOTATION_MUTATION,
  );
  const { loginAsGuest } = useLoginAsGuest();

  const requestQuotation = async ({ productId, quantity = 1, contactInfo }) => {
    if (!user?._id) {
      await loginAsGuest();
    }
    await requestProductQuotation({
      variables: {
        productId,
        configuration: [
          { key: 'quantity', value: quantity },
          ...Object.entries(contactInfo || {})
            .map(([key, value]) => ({
              key,
              value: value?.toString(),
            }))
            .filter(({ value }) => Boolean(value)),
        ],
      },
    });
  };

  return {
    requestQuotation,
  };
};

export default useConditionalRequestProductQuotation;
