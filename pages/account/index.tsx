import { useIntl } from 'react-intl';
import useUser from '../../modules/auth/hooks/useUser';
import AccountLayout from '../../modules/auth/components/AccountLayout';
import MetaTags from '../../modules/common/components/MetaTags';
import Address from '../../modules/common/components/Address';

import ProfileView from '../../modules/auth/components/ProfileView';
import Loading from '../../modules/common/components/Loading';
import EmailAddresses from '../../modules/auth/components/EmailAddresses';

const Account = () => {
  const { user, loading, error } = useUser();
  const { formatMessage } = useIntl();

  if (loading) {
    return <Loading />;
  }

  if (error) {
    console.error('Account page error:', error);
    return (
      <div className="flex items-center justify-center py-20">
        <div className="max-w-md w-full text-center">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            {formatMessage({
              id: 'error_loading_account',
              defaultMessage: 'Error Loading Account',
            })}
          </h2>
          <p className="text-muted-foreground mb-6">
            {error.message ||
              formatMessage({
                id: 'generic_error',
                defaultMessage: 'Something went wrong. Please try again.',
              })}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="btn btn-primary"
          >
            {formatMessage({
              id: 'reload_page',
              defaultMessage: 'Reload Page',
            })}
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <MetaTags
        title={user?.username || formatMessage({ id: 'account', defaultMessage: 'Account' })}
      />
      <AccountLayout title={formatMessage({ id: 'profile', defaultMessage: 'Profile' })}>
        <ProfileView user={user} />
        <EmailAddresses {...user} />
        <Address user={user} />
      </AccountLayout>
    </>
  );
};

export default Account;
