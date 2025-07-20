import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useIntl } from 'react-intl';
import Loading from '../modules/common/components/Loading';
import useVerifyEmail from '../modules/auth/hooks/useVerifyEmail';

const VerifyEmail = () => {
  const { query } = useRouter();
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
  }, [query.token]);

  if (result.success === null) return <Loading />;
  return (
    <div className="flex items-center justify-center min-h-screen p-5 dark:bg-slate-500 min-w-screen">
      <div
        className={classNames(
          'max-w-xl p-8 text-center  bg-white shadow-xl lg:max-w-3xl rounded-xl lg:p-12 ',
          {
            'text-stone-800': result.success,
            'text-red-800': !result.success,
          },
        )}
      >
        <h3 className="text-2xl text-slate-800">
          {result.success ? 'Email Verified successfully' : result.message}
        </h3>
        <div className="flex justify-center">
          {result.success ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-24 h-24 text-green-400"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21.75 9v.906a2.25 2.25 0 01-1.183 1.981l-6.478 3.488M2.25 9v.906a2.25 2.25 0 001.183 1.981l6.478 3.488m8.839 2.51l-4.66-2.51m0 0l-1.023-.55a2.25 2.25 0 00-2.134 0l-1.022.55m0 0l-4.661 2.51m16.5 1.615a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V8.844a2.25 2.25 0 011.183-1.98l7.5-4.04a2.25 2.25 0 012.134 0l7.5 4.04a2.25 2.25 0 011.183 1.98V19.5z"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-24 h-24 text-red-400"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          )}
        </div>

        <p className="text-slate-800">
          {result.success
            ? formatMessage({
                id: 'thank-you-for-verifying',
                defaultMessage: 'Thank you for verifying your email address',
              })
            : formatMessage({
                id: 'resend-another-verification',
                defaultMessage:
                  'Please resend another verification email and try to verify again',
              })}
        </p>
        <div className="mt-4">
          <Link href="/" legacyBehavior>
            <a
              type="button"
              className="px-4 py-2 text-white bg-slate-800 rounded"
            >
              {formatMessage({
                id: 'go-home',
                defaultMessage: 'Go to home',
              })}
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;

VerifyEmail.getLayout = (page) => page;
