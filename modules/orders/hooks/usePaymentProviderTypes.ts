import { gql } from '@apollo/client';

import { useQuery } from '@apollo/client/react';
import type * as GQL from '../../apollo/generated';

const PaymentProvidersTypeQuery = gql`
  query PaymentProvidersType {
    paymentProviderType: __type(name: "PaymentProviderType") {
      options: enumValues {
        value: name
        label: description
      }
    }
  }
`;

const usePaymentProviderTypes = () => {
  const { data, loading, error } = useQuery<GQL.PaymentProvidersTypeQuery, GQL.PaymentProvidersTypeQueryVariables>(PaymentProvidersTypeQuery);

  const paymentProviderType = data?.paymentProviderType?.options || [];

  return {
    paymentProviderType,
    loading,
    error,
  };
};

export default usePaymentProviderTypes;
