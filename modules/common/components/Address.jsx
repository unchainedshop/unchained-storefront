import { useState } from "react";
import { useIntl } from "react-intl";
import useUpdateUserProfile from "../../auth/hooks/useUpdateUserProfile";
import Form from "../../forms/components/Form";
import SelectField from "../../forms/components/SelectField";
import SubmitButton from "../../forms/components/SubmitButton";
import TextField from "../../forms/components/TextField";
import COUNTRIES from "../data/countries-list";
import Button from "./Button";

const Address = ({ user }) => {
  const { formatMessage } = useIntl();
  const { updateUserProfile } = useUpdateUserProfile();

  const [updateProfile, setUpdateProfile] = useState(false);

  const onProfileUpdateComplete = (value) => {
    if (value) setUpdateProfile(false);
  };

  if (!user) return null;

  const { profile = {} } = user;

  const onSubmit = async (form) => {
    const {
      addressLine,
      addressLine2,
      postalCode,
      city,
      telNumber,
      regionCode,
      countryCode,
    } = form;

    const { firstName, lastName, company } = profile?.address || {};

    const userProfile = {
      phoneMobile: telNumber,
      address: {
        firstName,
        lastName,
        company,
        addressLine,
        addressLine2,
        postalCode,
        city,
        regionCode,
        countryCode,
      },
    };

    await updateUserProfile({ profile: userProfile, userId: user._id });
    onProfileUpdateComplete(true);
  };

  return (
    <section
      id="address"
      aria-labelledby="address"
      className="mt-10 sm:px-6 lg:col-span-9 lg:col-start-4 lg:px-0"
    >
      <div className="space-y-6 ">
        <Form onSubmit={onSubmit}>
          <div className="shadow sm:overflow-hidden sm:rounded-md">
            <div className="bg-white py-6 px-4 dark:bg-slate-500 dark:text-slate-200 sm:p-6">
              <div className="flex items-center justify-between">
                <h1
                  id="address-heading"
                  className="text-lg font-medium leading-6 text-slate-900 dark:text-slate-100"
                >
                  {formatMessage({
                    id: "address",
                    defaultMessage: "Address",
                  })}
                </h1>
                {!updateProfile && (
                  <Button
                    text={formatMessage({
                      id: "update",
                      defaultMessage: "Update",
                    })}
                    type="button"
                    onClick={() => setUpdateProfile(true)}
                    variant="secondary"
                    className="text-xs px-3 py-1.5 w-min"
                  />
                )}
              </div>

              <div className="mt-6 grid grid-cols-4 gap-6">
                <div className="col-span-4 sm:col-span-2">
                  <div className="mb-1">
                    {formatMessage({
                      id: "address",
                      defaultMessage: "Address",
                    })}
                  </div>
                  {updateProfile ? (
                    <div className="mt-1">
                      <TextField
                        name="addressLine"
                        defaultValue={profile?.address?.addressLine}
                      />
                    </div>
                  ) : (
                    <div className="mb-1">
                      {user?.profile?.address?.addressLine}
                    </div>
                  )}
                </div>

                <div className="col-span-4 sm:col-span-2">
                  <div className="mb-1 flex justify-between">
                    <span>
                      {formatMessage({
                        id: "address_2",
                        defaultMessage: "Address 2",
                      })}
                    </span>
                    {updateProfile && (
                      <span className="text-sm text-slate-500">
                        {formatMessage({
                          id: "address2_optional",
                          defaultMessage: "Optional",
                        })}
                      </span>
                    )}
                  </div>
                  {updateProfile ? (
                    <TextField
                      name="addressLine2"
                      defaultValue={user?.profile?.address?.addressLine2}
                    />
                  ) : (
                    <div className="mb-1">
                      {user?.profile?.address?.addressLine2}
                    </div>
                  )}
                </div>

                <div className="col-span-4 sm:col-span-2">
                  <div className="mb-1">
                    {formatMessage({
                      id: "telephone",
                      defaultMessage: "Telephone",
                    })}
                  </div>
                  {updateProfile ? (
                    <div className="mt-1">
                      <TextField
                        name="telNumber"
                        defaultValue={profile?.phoneMobile}
                      />
                    </div>
                  ) : (
                    <div className="mb-1">{user?.profile?.phoneMobile}</div>
                  )}
                </div>

                <div className="col-span-4 sm:col-span-2">
                  <div className="mb-1">
                    {formatMessage({
                      id: "postal-code",
                      defaultMessage: "Postal code",
                    })}
                  </div>
                  {updateProfile ? (
                    <div className="mt-1">
                      <TextField
                        name="postalCode"
                        defaultValue={profile?.address?.postalCode}
                      />
                    </div>
                  ) : (
                    <div className="mb-1">
                      {user?.profile?.address?.postalCode}
                    </div>
                  )}
                </div>

                <div className="col-span-4 sm:col-span-2">
                  {updateProfile ? (
                    <div className="mt-1">
                      <SelectField
                        label={formatMessage({
                          id: "country",
                          defaultMessage: "Country",
                        })}
                        name="countryCode"
                        defaultValue={profile?.address?.countryCode}
                      >
                        {COUNTRIES.map((c) => (
                          <option key={c.code} value={c.code}>
                            {c.name}
                          </option>
                        ))}
                      </SelectField>
                    </div>
                  ) : (
                    <div className="mb-1">
                      {
                        COUNTRIES.filter(
                          (c) => c.code === user?.profile?.address?.countryCode,
                        )[0]?.name
                      }
                    </div>
                  )}
                </div>

                <div className="col-span-4 sm:col-span-2">
                  <div className="mb-1 flex justify-between">
                    <span>
                      {formatMessage({
                        id: "region",
                        defaultMessage: "Region",
                      })}
                    </span>
                    {updateProfile && (
                      <span className="text-sm text-slate-500">
                        {formatMessage({
                          id: "region_optional",
                          defaultMessage: "Optional",
                        })}
                      </span>
                    )}
                  </div>
                  {updateProfile ? (
                    <div className="mt-1">
                      <TextField
                        name="regionCode"
                        defaultValue={profile?.address?.regionCode}
                      />
                    </div>
                  ) : (
                    <div className="mb-1">
                      {user?.profile?.address?.regionCode}
                    </div>
                  )}
                </div>

                <div className="col-span-4 sm:col-span-2">
                  <div className="mb-1">
                    {formatMessage({
                      id: "city",
                      defaultMessage: "City",
                    })}
                  </div>
                  {updateProfile ? (
                    <div className="mt-1">
                      <TextField
                        name="city"
                        defaultValue={profile?.address?.city}
                      />
                    </div>
                  ) : (
                    <div className="mb-1">{user?.profile?.address?.city}</div>
                  )}
                </div>
              </div>
            </div>
            {updateProfile && (
              <div className="bg-slate-50 px-4 py-3 text-right dark:bg-slate-800 sm:px-6">
                <div className="flex justify-end space-x-3">
                  <Button
                    type="button"
                    text={formatMessage({
                      id: "cancel",
                      defaultMessage: "Cancel",
                    })}
                    onClick={onProfileUpdateComplete}
                    variant="secondary"
                    className="text-sm px-3 py-1.5"
                  />
                  <SubmitButton className="text-sm px-3 py-1.5">
                    {formatMessage({
                      id: "save",
                      defaultMessage: "Save",
                    })}
                  </SubmitButton>
                </div>
              </div>
            )}
          </div>
        </Form>
      </div>
    </section>
  );
};

export default Address;
