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

  return <QuotationRequestForm product={product} />;
};

export default QuotationRequestPage;
