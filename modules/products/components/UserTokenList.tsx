import React from 'react';
import TokenListItemCompact from './TokenListItemCompact';
import { useIntl } from 'react-intl';

const UserTokenList = ({ tokens }) => {
  const { formatMessage } = useIntl();

  if (!tokens?.length) {
    return (
      <div className="text-center text-subtle-foreground mt-10">
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
      className="space-y-6"
      aria-labelledby="account-details-heading"
    >
      <div>
        {tokens.map((token) => (
          <TokenListItemCompact key={token._id} token={token} />
        ))}
      </div>
    </section>
  );
};

export default UserTokenList;
