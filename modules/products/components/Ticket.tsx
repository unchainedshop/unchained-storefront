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
      className="text-center mt-0 mx-auto p-3"
      hidden={!barcodeUrl}
      style={{
        maxWidth: '360px',
      }}
    >
      <h1 className="my-0">gastro.zuerich</h1>
      <h2 className="mb-0 fs-5 color-black">QR Code am Eingang vorweisen</h2>
      <AddToWalletButton href={pkpassUrl} />
      <div className="py-5">
        <QRCode value={barcodeUrl} />
      </div>
      <AddToGoogleWalletButton href={googlePassUrl} />
    </div>
  );
};

export default Ticket;
