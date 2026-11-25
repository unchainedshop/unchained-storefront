import { useState } from 'react';
import { useIntl } from 'react-intl';
import useExportToken from '../hooks/useExportToken';
import useWeb3Addresses from '../../auth/hooks/useWeb3Addresses';
import ErrorMessage from '../../common/components/ErrorMessage';

// Moves a token held by the shop (CENTRALIZED) to the customer's own wallet.
const TokenExportPanel = ({ token }) => {
  const { formatMessage } = useIntl();
  const { exportToken, loading } = useExportToken();
  const { addresses } = useWeb3Addresses();
  const verified = addresses.filter((entry) => entry.verified);
  const [recipient, setRecipient] = useState('');
  const [quantity, setQuantity] = useState(token.quantity || 1);
  const [error, setError] = useState<string | null>(null);
  const target = recipient || verified[0]?.address || '';

  if (token.status === 'EXPORTING')
    return (
      <p className="rounded-lg bg-warning-soft p-4 text-sm text-warning">
        {formatMessage({ id: 'token_exporting', defaultMessage: 'Export in progress. This can take a few minutes.' })}
      </p>
    );
  if (token.status !== 'CENTRALIZED')
    return (
      <p className="text-sm text-muted-foreground">
        {formatMessage(
          { id: 'token_in_wallet', defaultMessage: 'This token is in wallet {address}.' },
          { address: <span key="a" className="font-mono">{token.walletAddress}</span> },
        )}
      </p>
    );

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await exportToken({ tokenId: token._id, quantity: Number(quantity), recipientWalletAddress: target });
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <p className="text-sm text-muted-foreground">
        {formatMessage({
          id: 'token_export_hint',
          defaultMessage: 'Transfer this token from the shop to your own wallet. This cannot be undone.',
        })}
      </p>
      <div className="grid gap-4 sm:grid-cols-[1fr_120px]">
        <div>
          <label htmlFor="recipient" className="label">
            {formatMessage({ id: 'web3_address', defaultMessage: 'Wallet address' })}
          </label>
          {verified.length > 0 && !recipient ? (
            <select id="recipient" className="input font-mono" value={target} onChange={(e) => setRecipient(e.target.value)}>
              {verified.map(({ address }) => (
                <option key={address} value={address}>
                  {address}
                </option>
              ))}
            </select>
          ) : (
            <input
              id="recipient"
              required
              pattern="^0x[a-fA-F0-9]{40}$"
              placeholder="0x…"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="input font-mono"
            />
          )}
        </div>
        <div>
          <label htmlFor="export-quantity" className="label">
            {formatMessage({ id: 'quantity', defaultMessage: 'Quantity' })}
          </label>
          <input
            id="export-quantity"
            type="number"
            min={1}
            max={token.quantity || 1}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="input"
          />
        </div>
      </div>
      {error && <ErrorMessage message={error} />}
      <button type="submit" disabled={loading || !target} className="btn btn-primary">
        {formatMessage({ id: 'token_export', defaultMessage: 'Export to wallet' })}
      </button>
    </form>
  );
};

export default TokenExportPanel;
