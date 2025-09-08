import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import { useRouter } from 'next/router';
import { useIntl } from 'react-intl';
import Button from '../common/components/Button';

export const SIGN_DATATRANS_MUTATION = gql`
  mutation SignPaymentProviderForCheckout(
    $orderPaymentId: ID!
    $transactionContext: JSON
  ) {
    signPaymentProviderForCheckout(
      orderPaymentId: $orderPaymentId
      transactionContext: $transactionContext
    )
  }
`;

const DatatransCheckoutButton = ({ order }) => {
  const router = useRouter();
  const { formatMessage } = useIntl();
  const [signDatatransMutation] = useMutation<any>(SIGN_DATATRANS_MUTATION);

  const sign = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    try {
      const successUrl = `${window.location.origin}/order/${order._id}/success`;
      const cancelUrl = `${window.location.origin}/checkout`;
      const errorUrl = `${window.location.origin}/checkout?error=1`;
      const transactionContext = {
        option: {
          createAlias: false,
        },
        redirect: {
          successUrl,
          cancelUrl,
          errorUrl,
        },
      };
      const { data } = await signDatatransMutation({
        variables: { orderPaymentId: order.payment._id, transactionContext },
      });
      if (data?.signPaymentProviderForCheckout) {
        const { location } = JSON.parse(
          data.signPaymentProviderForCheckout || {},
        );
        if (location) {
          document.location.href = location;
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Button
      type="button"
      text={formatMessage({
        id: 'pay-with-card',
        defaultMessage: 'Complete Payment',
      })}
      onClick={sign}
      className="mt-6 w-full rounded-md border border-transparent bg-red-600 py-3 px-4 text-base font-medium text-white shadow-xs hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-800 focus:ring-offset-2 focus:ring-offset-slate-50"
    />
  );
};

export default DatatransCheckoutButton;
