import Image from 'next/image';
import Link from 'next/link';
import { useIntl } from 'react-intl';
import defaultNextImageLoader from '../../common/utils/defaultNextImageLoader';

const SoldEventTicketListItem = ({ product }) => {
  const { formatMessage } = useIntl();
  const { contractConfiguration, texts, _id, media, meta, simulatedStocks } =
    product || {};

  const remainingTickets =
    simulatedStocks?.reduce((acc, cur) => acc + (cur?.quantity || 0), 0) || 0;

  const totalSupply = contractConfiguration?.supply || 0;
  const bookedTickets = Math.max(totalSupply - remainingTickets, 0);

  const imageUrl = media?.[0]?.file?.url || '/portal/img/default-event.jpg';

  return (
    <Link
      href={`/portal/events/${_id}`}
      className="w-100 d-inline-block mt-4 color-bg-blue-sky color-white shadow-lg border-radius-lg overflow-hidden"
    >
      <Image
        src={imageUrl}
        quality={80}
        width={512}
        height={512}
        className="w-100 border-radius-lg p-2 object-fit-cover"
        alt={texts?.title || 'Event image'}
        loader={defaultNextImageLoader}
      />

      <div className="p-3 p-lg-4">
        <h3 className="mt-0 color-white">
          {texts?.title || 'Unbenanntes Event'}
        </h3>

        <div className="mb-3 fs-6 mt-2">
          <span>
            {bookedTickets} / {totalSupply}{' '}
            {formatMessage({
              id: 'tickets_booked',
              defaultMessage: 'Tickets gebucht',
            })}
          </span>
        </div>

        {meta?.location && (
          <div className="mt-4 fs-3 mb-2">{meta.location}</div>
        )}
      </div>
    </Link>
  );
};

export default SoldEventTicketListItem;
