import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import PageHeader from '../../../modules/common/components/PageHeader';
import MetaTags from '../../../modules/common/components/MetaTags';
import { useRouter } from 'next/router';
import QuotationRequestForm from '../../../modules/products/components/QuotationRequestForm';
import useProductDetail from '../../../modules/products/hooks/useProductDetail';
import Loading from '../../../modules/common/components/Loading';
import NotFound from '../../404';
import { useIntl } from 'react-intl';

const QuotationRequestPage = () => {
  const router = useRouter();
  const { formatMessage } = useIntl();
  const { product, loading } = useProductDetail({
    slug: router.query.slug,
  });
  if (loading) return <Loading />;
  if (!product && !loading)
    return (
      <NotFound
        page={formatMessage({
          id: 'product',
          defaultMessage: 'Product',
        })}
      />
    );

  return (
    <>
      <MetaTags title={formatMessage({ id: 'request-quotation-offer', defaultMessage: 'Request offer' })} />
      <PageHeader
        icon={ChatBubbleLeftRightIcon}
        eyebrow={formatMessage({ id: 'request-quotation-offer', defaultMessage: 'Request offer' })}
        title={product.texts?.title}
        description={formatMessage({
          id: 'quotation_request_intro',
          defaultMessage: 'Tell us what you need and we will send you a personal offer. You can accept it in your account.',
        })}
      />
      <QuotationRequestForm product={product} />
    </>
  );
};

export default QuotationRequestPage;
