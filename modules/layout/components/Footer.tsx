import Link from 'next/link';
import { useIntl } from 'react-intl';

import LanguageSwitch from '../../common/components/LanguageSwitch';
import CurrencySelector from '../../common/components/CurrencySelector';
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

const FooterColumn = ({ title, children }) => (
  <div>
    <h3 className="text-xs font-semibold uppercase tracking-wider text-subtle-foreground">
      {title}
    </h3>
    <ul className="mt-4 space-y-2.5 text-sm">{children}</ul>
  </div>
);

const FooterLink = ({ href, external = false, children }) => (
  <li>
    {external ? (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-muted-foreground transition-colors hover:text-foreground"
      >
        {children}
      </a>
    ) : (
      <Link
        href={href}
        className="text-muted-foreground transition-colors hover:text-foreground"
      >
        {children}
      </Link>
    )}
  </li>
);

const Footer = () => {
  const { formatMessage } = useIntl();
  const { assortments } = useAssortments({ includeLeaves: true });
  const nav = getFooterNavigation(formatMessage);
  const rootCategories = (assortments || [])
    .filter((assortment) => assortment.isRoot)
    .slice(0, 6);

  return (
    <footer
      aria-labelledby="footer-heading"
      className="mt-16 border-t border-border bg-surface print:hidden"
    >
      <h2 id="footer-heading" className="sr-only">
        {formatMessage({ id: 'footer', defaultMessage: 'Footer' })}
      </h2>
      <div className="container-page py-12">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-5">
          <div className="col-span-2">
            <Link href="/" className="font-display text-lg font-bold tracking-tight">
              {formatMessage({ id: 'shop_title', defaultMessage: 'Unchained Store' })}
            </Link>
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              {formatMessage({
                id: 'footer_tagline',
                defaultMessage: 'Thoughtfully selected products, delivered with care.',
              })}
            </p>
          </div>

          {rootCategories.length > 0 && (
            <FooterColumn
              title={formatMessage({ id: 'categories', defaultMessage: 'Categories' })}
            >
              {rootCategories.map((category) => (
                <FooterLink key={category._id} href={`/shop/${category.texts?.slug}`}>
                  {category.texts?.title}
                </FooterLink>
              ))}
            </FooterColumn>
          )}

          <FooterColumn title={formatMessage({ id: 'company', defaultMessage: 'Company' })}>
            {[...nav.company, ...nav.legal].map((item) => (
              <FooterLink key={item.href} href={item.href}>
                {item.name}
              </FooterLink>
            ))}
          </FooterColumn>

          <FooterColumn title="Unchained">
            {nav.unchained.map((item) => (
              <FooterLink key={item.href} href={item.href} external>
                {item.name}
              </FooterLink>
            ))}
          </FooterColumn>
        </div>

        <div className="mt-12 flex flex-col-reverse items-center justify-between gap-4 border-t border-border pt-6 sm:flex-row">
          <p className="text-sm text-subtle-foreground">
            &copy; {new Date().getFullYear()}{' '}
            {formatMessage({ id: 'right', defaultMessage: 'All Rights Reserved' })}
          </p>
          <div className="flex items-center gap-2">
            <LanguageSwitch />
            <CurrencySelector />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
