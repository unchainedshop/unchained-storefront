import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useIntl } from 'react-intl';
import Loading from '../modules/common/components/Loading';
import useLoginWithLoginCode from '../modules/auth/hooks/useLoginWithLoginCode';

const LoginCodePage = () => {
  const router = useRouter();
  const { formatMessage } = useIntl();
  const { loginWithLoginCode } = useLoginWithLoginCode();
  const [failed, setFailed] = useState(false);
  const consumed = useRef(false);
  const token = router.query.token as string;

  useEffect(() => {
    if (!token || consumed.current) return;
    consumed.current = true;
    loginWithLoginCode({ token })
      .then(() => router.replace('/'))
      .catch(() => setFailed(true));
  }, [token]);

  if (!failed) return <Loading />;

  return (
    <div className="mx-auto mt-16 max-w-md rounded-xl bg-white p-8 text-center shadow-xl dark:bg-slate-700">
      <h2 className="text-2xl font-semibold text-red-800 dark:text-red-300">
        {formatMessage({
          id: 'login-link-invalid',
          defaultMessage: 'This login link is invalid or has expired',
        })}
      </h2>
      <p className="mt-3 text-slate-700 dark:text-slate-200">
        {formatMessage({
          id: 'login-link-invalid-hint',
          defaultMessage:
            'Login links can only be used once. Request a new one from the login page.',
        })}
      </p>
      <Link
        href="/login"
        className="mt-6 inline-block rounded bg-slate-800 px-4 py-2 text-white"
      >
        {formatMessage({ id: 'log_in', defaultMessage: 'Log In' })}
      </Link>
    </div>
  );
};

export default LoginCodePage;
