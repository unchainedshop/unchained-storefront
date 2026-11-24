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
      className="mt-6 w-full rounded-md border border-transparent bg-danger py-3 px-4 text-base font-medium text-white shadow-xs hover:bg-danger/90 focus:outline-none focus:ring-2 focus:ring-danger focus:ring-offset-2 focus:ring-offset-background"
    />
  );
};

export default InvoiceCheckoutButton;
