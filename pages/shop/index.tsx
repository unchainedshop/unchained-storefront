import { useIntl } from 'react-intl';

import CategoryListItem from '../../modules/assortment/components/CategoryListItem';
import useAssortments from '../../modules/assortment/hooks/useAssortments';
import Loading from '../../modules/common/components/Loading';
import MetaTags from '../../modules/common/components/MetaTags';

const Categories = () => {
  const { assortments, loading } = useAssortments();
  const { formatMessage } = useIntl();

  return (
    <>
      <MetaTags
        title={formatMessage({
          id: 'product_categories',
          defaultMessage: 'Product Categories',
        })}
      />
      <div className="min-h-screen w-screen ml-[calc(-50vw+50%)] bg-white dark:bg-slate-900">
        {loading ? (
          <div className="flex min-h-screen items-center justify-center">
            <Loading />
          </div>
        ) : (
          <>
            {/* Hero Section */}
            <section className="w-full bg-gradient-to-br from-slate-50 to-slate-100 py-16 dark:from-slate-800 dark:to-slate-900">
              <div className="container mx-auto px-4 text-center sm:px-6 lg:px-8">
                <h1 className="mb-4 text-4xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
                  {formatMessage({
                    id: 'shop_by_category',
                    defaultMessage: 'Shop by Category',
                  })}
                </h1>
                <p className="mx-auto max-w-2xl text-lg text-slate-600 dark:text-slate-300">
                  {formatMessage({
                    id: 'categories_description',
                    defaultMessage:
                      'Discover our carefully curated collections designed to meet all your needs',
                  })}
                </p>
              </div>
            </section>

            {/* Categories Grid */}
            <section className="py-16">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {assortments.map((category) => (
                    <div
                      key={category._id}
                      className="group transition-all duration-300"
                    >
                      <CategoryListItem category={category} />
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </>
  );
};

export default Categories;
