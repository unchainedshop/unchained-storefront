import { useIntl } from 'react-intl';
import Button from '../common/components/Button';
import useSignPaymentProviderForCheckout from './hooks/useSignPaymentProviderForCheckout';

const DatatransCheckoutButton = ({ order }) => {
  const { formatMessage } = useIntl();
  const { sign } = useSignPaymentProviderForCheckout();

  const signDatatrans = async (event) => {
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
      const signed = await sign({
        orderPaymentId: order.payment._id,
        transactionContext,
      });
      if (signed) {
        const { location } = JSON.parse(signed);
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
      onClick={signDatatrans}
      className="btn btn-primary btn-lg mt-2 w-full"
    />
  );
};

export default DatatransCheckoutButton;
