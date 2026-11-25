import React, { useEffect, useState } from 'react';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import AuthLayout from '../modules/auth/components/AuthLayout';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useIntl } from 'react-intl';
import Loading from '../modules/common/components/Loading';
import useVerifyEmail from '../modules/auth/hooks/useVerifyEmail';

const VerifyEmail = () => {
  const { query, isReady } = useRouter();
  const { verifyEmail } = useVerifyEmail();
  const { formatMessage } = useIntl();
  const [result, setResult] = useState({ success: null, message: null });

  useEffect(() => {
    const verify = async () => {
      try {
        await verifyEmail({ token: query.token });
        setResult({
          ...result,
          success: true,
        });
      } catch (e) {
        if ((e as any).message.includes('expired'))
          setResult({
            success: false,
            message: formatMessage({
              id: 'verification-token-expired',
              defaultMessage: 'Verification token expired',
            }),
          });
        else
          setResult({
            success: false,
            message: formatMessage({
              id: 'verification-failed',
              defaultMessage: 'Verification Failed',
            }),
          });
      }
    };
    if (query.token) verify();
    else if (isReady)
      setResult({
        success: false,
        message: formatMessage({ id: 'verification-failed', defaultMessage: 'Verification Failed' }),
      });
  }, [query.token, isReady]);

  if (result.success === null) return <Loading />;
  return (
    <AuthLayout
      title={
        result.success
          ? formatMessage({ id: 'email_verified', defaultMessage: 'Email verified' })
          : result.message
      }
    >
      <div className="flex flex-col items-center text-center">
        <span
          className={`flex size-14 items-center justify-center rounded-full ${
            result.success ? 'bg-success-soft text-success' : 'bg-danger-soft text-danger'
          }`}
        >
          {result.success ? <CheckIcon className="size-7" /> : <XMarkIcon className="size-7" />}
        </span>
        <p className="mt-4 text-muted-foreground">
          {result.success
            ? formatMessage({
                id: 'thank-you-for-verifying',
                defaultMessage: 'Thank you for verifying your email address',
              })
            : formatMessage({
                id: 'resend-another-verification',
                defaultMessage: 'Please resend another verification email and try to verify again',
              })}
        </p>
        <Link href="/" className="btn btn-primary mt-6 w-full">
          {formatMessage({ id: 'go-home', defaultMessage: 'Go to home' })}
        </Link>
      </div>
    </AuthLayout>
  );
};

export default VerifyEmail;

