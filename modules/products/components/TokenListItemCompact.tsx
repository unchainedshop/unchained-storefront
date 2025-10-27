import React from 'react';
import { useIntl } from 'react-intl';
import { ClipboardDocumentIcon } from '@heroicons/react/20/solid';
import Link from 'next/link';

const shorten = (value, start = 6, end = 4) =>
  value ? `${value.slice(0, start)}...${value.slice(-end)}` : '';

const TokenListItemCompact = ({ token }) => {
  const { formatMessage } = useIntl();
  const meta = token.ercMetadata || {};

  return (
    <Link
      href={`/tokens/${token._id}`}
      className="group relative bg-white border border-slate-200 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg dark:bg-slate-900 dark:border-0"
    >
      <div className="flex flex-col lg:flex-row gap-4 p-4 items-start lg:items-center">
        <div className="flex-1 min-w-0">
          <h4 className="text-lg font-semibold text-slate-900 dark:text-white truncate">
            {meta.name || token.tokenSerialNumber}
          </h4>
          <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600 dark:text-slate-300">
            {token.tokenSerialNumber && (
              <span>
                <span className="font-medium">
                  {formatMessage({
                    id: 'token_serial_number',
                    defaultMessage: 'Serial:',
                  })}
                </span>{' '}
                {token.tokenSerialNumber}
              </span>
            )}

            {meta.contractStandard && (
              <span>
                <span className="font-medium">
                  {formatMessage({
                    id: 'contract_standard',
                    defaultMessage: 'Standard:',
                  })}
                </span>{' '}
                {meta.contractStandard}
              </span>
            )}

            {token.status && (
              <span>
                <span className="font-medium">
                  {formatMessage({
                    id: 'token_status',
                    defaultMessage: 'Status:',
                  })}
                </span>{' '}
                {token.status}
              </span>
            )}

            {token.quantity && (
              <span>
                <span className="font-medium">
                  {formatMessage({
                    id: 'token_quantity',
                    defaultMessage: 'Quantity:',
                  })}
                </span>{' '}
                {token.quantity}
              </span>
            )}

            {token.walletAddress && (
              <span title={token.walletAddress}>
                <span className="font-medium">
                  {formatMessage({
                    id: 'wallet_address',
                    defaultMessage: 'Wallet:',
                  })}
                </span>{' '}
                {shorten(token.walletAddress)}
              </span>
            )}

            {token.contractAddress && (
              <span title={token.contractAddress}>
                <span className="font-medium">
                  {formatMessage({
                    id: 'contract_address',
                    defaultMessage: 'Address:',
                  })}
                </span>{' '}
                {shorten(token.contractAddress)}
              </span>
            )}

            {token.accessKey && (
              <span title={token.accessKey} className="flex items-center gap-1">
                <span className="font-medium">
                  {formatMessage({
                    id: 'access_key',
                    defaultMessage: 'Access Key:',
                  })}
                </span>{' '}
                {shorten(token.accessKey, 8, 8)}
                <ClipboardDocumentIcon className="h-4 w-4 text-slate-400 dark:text-slate-500 cursor-pointer" />
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default TokenListItemCompact;
