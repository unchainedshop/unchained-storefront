import Link from 'next/link';
import ProductPrice from '../../common/components/ProductPrice';
import AddToCartButton from '../../cart/components/AddToCartButton';
import getMediaUrl from '../../common/utils/getMediaUrl';

const ProductBundleItems = ({ product }) => {
  if (product.__typename !== 'BundleProduct' || !product.bundleItems?.length)
    return null;

  return (
    <section className="mt-12">
      <h2 className="text-xl font-semibold mb-6">This bundle includes:</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {product.bundleItems.map(({ product: item }) => (
          <div
            key={item._id}
            className="rounded-xl border p-4 hover:shadow transition-all"
          >
            <Link href={`/product/${item.texts?.slug}`}>
              <img
                src={getMediaUrl(item)}
                alt={item.texts?.title}
                className="aspect-square w-full object-cover"
              />
            </Link>
            <h3 className="mt-2 text-lg font-medium">{item.texts?.title}</h3>
            <ProductPrice product={item} />
            <AddToCartButton productId={item._id} {...item} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductBundleItems;
