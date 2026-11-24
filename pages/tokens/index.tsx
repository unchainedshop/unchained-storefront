import { useIntl } from 'react-intl';
import AccountLayout from '../../modules/auth/components/AccountLayout';
import useUserTokens from '../../modules/auth/hooks/useUserTokens';
import Loading from '../../modules/common/components/Loading';
import UserTokenList from '../../modules/products/components/UserTokenList';

const MyTokens = () => {
  const { tokens, loading } = useUserTokens();
  const { formatMessage } = useIntl();
  return (
    <AccountLayout title={formatMessage({ id: 'my_tokens_header', defaultMessage: 'My tokens' })}>
      {loading ? <Loading /> : <UserTokenList tokens={tokens} />}
    </AccountLayout>
  );
};

export default MyTokens;
