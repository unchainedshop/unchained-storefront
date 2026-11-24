import { useIntl } from 'react-intl';
import AccountLayout from '../../modules/auth/components/AccountLayout';
import useUserQuotations from '../../modules/auth/hooks/useUserQuotations';
import Loading from '../../modules/common/components/Loading';
import QuotationList from '../../modules/products/components/QuotationList';

const MyQuotations = () => {
  const { quotations, loading } = useUserQuotations();
  const { formatMessage } = useIntl();
  return (
    <AccountLayout title={formatMessage({ id: 'quotation_list_title', defaultMessage: 'Quotation Requests' })}>
      {loading ? <Loading /> : <QuotationList quotations={quotations} />}
    </AccountLayout>
  );
};

export default MyQuotations;
