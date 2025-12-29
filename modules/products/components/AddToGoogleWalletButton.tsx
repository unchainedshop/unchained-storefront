'use client';
import Image from 'next/image';

const AddToGoogleWalletButton = ({
  href,
  className = '',
}: {
  href: string;
  token?: string;
  hash?: string;
  className?: string;
}) => {
  return (
    <a
      href={href}
      aria-label="Add to Google Wallet"
      className={`relative block w-full overflow-hidden rounded-lg transition
        hover:opacity-90 active:scale-[0.99] ${className}`}
      style={{ aspectRatio: '829 / 151' }}
    >
      <Image
        src="/wallet-button.png"
        alt="Add to Google Wallet"
        fill
        priority
        className="object-contain"
      />
    </a>
  );
};

export default AddToGoogleWalletButton;
