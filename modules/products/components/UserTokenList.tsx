import React from 'react';
import TokenListItemCompact from './TokenListItemCompact';
import { useIntl } from 'react-intl';

const UserTokenList = ({ tokens }) => {
  const { formatMessage } = useIntl();

  if (!tokens?.length) {
    return (
      <div className="text-center text-gray-500 mt-10">
        {formatMessage({
          id: 'no_user_tokens',
          defaultMessage: 'No tokens found.',
        })}
      </div>
    );
  }

  return (
    <section
      id="quotations-view"
      className="space-y-6 mt-5 sm:px-6 lg:col-span-9 lg:col-start-4 lg:px-0"
      aria-labelledby="account-details-heading"
    >
      <div className="max-w-5xl mx-auto mt-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          {formatMessage({
            id: 'my_tokens_header',
            defaultMessage: 'My tokens',
          })}
        </h2>
        {tokens.map((token) => (
          <TokenListItemCompact key={token._id} token={token} />
        ))}
      </div>
    </section>
  );
};

export default UserTokenList;
