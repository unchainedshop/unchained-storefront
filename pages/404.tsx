import React from 'react';
import Link from 'next/link';
import { useIntl } from 'react-intl';

import MetaTags from '../modules/common/components/MetaTags';

const NotFound = ({ page = '' }) => {
  const { formatMessage } = useIntl();

  return (
    <>
      <MetaTags title="404: Not Found" />

      <div className="flex flex-col items-center py-20 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-accent">404</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
          {formatMessage(
            { id: '404-not-found-header', defaultMessage: 'Requested {page} not found' },
            { page: page || 'page' },
          )}
        </h1>
        <p className="mt-4 max-w-md text-muted-foreground">
          {formatMessage({
            id: '404_not-found-message',
            defaultMessage: 'Sorry, the page you were looking for was not found!',
          })}
        </p>
        <div className="mt-8 flex gap-3">
          <Link href="/" className="btn btn-primary">
            {formatMessage({ id: 'back_to_shop', defaultMessage: 'Back to the shop' })}
          </Link>
          <Link href="/search" className="btn btn-secondary">
            {formatMessage({ id: 'search_products', defaultMessage: 'Search products' })}
          </Link>
        </div>
      </div>
    </>
  );
};

export default NotFound;
