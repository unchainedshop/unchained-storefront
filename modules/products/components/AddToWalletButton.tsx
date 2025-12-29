import Image from 'next/image';
import { useEffect, useState } from 'react';

const AddToWalletButton = ({
  href,
  className = '',
}: {
  href: string;
  className?: string;
}) => {
  const [appleWalletSupported, setAppleWalletSupported] = useState(false);

  useEffect(() => {
    setAppleWalletSupported(
      CSS?.supports('-apple-pay-button-style', 'inherit') || false,
    );
  }, []);

  if (!appleWalletSupported) return null;

  return (
    <a
      href={href}
      aria-label="Add to Apple Wallet"
      className={`relative block w-full overflow-hidden rounded-lg transition
        hover:opacity-90 active:scale-[0.99] ${className}`}
      style={{ aspectRatio: '55 / 17' }}
    >
      <Image
        src="/apple-wallet.svg"
        alt="Add to Apple Wallet"
        fill
        priority
        className="object-contain"
      />
    </a>
  );
};

export default AddToWalletButton;
