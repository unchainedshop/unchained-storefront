import { gql } from '@apollo/client';

import { useQuery } from '@apollo/client/react';
import type * as GQL from '../../apollo/generated';

const PaymentStatusTypesQuery = gql`
  query OrderPaymentStatus {
    paymentStatusTypes: __type(name: "OrderPaymentStatus") {
      options: enumValues {
        value: name
        label: description
      }
    }
  }
`;

const usePaymentStatusTypes = () => {
  const { data, loading, error } = useQuery<GQL.OrderPaymentStatusQuery, GQL.OrderPaymentStatusQueryVariables>(PaymentStatusTypesQuery);

  const paymentStatusTypes = data?.paymentStatusTypes?.options || [];

  return {
    paymentStatusTypes,
    loading,
    error,
  };
};

export default usePaymentStatusTypes;
