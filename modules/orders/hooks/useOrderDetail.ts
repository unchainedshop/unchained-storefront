import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import OrderDetailFragment from '../fragments/OrderDetailFragment';
import { useIntl } from 'react-intl';

export const ORDER_DETAIL_QUERY = gql`
  query OrderDetailQuery($orderId: ID!, $locale: Locale) {
    order(orderId: $orderId) {
      ...OrderDetailFragment
    }
  }
  ${OrderDetailFragment}
`;

const useOrderDetail = ({ orderId }) => {
  const { locale } = useIntl();
  const { data, loading, error, ...rest } = useQuery<any>(ORDER_DETAIL_QUERY, {
    variables: { orderId, locale },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'no-cache',
    ssr: false,
    skip: !orderId,
  });

  return {
    order: data?.order,
    loading,
    error,
    ...rest,
  };
};

export default useOrderDetail;
