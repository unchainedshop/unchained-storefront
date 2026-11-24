import { useIntl } from 'react-intl';

import CategoryListItem from '../../modules/assortment/components/CategoryListItem';
import useAssortments from '../../modules/assortment/hooks/useAssortments';
import MetaTags from '../../modules/common/components/MetaTags';

const Categories = () => {
  const { assortments, loading } = useAssortments();
  const { formatMessage } = useIntl();

  return (
    <>
      <MetaTags
        title={formatMessage({ id: 'product_categories', defaultMessage: 'Product Categories' })}
      />
      <div className="mb-8 max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {formatMessage({ id: 'shop_by_category', defaultMessage: 'Shop by Category' })}
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          {formatMessage({
            id: 'categories_description',
            defaultMessage: 'Discover our carefully curated collections designed to meet all your needs',
          })}
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="skeleton aspect-[4/3] rounded-xl" />
            ))
          : assortments.map((category) => (
              <CategoryListItem key={category._id} category={category} />
            ))}
      </div>
      {!loading && !assortments.length && (
        <p className="rounded-xl border border-dashed border-input py-16 text-center text-muted-foreground">
          {formatMessage({ id: 'no_categories', defaultMessage: 'No categories yet.' })}
        </p>
      )}
    </>
  );
};

export default Categories;
