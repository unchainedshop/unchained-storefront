import { useRouter } from 'next/router';
import { useIntl } from 'react-intl';
import useCheckoutCart from '../cart/hooks/useCheckoutCart';
import Button from '../common/components/Button';

const InvoiceCheckoutButton = () => {
  const { formatMessage } = useIntl();
  const { checkoutCart } = useCheckoutCart();
  const router = useRouter();

  const checkout = async () => {
    const result = await checkoutCart();
    router.replace(`/order/${result.data.checkoutCart._id}/success`);
  };

  return (
    <Button
      type="button"
      text={formatMessage({
        id: 'send-order',
        defaultMessage: 'Send Order',
      })}
      onClick={checkout}
      className="btn btn-primary btn-lg mt-2 w-full"
    />
  );
};

export default InvoiceCheckoutButton;
