import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useIntl } from 'react-intl';
import { ArrowRightStartOnRectangleIcon, FingerPrintIcon, KeyIcon, WalletIcon } from '@heroicons/react/24/outline';
import useWeb3Addresses from '../../modules/auth/hooks/useWeb3Addresses';
import AccountLayout from '../../modules/auth/components/AccountLayout';
import useAccountSecurity from '../../modules/auth/hooks/useAccountSecurity';
import useFormatDateTime from '../../modules/common/utils/useFormatDateTime';
import ErrorMessage from '../../modules/common/components/ErrorMessage';
import MetaTags from '../../modules/common/components/MetaTags';

const Section = ({ icon: Icon, title, description, action = null, children = null }) => (
  <section className="card p-5 sm:p-6">
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div className="flex gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent-foreground">
          <Icon className="size-5" />
        </span>
        <div>
          <h2 className="font-semibold">{title}</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      {action}
    </div>
    {children}
  </section>
);

const SecurityPage = () => {
  const { formatMessage } = useIntl();
  const { formatDateTime } = useFormatDateTime();
  const router = useRouter();
  const { passkeys, addPasskey, removePasskey, logoutAllSessions } = useAccountSecurity();
  const {
    addresses,
    hasWallet,
    add: addAddress,
    verify: verifyAddress,
    remove: removeAddress,
    connectWallet,
  } = useWeb3Addresses();
  const [walletAvailable, setWalletAvailable] = useState(false);
  const [web3Error, setWeb3Error] = useState<string | null>(null);

  const run = async (action: () => Promise<unknown>) => {
    setWeb3Error(null);
    try {
      await action();
    } catch (e) {
      setWeb3Error((e as Error).message);
    }
  };
  const [passkeysSupported, setPasskeysSupported] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setPasskeysSupported(typeof window !== 'undefined' && Boolean(window.PublicKeyCredential));
    setWalletAvailable(hasWallet);
  }, [hasWallet]);

  const title = formatMessage({ id: 'security', defaultMessage: 'Security' });

  const onAddPasskey = async () => {
    setError(null);
    try {
      await addPasskey();
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const onLogoutEverywhere = async () => {
    if (!window.confirm(formatMessage({ id: 'logout_all_confirm', defaultMessage: 'Log out on all devices, including this one?' })))
      return;
    await logoutAllSessions();
    router.push('/login');
  };

  return (
    <>
      <MetaTags title={title} />
      <AccountLayout title={title}>
        <div className="space-y-4">
          <Section
            icon={KeyIcon}
            title={formatMessage({ id: 'password', defaultMessage: 'Password' })}
            description={formatMessage({ id: 'password_description', defaultMessage: 'Change the password you use to log in.' })}
            action={
              <Link href="/account/change-password" className="btn btn-secondary btn-sm">
                {formatMessage({ id: 'change_password', defaultMessage: 'Change Password' })}
              </Link>
            }
          />

          <Section
            icon={FingerPrintIcon}
            title={formatMessage({ id: 'passkeys', defaultMessage: 'Passkeys' })}
            description={formatMessage({
              id: 'passkeys_description',
              defaultMessage: 'Log in with your fingerprint, face or device screen lock instead of a password.',
            })}
            action={
              passkeysSupported && (
                <button type="button" onClick={onAddPasskey} className="btn btn-secondary btn-sm">
                  {formatMessage({ id: 'add_passkey', defaultMessage: 'Add passkey' })}
                </button>
              )
            }
          >
            {error && (
              <div className="mt-4">
                <ErrorMessage message={error} />
              </div>
            )}
            {passkeys.length > 0 && (
              <ul className="mt-4 divide-y divide-border rounded-lg border border-border">
                {passkeys.map((passkey) => (
                  <li key={passkey._id} className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
                    <span>
                      <span className="block font-medium">
                        {passkey.mdsMetadata?.description || formatMessage({ id: 'passkey', defaultMessage: 'Passkey' })}
                      </span>
                      <span className="text-xs text-subtle-foreground">
                        {formatMessage(
                          { id: 'passkey_added_on', defaultMessage: 'Added {date}' },
                          { date: formatDateTime(passkey.created, { dateStyle: 'medium' }) },
                        )}
                      </span>
                    </span>
                    <button
                      type="button"
                      onClick={() => removePasskey(passkey._id)}
                      className="btn btn-ghost btn-sm text-danger"
                    >
                      {formatMessage({ id: 'remove', defaultMessage: 'Remove' })}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </Section>

          <Section
            icon={WalletIcon}
            title={formatMessage({ id: 'web3_wallets', defaultMessage: 'Crypto wallets' })}
            description={formatMessage({
              id: 'web3_wallets_description',
              defaultMessage: 'Link a wallet to receive digital items such as tickets or NFTs you buy.',
            })}
            action={
              walletAvailable && (
                <button type="button" onClick={() => run(connectWallet)} className="btn btn-secondary btn-sm">
                  {formatMessage({ id: 'web3_connect', defaultMessage: 'Connect wallet' })}
                </button>
              )
            }
          >
            {web3Error && (
              <div className="mt-4">
                <ErrorMessage message={web3Error} />
              </div>
            )}
            {addresses.length > 0 && (
              <ul className="mt-4 divide-y divide-border rounded-lg border border-border">
                {addresses.map(({ address, verified }) => (
                  <li key={address} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-sm">
                    <span className="flex min-w-0 items-center gap-2">
                      <span className="truncate font-mono">{address}</span>
                      <span className={`badge ${verified ? 'badge-success' : 'badge-warning'}`}>
                        {verified
                          ? formatMessage({ id: 'web3_verified', defaultMessage: 'Verified' })
                          : formatMessage({ id: 'web3_unverified', defaultMessage: 'Not verified' })}
                      </span>
                    </span>
                    <span className="flex gap-2">
                      {!verified && walletAvailable && (
                        <button type="button" onClick={() => run(() => verifyAddress(address))} className="btn btn-secondary btn-sm">
                          {formatMessage({ id: 'web3_verify', defaultMessage: 'Verify' })}
                        </button>
                      )}
                      <button type="button" onClick={() => run(() => removeAddress(address))} className="btn btn-ghost btn-sm text-danger">
                        {formatMessage({ id: 'remove', defaultMessage: 'Remove' })}
                      </button>
                    </span>
                  </li>
                ))}
              </ul>
            )}
            {!walletAvailable && (
              <form
                className="mt-4 flex gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  const input = e.currentTarget.elements.namedItem('address') as HTMLInputElement;
                  run(async () => {
                    await addAddress(input.value.trim());
                    input.value = '';
                  });
                }}
              >
                <input
                  name="address"
                  required
                  pattern="^0x[a-fA-F0-9]{40}$"
                  placeholder="0x…"
                  aria-label={formatMessage({ id: 'web3_address', defaultMessage: 'Wallet address' })}
                  className="input font-mono"
                />
                <button type="submit" className="btn btn-secondary">
                  {formatMessage({ id: 'web3_add', defaultMessage: 'Add' })}
                </button>
              </form>
            )}
          </Section>

          <Section
            icon={ArrowRightStartOnRectangleIcon}
            title={formatMessage({ id: 'sessions', defaultMessage: 'Sessions' })}
            description={formatMessage({
              id: 'sessions_description',
              defaultMessage: 'Lost a device or logged in somewhere public? End every session at once.',
            })}
            action={
              <button type="button" onClick={onLogoutEverywhere} className="btn btn-secondary btn-sm text-danger">
                {formatMessage({ id: 'logout_all', defaultMessage: 'Log out on all devices' })}
              </button>
            }
          />
        </div>
      </AccountLayout>
    </>
  );
};

export default SecurityPage;
