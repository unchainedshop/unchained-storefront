import { useIntl } from 'react-intl';
import Button from '../common/components/Button';
import useSignPaymentProviderForCheckout from './hooks/useSignPaymentProviderForCheckout';

const PostfinancenCheckoutButton = ({ order }) => {
  const { formatMessage } = useIntl();
  const { sign } = useSignPaymentProviderForCheckout();

  const signDatatrans = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    try {
      const transactionContext = {
        successRedirectUrl: `${window.location.origin}/order/${order._id}/success`,
        cancelRedirectUrl: `${window.location.origin}/checkout`,
        failedRedirectUrl: `${window.location.origin}/checkout?error=1`,
      };
      const signed = await sign({
        orderPaymentId: order.payment._id,
        transactionContext,
      });
      if (signed) {
        const paymentResponse = JSON.parse(signed);
        const paymentLink = paymentResponse?.location;
        if (paymentLink) {
          document.location.href = paymentLink;
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
      onClick={signDatatrans}
      className="btn btn-primary btn-lg mt-2 w-full"
    />
  );
};

export default PostfinancenCheckoutButton;
