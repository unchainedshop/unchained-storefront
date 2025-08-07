import { useIntl } from "react-intl";
import Button from "../common/components/Button";

import COUNTRIES from "../common/data/countries-list";
import Form from "../forms/components/Form";
import FormErrors from "../forms/components/FormErrors";
import SelectField from "../forms/components/SelectField";
import TextField from "../forms/components/TextField";

const AddressForm = ({ address, onSubmit, onCancel }) => {
  const { formatMessage } = useIntl();

  const submitHandler = async (data) => {
    await onSubmit(data);
  };

  const onSubmitError = async (e) => {
    return {
      root: {
        message: e.message,
      },
    };
  };

  return (
    <Form
      onSubmit={submitHandler}
      onSubmitError={onSubmitError}
      defaultValues={{ ...address }}
      className="space-y-6"
    >
      {/* Name Fields - Grouped */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextField
          label={formatMessage({
            id: "first_name",
            defaultMessage: "First name",
          })}
          name="firstName"
          required
        />
        <TextField
          label={formatMessage({
            id: "last-name",
            defaultMessage: "Last Name",
          })}
          name="lastName"
          required
        />
      </div>

      {/* Company Field */}
      <div>
        <TextField
          label={`${formatMessage({
            id: "company-name",
            defaultMessage: "Company Name",
          })} ${formatMessage({
            id: "optional",
            defaultMessage: "(Optional)",
          })}`}
          name="company"
        />
      </div>

      {/* Address Fields - Grouped */}
      <div className="space-y-4">
        <TextField
          label={formatMessage({ id: "address", defaultMessage: "Address" })}
          name="addressLine"
          required
        />
        <TextField
          name="addressLine2"
          placeholder={formatMessage({
            id: "address_line_2",
            defaultMessage: "Apartment, suite, etc. (optional)",
          })}
        />
      </div>

      {/* Location Fields - Grouped */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <TextField
          label={formatMessage({
            id: "postal-code-or-zip",
            defaultMessage: "Postal Code / ZIP",
          })}
          name="postalCode"
          required
        />
        <TextField
          label={formatMessage({
            id: "city",
            defaultMessage: "City",
          })}
          name="city"
          required
        />
        <TextField
          label={`${formatMessage({ id: "region", defaultMessage: "Region" })} ${formatMessage(
            {
              id: "optional",
              defaultMessage: "(Optional)",
            },
          )}`}
          name="regionCode"
        />
      </div>

      {/* Country Field */}
      <div>
        <SelectField
          label={formatMessage({ id: "country", defaultMessage: "Country" })}
          name="countryCode"
          required
        >
          <option value=""> - </option>
          {COUNTRIES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.name}
            </option>
          ))}
        </SelectField>
      </div>

      <FormErrors />

      <div className="flex gap-4 pt-4">
        <Button
          text={formatMessage({
            id: "cancel",
            defaultMessage: "Cancel",
          })}
          variant="secondary"
          type="button"
          className="flex-1"
          onClick={onCancel}
        />
        <Button
          text={formatMessage({
            id: "save_address",
            defaultMessage: "Save Address",
          })}
          type="submit"
          variant="primary"
          className="flex-[2]"
        />
      </div>
    </Form>
  );
};

export default AddressForm;
