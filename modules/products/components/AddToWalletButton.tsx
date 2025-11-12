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
      className={className}
      href={href}
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: 55 / 17,
        display: 'block',
      }}
    >
      <Image
        src="/img/DE_Add_to_Apple_Wallet_RGB_101421.svg"
        alt="Add to Apple Wallet"
        fill
      />
    </a>
  );
};

export default AddToWalletButton;
