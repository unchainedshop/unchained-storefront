import { useRouter } from 'next/router';
import { useIntl } from 'react-intl';
import useCheckoutByInvoice from '../cart/hooks/useCheckoutByInvoice';
import Button from '../common/components/Button';

const InvoiceCheckoutButton = () => {
  const { formatMessage } = useIntl();
  const { checkoutByInvoice } = useCheckoutByInvoice();
  const router = useRouter();

  const checkout = async () => {
    const result = await checkoutByInvoice();
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
      className="mt-6 w-full rounded-md border border-transparent bg-red-600 py-3 px-4 text-base font-medium text-white shadow-xs hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-800 focus:ring-offset-2 focus:ring-offset-slate-50"
    />
  );
};

export default InvoiceCheckoutButton;
