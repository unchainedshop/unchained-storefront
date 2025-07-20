import React from 'react';
import { useIntl } from 'react-intl';

import MetaTags from '../modules/common/components/MetaTags';

const NotFound = ({ page = '' }) => {
  const { formatMessage } = useIntl();

  return (
    <>
      <MetaTags title="404: Not Found" />

      <div className="text-danger p-md-5 container p-3 text-center">
        <div className="p-lg-5 mb-4">
          <h1 className="font-weight-bolder font-dax-ot-regular">
            {formatMessage(
              {
                id: '404-not-found-header',
                defaultMessage: `404: Requested {page} not found`,
              },
              {
                page: page || 'page',
              },
            )}{' '}
          </h1>
          <div className="mb-5">
            <div className="text-center">
              <p>
                {formatMessage({
                  id: '404_not-found-message',
                  defaultMessage:
                    'Sorry, the page you were looking for was not found!',
                })}
              </p>
            </div>
          </div>
        </div>
        <div />
      </div>
    </>
  );
};

export default NotFound;
