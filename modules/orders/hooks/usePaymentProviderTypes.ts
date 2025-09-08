import { gql } from '@apollo/client';

import { useQuery } from '@apollo/client/react';

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
  const { data, loading, error } = useQuery<any>(PaymentProvidersTypeQuery);

  const paymentProviderType = data?.paymentProviderType?.options || [];

  return {
    paymentProviderType,
    loading,
    error,
  };
};

export default usePaymentProviderTypes;
