import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import useSignPaymentProviderForCheckout from './hooks/useSignPaymentProviderForCheckout';
import useCheckoutCart from '../cart/hooks/useCheckoutCart';
import { useRouter } from 'next/router';

const PayrexxCheckoutButton = ({ order }) => {
  const { formatMessage } = useIntl();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  const { sign } = useSignPaymentProviderForCheckout();
  const { checkoutCart } = useCheckoutCart();

  const handleCompleteOrder = async (gatewayId) => {
    try {
      const result = await checkoutCart({
        orderId: order._id,
        paymentContext: { gatewayId },
      });

      setMessage(
        formatMessage({
          id: 'payment_completed',
          defaultMessage: 'Payment completed successfully!',
        }),
      );
      router.replace(`/order/${result?.data?.checkoutCart?._id}/success`);
    } catch (err) {
      console.error('Error completing order:', err);
      setMessage(
        formatMessage({
          id: 'payment_checkout_error',
          defaultMessage: 'Error completing the order. Please try again.',
        }),
      );
    }
  };

  const signPayment = async () => {
    try {
      setLoading(true);
      const gatewayId = await sign({
        orderPaymentId: order.payment._id,
      });

      if (gatewayId) {
        handleCompleteOrder(gatewayId);
        setMessage(null);
      }
    } catch (err) {
      console.error('Error initializing Payrex transaction:', err);
      setMessage(
        formatMessage({
          id: 'payment_init_error',
          defaultMessage: 'Error initializing payment. Please try again.',
        }),
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    signPayment();
  }, []);

  return (
    <div className="flex flex-col space-y-4">
      <h2 className="text-lg font-medium text-foreground">
        {formatMessage({
          id: 'checkout_payment',
          defaultMessage: 'Checkout Payment',
        })}
      </h2>

      {loading && (
        <div className="flex items-center justify-center space-x-2 py-4">
          <div className="spinner border-t-2 border-primary rounded-full w-5 h-5 animate-spin" />
          <span className="text-muted-foreground">
            {formatMessage({
              id: 'payment_preparing',
              defaultMessage: 'Preparing payment...',
            })}
          </span>
        </div>
      )}

      {!loading && (
        <button
          onClick={handleCompleteOrder}
          className="btn btn-primary btn-lg w-full"
        >
          {formatMessage({
            id: 'complete_order',
            defaultMessage: 'Complete Order',
          })}
        </button>
      )}

      {message && (
        <div className="text-sm text-center text-muted-foreground mt-2">
          {message}
        </div>
      )}
    </div>
  );
};

export default PayrexxCheckoutButton;
