import Link from 'next/link';
import { useIntl } from 'react-intl';
import {
  UserCircleIcon,
  KeyIcon,
  EnvelopeIcon,
  MapPinIcon,
  TvIcon,
} from '@heroicons/react/24/outline';
import classNames from 'classnames';
import { useRouter } from 'next/router';
import useUser from '../../modules/auth/hooks/useUser';
import MetaTags from '../../modules/common/components/MetaTags';
import useRedirect from '../../modules/auth/hooks/useRedirect';
import Address from '../../modules/common/components/Address';

import ProfileView from '../../modules/auth/components/ProfileView';
import Loading from '../../modules/common/components/Loading';
import EmailAddresses from '../../modules/auth/components/EmailAddresses';

const getSubNavigation = (formatMessage) => [
  {
    name: formatMessage({
      id: 'general',
      defaultMessage: 'General',
    }),
    href: '#profileview',
    icon: UserCircleIcon,
    id: 'profileview',
  },
  {
    name: formatMessage({
      id: 'address',
      defaultMessage: 'Address',
    }),
    href: '#address',
    icon: MapPinIcon,
    id: 'address',
  },
  {
    name: formatMessage({
      id: 'emails',
      defaultMessage: 'Emails',
    }),
    href: '#email',
    icon: EnvelopeIcon,
    id: 'email',
  },
  {
    name: formatMessage({
      id: 'password',
      defaultMessage: 'Password',
    }),
    href: '#password',
    icon: KeyIcon,
    id: 'password',
  },
];

const Account = () => {
  const { user, loading, error } = useUser();
  const router = useRouter();
  const { formatMessage } = useIntl();
  const subNavigation = getSubNavigation(formatMessage);

  useRedirect({ to: '/login', matchAnonymous: true, matchGuests: true });

  if (loading) {
    return <Loading />;
  }

  if (error) {
    console.error('Account page error:', error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
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
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-foreground bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring"
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
        title={
          user?.username ||
          formatMessage({ id: 'account', defaultMessage: 'Account' })
        }
      />
      <div className="max-w-full bg-surface pb-10 lg:py-12">
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-5">
          <aside className="h-fit py-6 px-2 sm:px-6 lg:sticky lg:top-24 lg:col-span-3 lg:py-0 lg:px-0">
            <nav className="space-y-1 lg:sticky lg:top-24">
              {subNavigation.map((item) => (
                <Link
                  href={item.href}
                  key={item.name}
                  className={classNames(
                    'group flex items-center rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-muted hover:text-muted-foreground transition-colors',
                    {
                      'bg-muted text-foreground ':
                        item.id ===
                        (router.asPath.includes('#')
                          ? router.asPath.split('#')[1]
                          : 'profileview'),
                    },
                  )}
                >
                  <item.icon
                    className={classNames(
                      '-ml-1 mr-3 h-6 w-6 flex-shrink-0 text-foreground group-hover:text-muted-foreground ',
                      {
                        'text-foreground ':
                          item.id ===
                          (router.asPath.includes('#')
                            ? router.asPath.split('#')[1]
                            : 'profileview'),
                      },
                    )}
                    aria-hidden="true"
                  />
                  <span className="truncate">{item.name}</span>
                </Link>
              ))}
            </nav>
          </aside>

          {/* General */}
          <ProfileView user={user} />
          <EmailAddresses {...user} />

          {/* Address */}
          <Address user={user} />
          {/* Password */}
          <section
            id="password"
            aria-labelledby="password-heading"
            className="mt-10 space-y-6 sm:px-6 lg:col-span-9 lg:col-start-4 lg:px-0"
          >
            <div className="shadow sm:overflow-hidden sm:rounded-md">
              <div className="bg-surface py-6 px-4 sm:p-6">
                <div>
                  <h3
                    id="password-heading"
                    className="text-lg font-medium leading-6 text-foreground"
                  >
                    {formatMessage({
                      id: 'password',
                      defaultMessage: 'Password',
                    })}
                  </h3>
                  <p className="mt-2 text-sm text-subtle-foreground">
                    {formatMessage({
                      id: 'password_description',
                      defaultMessage:
                        'Manage your account password and security settings.',
                    })}
                  </p>
                </div>

                <div className="mt-6">
                  <div className="p-4 bg-muted rounded-lg border border-border">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {formatMessage({
                            id: 'current_password',
                            defaultMessage: 'Current password',
                          })}
                        </p>
                        <p className="text-sm text-subtle-foreground">
                          ••••••••••
                        </p>
                      </div>
                      <Link
                        href="account/change-password"
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-primary-foreground bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring"
                      >
                        {formatMessage({
                          id: 'change_password',
                          defaultMessage: 'Change Password',
                        })}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default Account;
