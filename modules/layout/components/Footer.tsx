import Link from 'next/link';
import { useIntl } from 'react-intl';

import LanguageSwitch from '../../common/components/LanguageSwitch';
import useAssortments from '../../assortment/hooks/useAssortments';

const getFooterNavigation = (formatMessage) => ({
  products: [],
  customerService: [
    {
      name: formatMessage({ id: 'contact', defaultMessage: 'Contact' }),
      href: '#',
    },
  ],
  company: [
    {
      name: formatMessage({ id: 'about', defaultMessage: 'About us' }),
      href: '/about',
    },
    {
      name: formatMessage({ id: 'imprint', defaultMessage: 'Imprint' }),
      href: '/imprint',
    },
  ],
  legal: [
    {
      name: formatMessage({
        id: 'terms_and_conditions',
        defaultMessage: 'Terms & Conditions',
      }),
      href: '/terms-conditions',
    },
    {
      name: formatMessage({
        id: 'privacy',
        defaultMessage: 'Privacy Policy',
      }),
      href: '/privacy-policy',
    },
  ],
  unchained: [
    {
      name: formatMessage({ id: 'github', defaultMessage: 'GitHub' }),
      href: 'https://github.com/unchainedshop',
      external: true,
    },
    {
      name: formatMessage({ id: 'docs', defaultMessage: 'Documentation' }),
      href: 'https://docs.unchained.shop',
      external: true,
    },
    {
      name: formatMessage({ id: 'support', defaultMessage: 'Support' }),
      href: 'https://unchained.shop/contact',
      external: true,
    },
  ],
  bottomLinks: [],
  social: [],
});

const Footer = () => {
  const { formatMessage } = useIntl();
  const { assortments, loading: assortmentsLoading } = useAssortments({
    includeLeaves: true,
  });
  const footerNavigation = getFooterNavigation(formatMessage);
  return (
    <footer
      aria-labelledby="footer-heading"
      className="my-32 container mx-auto bg-surface print:hidden"
    >
      <h2 id="footer-heading" className="sr-only">
        {formatMessage({ id: 'footer', defaultMessage: 'Footer' })}
      </h2>

      <div className="px-6 lg:px-8 mx-auto">
        <div className="flex space-x-6">
          {footerNavigation.social.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-subtle-foreground hover:text-subtle-foreground"
            >
              <span className="sr-only">{item.name}</span>
              <item.icon className="h-6 w-6" aria-hidden="true" />
            </a>
          ))}
        </div>

        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="uppercase text-lg font-semibold text-foreground mb-6">
              {formatMessage({
                id: 'shop_title',
                defaultMessage: 'Unchained Store',
              })}
            </div>

            {/* Categories Section */}
            <div>
              <h3 className="text-sm font-semibold text-subtle-foreground">
                {formatMessage({
                  id: 'categories',
                  defaultMessage: 'Categories',
                })}
              </h3>
              {!assortmentsLoading && assortments.length > 0 && (
                <ul className="mt-3 space-y-3">
                  {assortments
                    .filter((assortment) => assortment.isRoot)
                    .map((rootCategory) => (
                      <li
                        key={rootCategory._id}
                        className="text-sm font-medium"
                      >
                        <Link
                          href={`/shop/${rootCategory.texts?.slug}`}
                          className="text-foreground hover:text-subtle-foreground"
                        >
                          {rootCategory.texts?.title}
                        </Link>
                        {/* Child categories with indentation */}
                        {assortments
                          .filter(
                            (child) =>
                              !child.isRoot &&
                              child.texts?.slug?.startsWith(
                                rootCategory.texts?.slug,
                              ),
                          )
                          .slice(0, 3) // Limit to 3 child categories per parent
                          .map((childCategory) => (
                            <div key={childCategory._id} className="mt-2">
                              <Link
                                href={`/shop/${childCategory.texts?.slug}`}
                                className="text-sm font-medium text-muted-foreground hover:text-subtle-foreground ml-4 block"
                              >
                                {childCategory.texts?.title}
                              </Link>
                            </div>
                          ))}
                      </li>
                    ))}
                </ul>
              )}
            </div>

            <div>
              <div>
                <h3 className="text-sm font-semibold text-subtle-foreground">
                  {formatMessage({
                    id: 'company',
                    defaultMessage: 'Company',
                  })}
                </h3>
                <ul className="mt-3 space-y-3">
                  {footerNavigation.company.map((item) => (
                    <li key={item.name} className="text-sm font-medium">
                      <Link
                        href={item.href}
                        className="text-foreground hover:text-subtle-foreground"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-11">
                <h3 className="text-sm font-semibold text-subtle-foreground">
                  {formatMessage({ id: 'legal', defaultMessage: 'Legal' })}
                </h3>
                <ul className="mt-3 space-y-3">
                  {footerNavigation.legal.map((item) => (
                    <li key={item.name} className="text-sm font-medium">
                      <Link
                        href={item.href}
                        className="text-foreground hover:text-subtle-foreground"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-subtle-foreground">
                Unchained
              </h3>
              <ul className="mt-3 space-y-3">
                {footerNavigation.unchained.map((item) => (
                  <li key={item.name} className="text-sm font-medium">
                    {item.external ? (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-foreground hover:text-subtle-foreground"
                      >
                        {item.name}
                      </a>
                    ) : (
                      <Link
                        href={item.href}
                        className="text-foreground hover:text-subtle-foreground"
                      >
                        {item.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-48 md:flex md:items-center md:justify-between">
          <div className="text-center md:text-left">
            <p className="text-sm font-medium text-subtle-foreground">
              <span>&copy;</span>
              <span className="mx-2">{new Date().getFullYear()}</span>
              <span>
                {formatMessage({
                  id: 'right',
                  defaultMessage: 'All Rights Reserved',
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
                  className="text-subtle-foreground hover:text-subtle-foreground"
                >
                  {item.name}
                </Link>
              ))}
            </div>

            <div className="border-border">
              <div className="flex items-center text-base text-subtle-foreground hover:text-subtle-foreground">
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
