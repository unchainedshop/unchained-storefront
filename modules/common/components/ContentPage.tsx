import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useIntl } from 'react-intl';
import classNames from 'classnames';
import PageHeader from './PageHeader';

const slugify = (text: string) =>
  text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

// Typography for the long-form text inside every content page.
const articleClasses = [
  'prose max-w-none text-[0.9375rem] leading-7 text-muted-foreground dark:prose-invert',
  '[&_.prose]:max-w-[78ch]',
  '[&_.lead]:mb-10 [&_.lead]:text-lg [&_.lead]:leading-8 [&_.lead]:text-foreground',
  '[&_h2]:mt-12 [&_h2]:mb-3 [&_h2]:scroll-mt-24 [&_h2]:border-t [&_h2]:border-border [&_h2]:pt-8 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-foreground',
  '[&_.lead+h2]:mt-0 [&_.lead+h2]:border-t-0 [&_.lead+h2]:pt-0',
  '[&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-foreground',
  '[&_p]:my-3',
  '[&_ul]:my-4 [&_ul]:space-y-2 [&_ul]:pl-5 [&_li]:marker:text-accent',
  '[&_strong]:font-semibold [&_strong]:text-foreground',
  '[&_a]:font-medium [&_a]:text-accent [&_a]:no-underline hover:[&_a]:underline',
  '[&_.content-box]:my-6 [&_.content-box]:rounded-xl [&_.content-box]:border [&_.content-box]:border-border [&_.content-box]:bg-muted [&_.content-box]:px-6 [&_.content-box]:py-5',
  '[&_.content-note]:mt-12 [&_.content-note]:border-t [&_.content-note]:border-border [&_.content-note]:pt-6 [&_.content-note]:text-sm [&_.content-note]:italic [&_.content-note]:text-subtle-foreground',
].join(' ');

const ContentPage = ({ eyebrow, title, icon = null, children }) => {
  const { formatMessage } = useIntl();
  const { pathname } = useRouter();
  const articleRef = useRef<HTMLElement>(null);
  const [headings, setHeadings] = useState<{ id: string; text: string }[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  // Section anchors and the table of contents come from the page's own h2s.
  useEffect(() => {
    const elements = [...(articleRef.current?.querySelectorAll('h2') || [])];
    elements.forEach((element) => {
      if (!element.id) element.id = slugify(element.textContent || '');
    });
    setHeadings(elements.map((element) => ({ id: element.id, text: element.textContent || '' })));
    setActiveId(elements[0]?.id || null);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length) setActiveId(visible[0].target.id);
      },
      { rootMargin: '-96px 0px -70% 0px' },
    );
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [pathname]);

  const links = [
    { href: '/about', label: formatMessage({ id: 'about', defaultMessage: 'About us' }) },
    { href: '/imprint', label: formatMessage({ id: 'imprint', defaultMessage: 'Imprint' }) },
    { href: '/terms-conditions', label: formatMessage({ id: 'terms_and_conditions', defaultMessage: 'Terms & Conditions' }) },
    { href: '/privacy-policy', label: formatMessage({ id: 'privacy', defaultMessage: 'Privacy Policy' }) },
  ];

  const navItemClass = (active: boolean) =>
    classNames(
      'block rounded-lg px-3 py-1.5 text-sm transition-colors',
      active ? 'bg-accent-soft font-medium text-accent-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground',
    );

  return (
    <>
      <PageHeader eyebrow={eyebrow} title={title} icon={icon} />
      <div className="grid items-start gap-8 lg:grid-cols-[1fr_260px]">
        <article ref={articleRef} className={classNames('card px-6 py-8 sm:px-12 sm:py-12', articleClasses)}>
          {children}
        </article>

        <aside className="space-y-4 lg:sticky lg:top-24">
          {headings.length > 1 && (
            <nav aria-label={formatMessage({ id: 'on_this_page', defaultMessage: 'On this page' })} className="card hidden p-4 lg:block">
              <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-subtle-foreground">
                {formatMessage({ id: 'on_this_page', defaultMessage: 'On this page' })}
              </p>
              <ul className="space-y-0.5">
                {headings.map(({ id, text }) => (
                  <li key={id}>
                    <a href={`#${id}`} className={navItemClass(activeId === id)}>
                      {text}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          <nav aria-label={formatMessage({ id: 'company', defaultMessage: 'Company' })} className="card p-4">
            <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-subtle-foreground">
              {formatMessage({ id: 'company', defaultMessage: 'Company' })}
            </p>
            <ul className="space-y-0.5">
              {links.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} aria-current={pathname === href ? 'page' : undefined} className={navItemClass(pathname === href)}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
      </div>
    </>
  );
};

export default ContentPage;
