import useUserQuotations from '../../modules/auth/hooks/useUserQuotations';
import Loading from '../../modules/common/components/Loading';
import QuotationList from '../../modules/products/components/QuotationList';

const MyQuotations = () => {
  const { quotations, loading } = useUserQuotations();
  if (loading) return <Loading />;
  return <QuotationList quotations={quotations} />;
};

export default MyQuotations;
