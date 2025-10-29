import { useIntl } from 'react-intl';
import SoldEventTicketListItem from './SoldEventTicketListItem';

const SoldEventTicketList = ({ eventTickets }) => {
  const { formatMessage } = useIntl();

  const sortedItems = (eventTickets || []).toSorted((a, b) => {
    const dateA = new Date(a.meta?.date || a.createdAt || 0).getTime();
    const dateB = new Date(b.meta?.date || b.createdAt || 0).getTime();
    return dateB - dateA;
  });

  return (
    <div className="mb-5 event-grid">
      {!eventTickets?.length ? (
        <p className="mt-5">
          {formatMessage({
            id: 'no_results_found',
            defaultMessage: 'Keine Ergebnisse gefunden..',
          })}
        </p>
      ) : (
        sortedItems.map((product) => (
          <SoldEventTicketListItem key={product._id} product={product} />
        ))
      )}
    </div>
  );
};

export default SoldEventTicketList;
