import { useIntl } from "react-intl";
import Button from "../common/components/Button";

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
    [firstName, lastName].filter(Boolean).join(" "),
    addressLine,
    addressLine2,
    [postalCode, city].filter(Boolean).join(" "),
    regionCode,
    countryCode,
  ]
    .filter(Boolean)
    .join("\n");

const AddressPanel = ({ address, onEdit }) => {
  const { formatMessage } = useIntl();
  return (
    <div className="mt-4">
      <div style={{ whiteSpace: "pre-wrap" }}>{formatAddress(address)}</div>
      <Button
        text={formatMessage({
          id: "edit-address",
          defaultMessage: "Edit Address",
        })}
        type="button"
        variant="secondary"
        className="mt-2"
        onClick={onEdit}
      />
    </div>
  );
};

export default AddressPanel;
