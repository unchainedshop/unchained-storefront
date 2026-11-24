import Link from 'next/link';
import { useIntl } from 'react-intl';
import {
  ArrowRightIcon,
  ArrowPathIcon,
  LockClosedIcon,
  SparklesIcon,
  TruckIcon,
} from '@heroicons/react/24/outline';

import MetaTags from '../modules/common/components/MetaTags';
import useProducts from '../modules/products/hooks/useProducts';
import useAssortments from '../modules/assortment/hooks/useAssortments';
import ProductList from '../modules/products/components/ProductList';
import ProductGridSkeleton from '../modules/products/components/ProductGridSkeleton';
import CategoryListItem from '../modules/assortment/components/CategoryListItem';
import ErrorMessage from '../modules/common/components/ErrorMessage';
import EmptyState from '../modules/common/components/EmptyState';

const SectionHeading = ({ title, href = null, linkLabel = null }) => (
  <div className="mb-6 flex items-end justify-between gap-4">
    <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2>
    {href && (
      <Link href={href} className="link inline-flex items-center gap-1 text-sm">
        {linkLabel}
        <ArrowRightIcon className="size-4" />
      </Link>
    )}
  </div>
);

const Home = () => {
  const { formatMessage } = useIntl();
  const { products, loading: productsLoading, error } = useProducts({ limit: 8 });
  const { assortments, loading: assortmentsLoading } = useAssortments({
    includeLeaves: true,
  });
  const rootCategories = (assortments || []).filter((a) => a.isRoot).slice(0, 6);

  const perks = [
    {
      icon: TruckIcon,
      title: formatMessage({ id: 'perk_shipping', defaultMessage: 'Fast delivery' }),
      text: formatMessage({ id: 'perk_shipping_text', defaultMessage: 'Shipped quickly to your door' }),
    },
    {
      icon: ArrowPathIcon,
      title: formatMessage({ id: 'perk_returns', defaultMessage: 'Easy returns' }),
      text: formatMessage({ id: 'perk_returns_text', defaultMessage: 'Changed your mind? No problem' }),
    },
    {
      icon: LockClosedIcon,
      title: formatMessage({ id: 'perk_secure', defaultMessage: 'Secure checkout' }),
      text: formatMessage({ id: 'perk_secure_text', defaultMessage: 'Card, invoice and more' }),
    },
  ];

  return (
    <>
      <MetaTags title={formatMessage({ id: 'home', defaultMessage: 'Home' })} />

      <section className="relative isolate overflow-hidden rounded-2xl bg-hero px-6 py-16 text-hero-foreground sm:px-12 sm:py-24">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 opacity-60 [background:radial-gradient(60%_80%_at_85%_10%,color-mix(in_oklch,var(--accent-soft)_45%,transparent),transparent),radial-gradient(50%_60%_at_0%_100%,color-mix(in_oklch,var(--hero)_70%,black),transparent)]"
        />
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-widest opacity-80">
            {formatMessage({ id: 'hero_title', defaultMessage: 'Ecommerce Starter Template' })}
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-6xl">
            {formatMessage({
              id: 'hero_subtitle',
              defaultMessage: 'Powered by Unchained and Next.js',
            })}
          </h1>
          <p className="mt-5 max-w-lg text-lg opacity-85">
            {formatMessage({
              id: 'hero_text',
              defaultMessage: 'Discover our latest products and find something you will love.',
            })}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/shop" className="btn btn-lg bg-hero-foreground text-hero hover:opacity-90">
              {formatMessage({ id: 'shop_now', defaultMessage: 'Shop now' })}
              <ArrowRightIcon className="size-4" />
            </Link>
            <a
              href="https://github.com/unchainedshop/storefront"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-lg border border-hero-foreground/30 text-hero-foreground hover:bg-hero-foreground/10"
            >
              {formatMessage({ id: 'view_on_github', defaultMessage: 'View on GitHub' })}
            </a>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-3 sm:grid-cols-3">
        {perks.map(({ icon: Icon, title, text }) => (
          <div key={title} className="flex items-center gap-3 rounded-xl border border-border bg-surface p-4">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent-foreground">
              <Icon className="size-5" />
            </span>
            <span>
              <span className="block text-sm font-semibold">{title}</span>
              <span className="block text-sm text-muted-foreground">{text}</span>
            </span>
          </div>
        ))}
      </section>

      {(assortmentsLoading || rootCategories.length > 0) && (
        <section className="mt-16">
          <SectionHeading
            title={formatMessage({ id: 'browse_categories', defaultMessage: 'Shop by category' })}
          />
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
            {assortmentsLoading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="skeleton aspect-[4/3] rounded-xl" />
                ))
              : rootCategories.map((category) => (
                  <CategoryListItem key={category._id} category={category} />
                ))}
          </div>
        </section>
      )}

      <section className="mt-16">
        <SectionHeading
          title={formatMessage({ id: 'new_arrivals', defaultMessage: 'New arrivals' })}
          href="/shop"
          linkLabel={formatMessage({ id: 'shop_all', defaultMessage: 'Shop all' })}
        />
        {productsLoading ? (
          <ProductGridSkeleton />
        ) : error ? (
          <ErrorMessage message={error.message} />
        ) : products.length > 0 ? (
          <ProductList products={products} totalProducts={products.length} onLoadMore={null} />
        ) : (
          <EmptyState
            icon={SparklesIcon}
            title={formatMessage({ id: 'no_products', defaultMessage: 'No products available' })}
            description={formatMessage({ id: 'no_products_text', defaultMessage: 'New products are on their way. Check back soon.' })}
          />
        )}
      </section>
    </>
  );
};

export default Home;
