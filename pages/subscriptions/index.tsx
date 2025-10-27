import useUserSubscriptions from '../../modules/auth/hooks/useUserSubscriptions';
import Loading from '../../modules/common/components/Loading';
import EnrollmentList from '../../modules/products/components/EnrollmentList';

const MySubscriptions = () => {
  const { subscriptions, loading } = useUserSubscriptions();
  if (loading) return <Loading />;
  return <EnrollmentList enrollments={subscriptions} />;
};

export default MySubscriptions;
