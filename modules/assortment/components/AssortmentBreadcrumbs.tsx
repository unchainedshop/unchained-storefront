import Link from 'next/link';
import { useIntl } from 'react-intl';

const AssortmentBreadcrumbs = ({ paths = [], currentAssortment }) => {
  const intl = useIntl();
  return (
    <nav className="mt-2 mb-4 border-bottom pb-3">
      <Link className="mr-2 breadcrumb-link" href="/">
        {intl.formatMessage({ id: 'home', defaultMessage: 'Home' })}
      </Link>
      <Link href="/shop" className="mr-2 breadcrumb-link">
        {intl.formatMessage({ id: 'shop', defaultMessage: 'Shop' })}
      </Link>
      {paths?.map(({ id, slug, title }) => (
        <Link
          href={`/${slug}`}
          as={`/${slug}`}
          key={id}
          className="mr-2 breadcrumb-link"
        >
          {title}
        </Link>
      ))}
      <a className="breadcrumb-link">
        <b>{currentAssortment?.title}</b>
      </a>
      {}
      <style jsx global>
        {`
          .breadcrumb-link {
            font-size: 0.875rem;
          }
          .breadcrumb-link::after {
            content: '〉';
            font-size: 12px;
            display: inline-block;
            width: 10px;
            height: 10px;
            margin-left: 1em;
          }
          .breadcrumb-link:last-of-type::after {
            content: '';
          }
        `}
      </style>
    </nav>
  );
};

export default AssortmentBreadcrumbs;
