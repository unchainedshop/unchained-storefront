import { useQuery, gql } from '@apollo/client';

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
  const { data, loading, error } = useQuery(PaymentProvidersTypeQuery);

  const paymentProviderType = data?.paymentProviderType?.options || [];

  return {
    paymentProviderType,
    loading,
    error,
  };
};

export default usePaymentProviderTypes;
