import Link from 'next/link';
import { useIntl } from 'react-intl';
import MetaTags from '../modules/common/components/MetaTags';

const ServerError = () => {
  const { formatMessage } = useIntl();
  return (
    <>
      <MetaTags title="500" />
      <div className="flex flex-col items-center py-20 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-danger">500</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
          {formatMessage({ id: '500-error-header', defaultMessage: 'Something went wrong' })}
        </h1>
        <p className="mt-4 max-w-md text-muted-foreground">
          {formatMessage({
            id: '500-error-description',
            defaultMessage: 'We could not complete your request. Please try again in a moment.',
          })}
        </p>
        <div className="mt-8 flex gap-3">
          <button type="button" onClick={() => window.location.reload()} className="btn btn-primary">
            {formatMessage({ id: 'try_again', defaultMessage: 'Try again' })}
          </button>
          <Link href="/" className="btn btn-secondary">
            {formatMessage({ id: 'back_to_shop', defaultMessage: 'Back to the shop' })}
          </Link>
        </div>
      </div>
    </>
  );
};

export default ServerError;
