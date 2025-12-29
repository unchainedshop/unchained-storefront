import { useEffect } from 'react';
import AddToWalletButton from './AddToWalletButton';
import AddToGoogleWalletButton from './AddToGoogleWalletButton';
import QRCode from './QRCode';

const Ticket = ({ barcodeUrl, pkpassUrl, googlePassUrl }) => {
  useEffect(() => {
    const appleWalletSupported =
      CSS?.supports('-apple-pay-button-style', 'inherit') || false;

    if (appleWalletSupported) {
      setTimeout(() => {
        window.location = pkpassUrl;
      }, 1000);
    }
  }, []);

  return (
    <div
      hidden={!barcodeUrl}
      className="mx-auto flex flex-col items-center rounded-2xl bg-white px-4 py-6 text-center shadow-sm"
      style={{ maxWidth: '360px' }}
    >
      <h1 className="text-lg font-semibold tracking-tight text-gray-900">
        Unchained Store
      </h1>

      <p className="mt-1 text-sm text-gray-600">
        QR Code
      </p>

      <div className="mt-4 w-full">
        <AddToWalletButton href={pkpassUrl} />
      </div>

      <div className="my-6 w-56 h-56 rounded-xl border bg-white p-3">
        <QRCode value={barcodeUrl} />
      </div>

      <div className="w-full">
        <AddToGoogleWalletButton href={googlePassUrl} />
      </div>
    </div>
  );
};

export default Ticket;
