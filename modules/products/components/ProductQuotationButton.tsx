import Link from 'next/link';
import { ChatBubbleLeftIcon } from '@heroicons/react/24/outline';
import { useIntl } from 'react-intl';

const ProductQuotationButton = ({ product }) => {
  const intl = useIntl();
  const isQuotable =
    product?.status === 'ACTIVE' && product?.tags?.includes('quotable');

  if (!isQuotable) return null;

  return (
    <div>
      <Link
        href={`/quotation/request/${product?.texts?.slug}`}
        className="btn btn-secondary w-full rounded-full"
      >
        <ChatBubbleLeftIcon className="size-5" />
        {intl.formatMessage({
          id: 'request-quotation-offer',
          defaultMessage: 'Request offer',
        })}
      </Link>
    </div>
  );
};

export default ProductQuotationButton;
