import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import OrderDetailFragment from '../fragments/OrderDetailFragment';
import { useIntl } from 'react-intl';
import { useAppContext } from '../../common/components/AppContextWrapper';

export const ORDER_DETAIL_QUERY = gql`
  query OrderDetailQuery($currency: String, $orderId: ID!, $locale: Locale) {
    order(orderId: $orderId) {
      ...OrderDetailFragment
    }
  }
  ${OrderDetailFragment}
`;

const useOrderDetail = ({ orderId }) => {
  const { locale } = useIntl();
  const { selectedCurrency } = useAppContext();
  const { data, loading, error, ...rest } = useQuery<any>(ORDER_DETAIL_QUERY, {
    variables: { orderId, locale, currency: selectedCurrency },
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
