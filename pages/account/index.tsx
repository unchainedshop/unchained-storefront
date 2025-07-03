/* eslint-disable no-return-assign */
import Link from "next/link";
import { useIntl } from "react-intl";
import {
  IdentificationIcon,
  KeyIcon,
  UserCircleIcon,
} from "@heroicons/react/20/solid";
import classNames from "classnames";
import { useRouter } from "next/router";
import useUser from "../../modules/auth/hooks/useUser";
import MetaTags from "../../modules/common/components/MetaTags";
import useRedirect from "../../modules/auth/hooks/useRedirect";
import Address from "../../modules/common/components/Address";

import ProfileView from "../../modules/auth/components/ProfileView";
import Loading from "../../modules/common/components/Loading";
import EmailAddresses from "../../modules/auth/components/EmailAddresses";

const subNavigation = [
  { name: "General", href: "#profileview", icon: UserCircleIcon },
  {
    name: "Address",
    href: "#address",
    icon: IdentificationIcon,
  },
  {
    name: "Emails",
    href: "#email",
    icon: IdentificationIcon,
  },
  { name: "Password", href: "#password", icon: KeyIcon },
];

const Account = () => {
  const { user, loading } = useUser();
  const router = useRouter();
  const { formatMessage } = useIntl();

  useRedirect({ to: "/login", matchAnonymous: true, matchGuests: true });

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <MetaTags
        title={
          user?.username ||
          formatMessage({ id: "account", defaultMessage: "Account" })
        }
      />
      <div className="max-w-full bg-slate-100 pb-10 dark:bg-slate-600 lg:py-12 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-5">
          <aside className="h-fit py-6 px-2 sm:px-6 lg:sticky lg:top-24 lg:col-span-3 lg:py-0 lg:px-0">
            <nav className="space-y-1 lg:sticky lg:top-24">
              {subNavigation.map((item) => (
                <Link
                  href={item.href}
                  key={item.name}
                  className={classNames(
                    "group flex items-center rounded-md px-3 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50 hover:text-slate-400 dark:bg-slate-600 dark:text-white dark:hover:text-slate-400",
                    {
                      "bg-slate-50 text-slate-600 hover:bg-white dark:bg-slate-500 dark:text-slate-400":
                        item.name.toLowerCase() ===
                        (router.asPath.includes("#")
                          ? router.asPath.split("#")[1]
                          : "general"),
                    },
                  )}
                >
                  <item.icon
                    className={classNames(
                      "-ml-1 mr-3 h-6 w-6 flex-shrink-0 text-slate-400 group-hover:text-slate-400 dark:group-hover:text-slate-500",
                      {
                        "text-slate-600 dark:text-slate-400":
                          item.name.toLowerCase() ===
                          (router.asPath.includes("#")
                            ? router.asPath.split("#")[1]
                            : "general"),
                      },
                    )}
                    aria-hidden="true"
                  />
                  <span className="truncate">{item.name}</span>
                </Link>
              ))}
            </nav>
          </aside>

          {/* General */}
          <ProfileView user={user} />
          <EmailAddresses {...user} />

          {/* Address */}
          <Address user={user} />

          {/* Password */}
          <section
            id="password"
            aria-labelledby="password"
            className="lg:col-span-9 lg:col-start-4"
          >
            <div className="mt-6 bg-white pt-6 shadow dark:bg-slate-500 sm:overflow-hidden sm:rounded-md">
              <div className="px-4 sm:px-6">
                <h2
                  id="password"
                  className="text-lg font-medium leading-6 text-slate-900 dark:text-slate-100"
                >
                  {formatMessage({
                    id: "password",
                    defaultMessage: "Password",
                  })}
                </h2>
              </div>
              <div className="mt-6 flex flex-col">
                <div className="overflow-x-auto">
                  <div className="inline-block min-w-full align-middle sm:px-6 lg:px-8">
                    <div className="overflow-hidden border-t border-slate-200 py-8">
                      <Link
                        href="account/change-password"
                        className="inline-flex justify-center rounded-md border border-transparent bg-slate-800 py-2 px-4 text-sm font-medium text-white shadow-xs hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
                      >
                        {formatMessage({
                          id: "change_password",
                          defaultMessage: "Change Password",
                        })}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default Account;
