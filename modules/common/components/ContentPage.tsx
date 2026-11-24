import Link from 'next/link';
import { useRouter } from 'next/router';
import { useIntl } from 'react-intl';
import classNames from 'classnames';
import PageHeader from './PageHeader';

const ContentPage = ({ eyebrow, title, icon = null, children }) => {
  const { formatMessage } = useIntl();
  const { pathname } = useRouter();
  const links = [
    { href: '/about', label: formatMessage({ id: 'about', defaultMessage: 'About us' }) },
    { href: '/imprint', label: formatMessage({ id: 'imprint', defaultMessage: 'Imprint' }) },
    { href: '/terms-conditions', label: formatMessage({ id: 'terms_and_conditions', defaultMessage: 'Terms & Conditions' }) },
    { href: '/privacy-policy', label: formatMessage({ id: 'privacy', defaultMessage: 'Privacy Policy' }) },
  ];

  return (
    <>
      <PageHeader eyebrow={eyebrow} title={title} icon={icon} />
      <div className="grid items-start gap-8 lg:grid-cols-[1fr_240px]">
        <article className="card p-6 sm:p-10 [&_.prose]:max-w-none [&_h1]:hidden [&_h2]:scroll-mt-24">
          {children}
        </article>
        <aside className="card p-4 lg:sticky lg:top-24">
          <p className="px-2 pb-2 text-xs font-semibold uppercase tracking-wider text-subtle-foreground">
            {formatMessage({ id: 'company', defaultMessage: 'Company' })}
          </p>
          <ul className="space-y-0.5">
            {links.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={pathname === href ? 'page' : undefined}
                  className={classNames(
                    'block rounded-lg px-2 py-1.5 text-sm transition-colors',
                    pathname === href
                      ? 'bg-accent-soft font-medium text-accent-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                  )}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </>
  );
};

export default ContentPage;
