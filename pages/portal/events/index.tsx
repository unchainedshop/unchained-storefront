import { useIntl } from 'react-intl';
import RouteProtectionSink from '../../../modules/auth/components/RouteProtectionSink';
import Loading from '../../../modules/common/components/Loading';
import SoldEventTicketList from '../../../modules/products/components/SoldEventTicketList';
import useEvents from '../../../modules/products/hooks/useEvents';

const PortalEvents = () => {
  const { events, loading } = useEvents();
  const { formatMessage } = useIntl();
  return (
    <>
      <RouteProtectionSink role="admin" target={'/login'} />
      <h2 className="mb-4">
        {formatMessage({
          id: 'all_events',
          defaultMessage: 'Alle Veranstaltungen',
        })}
      </h2>
      <div className="row">
        <div className="overflow-x-auto mt-2 pt-2">
          {loading ? (
            <Loading />
          ) : (
            <SoldEventTicketList eventTickets={events} />
          )}
        </div>
      </div>
    </>
  );
};

export default PortalEvents;
