import { useIntl } from 'react-intl';

import CategoryListItem from '../../modules/assortment/components/CategoryListItem';
import useAssortments from '../../modules/assortment/hooks/useAssortments';
import MetaTags from '../../modules/common/components/MetaTags';
import PageHeader from '../../modules/common/components/PageHeader';
import EmptyState from '../../modules/common/components/EmptyState';
import { Squares2X2Icon } from '@heroicons/react/24/outline';

const Categories = () => {
  const { assortments, loading } = useAssortments();
  const { formatMessage } = useIntl();

  return (
    <>
      <MetaTags
        title={formatMessage({ id: 'product_categories', defaultMessage: 'Product Categories' })}
      />
      <PageHeader
        icon={Squares2X2Icon}
        title={formatMessage({ id: 'shop_by_category', defaultMessage: 'Shop by Category' })}
        description={formatMessage({
          id: 'categories_description',
          defaultMessage: 'Discover our carefully curated collections designed to meet all your needs',
        })}
      />
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
        <EmptyState
          icon={Squares2X2Icon}
          title={formatMessage({ id: 'no_categories', defaultMessage: 'No categories yet.' })}
          description={formatMessage({ id: 'no_categories_text', defaultMessage: 'Categories will appear here once the shop is set up.' })}
        />
      )}
    </>
  );
};

export default Categories;
