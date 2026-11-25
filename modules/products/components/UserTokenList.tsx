import EmptyState from '../../common/components/EmptyState';
import { TicketIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import React from 'react';
import TokenListItemCompact from './TokenListItemCompact';
import { useIntl } from 'react-intl';

const UserTokenList = ({ tokens }) => {
  const { formatMessage } = useIntl();

  if (!tokens?.length) {
    return (
      <EmptyState icon={TicketIcon} title={formatMessage({ id: 'tokens_empty', defaultMessage: 'No tokens yet' })} description={formatMessage({ id: 'tokens_empty_text', defaultMessage: 'Tickets and digital items you buy will appear here.' })}>
        <Link href="/shop" className="btn btn-secondary">
          {formatMessage({ id: 'continue_shopping', defaultMessage: 'Continue Shopping' })}
        </Link>
      </EmptyState>
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
