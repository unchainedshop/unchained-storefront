import getEngineURL from '../../modules/common/utils/getEngineURL';
import Ticket from '../../modules/products/components/Ticket';
import { useRouter } from 'next/router';

const DownloadPage = () => {
  const { query } = useRouter();
  const engineURL = getEngineURL(true);
  const frontendURL = new URL(
    process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000',
  );
  const barcodeUrl = `${frontendURL.origin}/download/${query.tokenId}?hash=${query?.hash}`;
  const pkpassUrl = `${engineURL.origin}/rest/apple-wallet/download/${query.tokenId}.pkpass?hash=${query?.hash}`;
  const googlePassUrl = `${engineURL.origin}/rest/google-wallet/download/${query.tokenId}?hash=${query?.hash}`;
  return (
    <main className="container">
      <Ticket
        pkpassUrl={pkpassUrl}
        barcodeUrl={barcodeUrl}
        googlePassUrl={googlePassUrl}
      />
    </main>
  );
};

export default DownloadPage;
