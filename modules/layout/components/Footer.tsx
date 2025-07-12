import Link from "next/link";
import { useIntl } from "react-intl";

import LanguageSwitch from "../../common/components/LanguageSwitch";

const getFooterNavigation = (formatMessage) => ({
  products: [],
  customerService: [
    {
      name: formatMessage({ id: "contact", defaultMessage: "Contact" }),
      href: "#",
    },
  ],
  company: [
    {
      name: formatMessage({ id: "about", defaultMessage: "About" }),
      href: "/about",
    },
    {
      name: formatMessage({ id: "imprint", defaultMessage: "Imprint" }),
      href: "/imprint",
    },
  ],
  legal: [
    {
      name: formatMessage({
        id: "terms_conditions",
        defaultMessage: "Terms & Conditions",
      }),
      href: "/terms-conditions",
    },
    {
      name: formatMessage({
        id: "privacy_policy",
        defaultMessage: "Privacy Policy",
      }),
      href: "/privacy-policy",
    },
  ],
  bottomLinks: [],
  social: [],
});

const Footer = () => {
  const { formatMessage } = useIntl();
  const footerNavigation = getFooterNavigation(formatMessage);
  return (
    <footer
      aria-labelledby="footer-heading"
      className="container mx-auto bg-white dark:bg-slate-950 print:hidden"
    >
      <h2 id="footer-heading" className="sr-only">
        {formatMessage({ id: "footer", defaultMessage: "Footer" })}
      </h2>

      <div className="max-w-full px-6 lg:px-8 mx-auto">
        <div className="pt-8">
          <div className="border-t border-slate-200">
            <div className="flex max-w-full space-x-6">
              {footerNavigation.social.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-slate-400 hover:text-slate-500"
                >
                  <span className="sr-only">{item.name}</span>
                  <item.icon className="h-6 w-6" aria-hidden="true" />
                </a>
              ))}
            </div>
            <div className="mt-8 max-w-full xl:grid xl:grid-cols-2 xl:gap-8">
              <div className="grid grid-cols-2 gap-8 xl:col-span-2">
                <div className="space-y-12 md:grid md:grid-cols-2 md:gap-8 md:space-y-0">
                  <div>
                    <h3 className="text-sm text-slate-500 dark:text-slate-50">
                      {formatMessage({
                        id: "company",
                        defaultMessage: "Company",
                      })}
                    </h3>
                    <ul className="mt-6 space-y-6">
                      {footerNavigation.company.map((item) => (
                        <li key={item.name} className="text-sm">
                          <Link
                            href={item.href}
                            className="text-slate-900 hover:text-slate-500 dark:text-slate-300 dark:hover:text-slate-200"
                          >
                            {item.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-sm text-slate-500 dark:text-slate-50">
                      {formatMessage({ id: "legal", defaultMessage: "Legal" })}
                    </h3>
                    <ul className="mt-6 space-y-6">
                      {footerNavigation.legal.map((item) => (
                        <li key={item.name} className="text-sm">
                          <Link
                            href={item.href}
                            className="text-slate-900 hover:text-slate-500 dark:text-slate-300 dark:hover:text-slate-200"
                          >
                            {item.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="py-10 md:flex md:items-center md:justify-between">
          <div className="text-center md:text-left">
            <p className="text-sm text-slate-400 dark:text-slate-200">
              <span>&copy;</span>
              <span className="mx-2">{new Date().getFullYear()}</span>
              <span>
                {formatMessage({
                  id: "right",
                  defaultMessage: "All Rights Reserved",
                })}
              </span>
            </p>
          </div>

          <div className="mt-4 flex items-center justify-center md:mt-0">
            <div className="flex space-x-8">
              {footerNavigation.bottomLinks.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-slate-400 hover:text-slate-500 dark:text-slate-300 dark:hover:text-slate-200"
                >
                  {item.name}
                </Link>
              ))}
            </div>

            <div className="border-slate-200">
              <div className="flex items-center text-base text-slate-400 hover:text-slate-500 dark:text-slate-400 dark:hover:text-slate-200">
                <LanguageSwitch />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
