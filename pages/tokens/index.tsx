import useUserTokens from '../../modules/auth/hooks/useUserTokens';
import Loading from '../../modules/common/components/Loading';
import UserTokenList from '../../modules/products/components/UserTokenList';

const MyTokens = () => {
  const { tokens, loading } = useUserTokens();
  if (loading) return <Loading />;
  return <UserTokenList tokens={tokens} />;
};

export default MyTokens;
