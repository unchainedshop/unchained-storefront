import { useIntl } from 'react-intl';
import AccountLayout from '../../modules/auth/components/AccountLayout';
import useUserSubscriptions from '../../modules/auth/hooks/useUserSubscriptions';
import Loading from '../../modules/common/components/Loading';
import EnrollmentList from '../../modules/products/components/EnrollmentList';

const MySubscriptions = () => {
  const { subscriptions, loading } = useUserSubscriptions();
  const { formatMessage } = useIntl();
  return (
    <AccountLayout title={formatMessage({ id: 'subscriptions', defaultMessage: 'Subscriptions' })}>
      {loading ? <Loading /> : <EnrollmentList enrollments={subscriptions} />}
    </AccountLayout>
  );
};

export default MySubscriptions;
