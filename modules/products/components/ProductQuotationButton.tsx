import Link from 'next/link';
import { ChatBubbleLeftIcon } from '@heroicons/react/24/outline';
import { useIntl } from 'react-intl';

const ProductQuotationButton = ({ product }) => {
  const intl = useIntl();
  const isQuotable =
    product?.status === 'ACTIVE' && product?.tags?.includes('quotable');

  if (!isQuotable) return null;

  return (
    <div className="pt-4">
      <Link
        href={`/quotation/request/${product?.texts?.slug}`}
        className="inline-flex items-center justify-center rounded-md text-sm font-medium w-full px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white transition-all duration-300"
      >
        <ChatBubbleLeftIcon className="h-5 w-5 mr-2" />
        {intl.formatMessage({
          id: 'request-quotation-offer',
          defaultMessage: 'Request Offer',
        })}
      </Link>
    </div>
  );
};

export default ProductQuotationButton;
