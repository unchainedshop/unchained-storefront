import { useIntl } from 'react-intl';

const formatAddress = ({
  firstName,
  lastName,
  addressLine,
  addressLine2,
  postalCode,
  city,
  regionCode,
  countryCode,
}) =>
  [
    [firstName, lastName].filter(Boolean).join(' '),
    addressLine,
    addressLine2,
    [postalCode, city].filter(Boolean).join(' '),
    regionCode,
    countryCode,
  ]
    .filter(Boolean)
    .join('\n');

const AddressPanel = ({ address, onEdit }) => {
  const { formatMessage } = useIntl();
  return (
    <div className="mt-4 dark:text-slate-200">
      <div style={{ whiteSpace: 'pre-wrap' }}>{formatAddress(address)}</div>
    </div>
  );
};

export default AddressPanel;
