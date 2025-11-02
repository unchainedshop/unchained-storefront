import { useIntl } from 'react-intl';
import ProductListItem from './ProductListItem';

const ProductSiblings = ({ product }) => {
  const { formatMessage } = useIntl();
  if (!product || !product?.siblings?.length) return null;
  const { siblings } = product;

  return (
    <section className="mt-16">
      <h2 className="text-lg font-semibold mb-4">
        {formatMessage({
          id: 'similar_products',
          defaultMessage: 'Similar products',
        })}
      </h2>
      <div className="grid grid-cols-1 gap-6 gap-y-16 sm:grid-cols-2 lg:grid-cols-4">
        {siblings.map((sibling) => (
          <div key={`grid-${sibling?._id}`} className="group relative">
            <ProductListItem product={sibling} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductSiblings;
