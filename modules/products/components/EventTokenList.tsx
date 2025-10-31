import { useMemo } from 'react';
import { useIntl } from 'react-intl';
import useUser from '../../auth/hooks/useUser';
import useInvalidateTicket from '../hooks/useInvalidateTicket';
import toast from 'react-hot-toast';

const EventTokenList = ({ product }) => {
  const { user } = useUser();
  const { invalidateTicket } = useInvalidateTicket();
  const { formatMessage } = useIntl();

  const { texts, tokens } = product || {};

  const onInvalidateTicket = (tokenId) => async () => {
    try {
      await invalidateTicket({ tokenId });
      toast.success(
        formatMessage({
          id: 'ticket_invalidated_success',
          defaultMessage: 'Ticket erfolgreich eingelöst',
        }),
      );
    } catch {
      toast.custom(
        <p className="my-0">
          {formatMessage({
            id: 'ticket_invalidated_error_message',
            defaultMessage: 'Ticket bereits eingelöst oder nicht einlösbar.',
          })}
        </p>,
      );
    }
  };

  const csvLink = useMemo(() => {
    try {
      const fieldNames = new Set(
        tokens?.flatMap((t) =>
          Object.keys(t.ercMetadata || {}).filter(
            (f) => !['attributes', 'properties', 'orderId'].includes(f),
          ),
        ) || [],
      );

      const csvContent = [
        [
          formatMessage({ id: 'ticket_number', defaultMessage: 'Ticket #' }),
          formatMessage({ id: 'email_address', defaultMessage: 'E-Mail' }),
          formatMessage({
            id: 'phone_number',
            defaultMessage: 'Telefonnummer',
          }),
          formatMessage({ id: 'redeemed', defaultMessage: 'Eingelöst?' }),
          ...fieldNames,
        ].join(','),
        ...(tokens || []).map((token) =>
          [
            `"${token.chainTokenId}"`,
            `"${token.user?.lastContact?.emailAddress || ''}"`,
            `"${token.user?.lastContact?.telNumber || ''}"`,
            `"${
              token.invalidatedDate
                ? formatMessage({ id: 'yes', defaultMessage: 'Ja' })
                : formatMessage({ id: 'no', defaultMessage: 'Nein' })
            }"`,
            ...[...fieldNames].map(
              (f: any) =>
                `"${token.ercMetadata?.[f]?.toString().replace(/"/g, "'") || ''}"`,
            ),
          ].join(','),
        ),
      ].join('\n');

      return URL.createObjectURL(new Blob([csvContent]));
    } catch {
      return null;
    }
  }, [tokens, formatMessage]);

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">
        {formatMessage({
          id: 'participant_list_for',
          defaultMessage: 'Teilnehmerliste für',
        })}{' '}
        {texts?.title || ''}
      </h2>
      <p className="text-gray-500 mb-6">
        {formatMessage({
          id: 'participant_list_description',
          defaultMessage: 'Liste aller Teilnehmer des Events.',
        })}
      </p>

      <div className="overflow-x-auto border rounded-lg shadow-sm bg-white">
        <table className="table-auto w-full border-collapse text-sm">
          <thead className="bg-gray-100 text-gray-700 uppercase text-xs font-semibold">
            <tr>
              <th className="px-4 py-3 text-left">
                {formatMessage({
                  id: 'ticket_number',
                  defaultMessage: 'Ticket #',
                })}
              </th>
              <th className="px-4 py-3 text-left">
                {formatMessage({ id: 'last_name', defaultMessage: 'Nachname' })}
              </th>
              <th className="px-4 py-3 text-left">
                {formatMessage({ id: 'first_name', defaultMessage: 'Vorname' })}
              </th>
              <th className="px-4 py-3 text-left">
                {formatMessage({
                  id: 'email_address',
                  defaultMessage: 'E-Mail',
                })}
              </th>
              <th className="px-4 py-3 text-left">
                {formatMessage({
                  id: 'phone_number',
                  defaultMessage: 'Telefonnummer',
                })}
              </th>
              <th className="px-4 py-3 text-left">
                {formatMessage({
                  id: 'redeemed',
                  defaultMessage: 'Eingelöst?',
                })}
              </th>
              <th className="px-4 py-3 text-right">
                {formatMessage({ id: 'actions', defaultMessage: 'Aktionen' })}
              </th>
            </tr>
          </thead>

          <tbody>
            {(tokens || []).map((token, idx) => (
              <tr
                key={token._id}
                className={`border-t ${idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-gray-100 transition-colors`}
              >
                <td className="px-4 py-3 font-medium text-gray-700">
                  {token.chainTokenId}
                </td>
                <td className="px-4 py-3">
                  {token.ercMetadata?.lastName || ''}
                </td>
                <td className="px-4 py-3">
                  {token.ercMetadata?.firstName || ''}
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {token.user?.lastContact?.emailAddress || ''}
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {token.user?.lastContact?.telNumber || ''}
                </td>
                <td
                  className={`px-4 py-3 font-semibold ${token.invalidatedDate ? 'text-green-600' : 'text-red-500'}`}
                >
                  {token.invalidatedDate
                    ? formatMessage({ id: 'yes', defaultMessage: 'Ja' })
                    : formatMessage({ id: 'no', defaultMessage: 'Nein' })}
                </td>
                <td className="px-4 py-3 text-right">
                  {token.isInvalidateable && user?.roles?.includes('admin') && (
                    <button
                      type="button"
                      className="px-3 py-1.5 text-sm font-medium rounded-md bg-primary text-white hover:bg-primary-dark transition-colors"
                      onClick={onInvalidateTicket(token._id)}
                    >
                      {formatMessage({
                        id: 'redeem_ticket',
                        defaultMessage: 'Ticket einlösen',
                      })}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {user?.roles?.includes('admin') &&
        product?.status === 'ACTIVE' &&
        csvLink && (
          <div className="mt-6 flex justify-end">
            <a
              href={csvLink}
              download="teilnehmerliste.csv"
              target="_blank"
              className="inline-block px-4 py-2 rounded-md bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors"
            >
              {formatMessage({
                id: 'download_csv',
                defaultMessage: 'CSV herunterladen',
              })}
            </a>
          </div>
        )}
    </div>
  );
};

export default EventTokenList;
