'use client';
import Image from 'next/image';

const AddToGoogleWalletButton = ({
  href,
  className,
}: {
  href: string;
  token?: string;
  hash?: string;
  className?: string;
}) => {
  return (
    <a
      className={className}
      href={href}
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: 829 / 151,
        display: 'block',
        objectPosition: 'center',
      }}
    >
      <Image src="/img/wallet-button.png" alt="Add to Google Wallet" fill />
    </a>
  );
};

export default AddToGoogleWalletButton;
