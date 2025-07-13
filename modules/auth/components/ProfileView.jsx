import { useState } from "react";
import { useIntl } from "react-intl";

import useUpdateUserProfile from "../hooks/useUpdateUserProfile";
import Button from "../../common/components/Button";

import TextField from "../../forms/components/TextField";
import Form from "../../forms/components/Form";
import SubmitButton from "../../forms/components/SubmitButton";

const ProfileView = ({ user }) => {
  const { formatMessage } = useIntl();

  const { updateUserProfile } = useUpdateUserProfile();

  const [updateProfile, setUpdateProfile] = useState(false);

  if (!user) return null;
  const { profile = {} } = user;

  const onProfileUpdateComplete = (value) => {
    if (value) setUpdateProfile(false);
  };

  const onSubmit = async (form) => {
    const { firstName, lastName, company } = form;
    const {
      addressLine,
      addressLine2,
      postalCode,
      city,
      regionCode,
      countryCode,
    } = profile?.address || {};

    const userProfile = {
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
      id="profileview"
      className="space-y-6 sm:px-6 lg:col-span-9 lg:col-start-4 lg:px-0"
      aria-labelledby="account-details-heading"
    >
      <Form onSubmit={onSubmit}>
        <div className="shadow sm:overflow-hidden sm:rounded-md">
          <div className="bg-white py-6 px-4 dark:bg-slate-900 dark:text-slate-200 sm:p-6">
            <div className="flex items-center justify-between">
              <h3
                id="account-details-heading"
                className="text-lg font-medium leading-6 text-slate-900 dark:text-white"
              >
                {formatMessage({
                  id: "account",
                  defaultMessage: "Account",
                })}
              </h3>
              {!updateProfile && (
                <Button
                  type="button"
                  text={formatMessage({
                    id: "update",
                    defaultMessage: "Update",
                  })}
                  onClick={() => setUpdateProfile(true)}
                  variant="secondary"
                  className="text-xs px-3 py-1.5 w-min"
                />
              )}
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">
                    {formatMessage({
                      id: "first_name",
                      defaultMessage: "First name",
                    })}
                  </label>
                  {updateProfile ? (
                    <TextField
                      name="firstName"
                      defaultValue={profile?.address?.firstName}
                      className="w-full"
                    />
                  ) : (
                    <div className="text-sm text-slate-900 dark:text-white py-2">
                      {user?.profile?.address?.firstName || "—"}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">
                    {formatMessage({
                      id: "last_name",
                      defaultMessage: "Last name",
                    })}
                  </label>
                  {updateProfile ? (
                    <TextField
                      name="lastName"
                      defaultValue={profile?.address?.lastName}
                      className="w-full"
                    />
                  ) : (
                    <div className="text-sm text-slate-900 dark:text-white py-2">
                      {user?.profile?.address?.lastName || "—"}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">
                  {formatMessage({
                    id: "company",
                    defaultMessage: "Company",
                  })}
                </label>
                {updateProfile ? (
                  <TextField
                    name="company"
                    defaultValue={profile?.address?.company}
                    className="w-full"
                  />
                ) : (
                  <div className="text-sm text-slate-900 dark:text-white py-2">
                    {user?.profile?.address?.company || "—"}
                  </div>
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
    </section>
  );
};

export default ProfileView;
