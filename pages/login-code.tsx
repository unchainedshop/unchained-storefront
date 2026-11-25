import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useIntl } from 'react-intl';
import Loading from '../modules/common/components/Loading';
import AuthLayout from '../modules/auth/components/AuthLayout';
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
    <AuthLayout
      title={formatMessage({
        id: 'login-link-invalid',
        defaultMessage: 'This login link is invalid or has expired',
      })}
    >
      <p className="text-center text-muted-foreground">
        {formatMessage({
          id: 'login-link-invalid-hint',
          defaultMessage:
            'Login links can only be used once. Request a new one from the login page.',
        })}
      </p>
      <Link href="/login" className="btn btn-primary mt-6 w-full">
        {formatMessage({ id: 'log_in', defaultMessage: 'Log In' })}
      </Link>
    </AuthLayout>
  );
};

export default LoginCodePage;
