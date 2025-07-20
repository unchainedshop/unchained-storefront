import { useIntl } from 'react-intl';
import { DevicePhoneMobileIcon } from '@heroicons/react/24/solid';
import ImageWithFallback from '../common/components/ImageWithFallback';
import formatUsername from '../common/utils/formatUsername';

const FallbackAvatar = ({ username }) => {
  return (
    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white border-2 border-slate-900">
      <span className="text font-medium leading-none text-white">
        {username?.slice(0, 2)}
      </span>
    </span>
  );
};

const DetailHeader = ({ user, contact }) => {
  const { formatMessage } = useIntl();
  return (
    <div className="flex items-center">
      <span className="hidden h-8 w-8 rounded-full sm:block">
        {user?.avatar ? (
          <ImageWithFallback
            src={user.avatar.url}
            alt={user.name || user.username}
            width={100}
            height={100}
          />
        ) : (
          <FallbackAvatar username={user?.username} />
        )}
      </span>
      <div>
        <div className="flex items-center">
          <span className="block h-8 w-8 rounded-full sm:hidden">
            {user?.avatar ? (
              <ImageWithFallback
                src="/no-image.jpg"
                alt={user.name || user.username}
                width={8}
                height={8}
              />
            ) : (
              <FallbackAvatar username={user?.username} />
            )}
          </span>
          <span className="flex items-center">
            <h3 className="ml-3 text-xl font-semibold capitalize">
              <span className="text-slate-500 dark:text-slate-400  hover:text-slate-600 dark:hover:text-slate-300">
                {formatUsername(user)}
              </span>
            </h3>
          </span>
        </div>
        <dl className="mt-6 flex flex-col sm:ml-3 sm:mt-1 sm:flex-row sm:flex-wrap">
          {contact?.emailAddress && (
            <>
              <dt className="sr-only">
                {formatMessage({ id: 'email', defaultMessage: 'Email' })}
              </dt>
              <dd className="flex items-center text-sm font-medium capitalize sm:mr-6">
                {contact.emailAddress}
              </dd>
            </>
          )}

          {contact?.telNumber && (
            <>
              <dt className="sr-only">
                {formatMessage({ id: 'phone', defaultMessage: 'Phone' })}
              </dt>
              <dd className="flex items-center text-sm font-medium capitalize text-slate-500 sm:mr-6">
                <DevicePhoneMobileIcon
                  className="mr-1.5 h-5 w-5 flex-shrink-0 text-slate-800"
                  aria-hidden="true"
                />
                {contact.telNumber}
              </dd>
            </>
          )}
        </dl>
      </div>
    </div>
  );
};

export default DetailHeader;
