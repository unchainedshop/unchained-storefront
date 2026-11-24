import Link from 'next/link';
import { useIntl } from 'react-intl';
import { PhotoIcon } from '@heroicons/react/24/outline';
import ProductPrice from '../../common/components/ProductPrice';
import getMediaUrl from '../../common/utils/getMediaUrl';
import getProductHref from '../../common/utils/getProductHref';

const ProductBundleItems = ({ product }) => {
  const { formatMessage } = useIntl();
  if (product.__typename !== 'BundleProduct' || !product.bundleItems?.length) return null;

  return (
    <section>
      <h2 className="mb-4 text-xl font-bold tracking-tight">
        {formatMessage({ id: 'bundle_includes', defaultMessage: 'This bundle includes' })}
      </h2>
      <ul className="card divide-y divide-border">
        {product.bundleItems.map(({ product: item, quantity }) => {
          const imageUrl = getMediaUrl(item);
          return (
            <li key={item._id}>
              <Link
                href={getProductHref(item.texts?.slug)}
                className="flex items-center gap-4 p-4 transition-colors hover:bg-muted"
              >
                <span className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted">
                  {imageUrl ? (
                    <img src={imageUrl} alt="" className="size-full object-cover" />
                  ) : (
                    <PhotoIcon className="size-7 text-subtle-foreground" />
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium">{item.texts?.title}</span>
                  {item.texts?.subtitle && (
                    <span className="block truncate text-sm text-muted-foreground">{item.texts.subtitle}</span>
                  )}
                </span>
                <span className="badge">× {quantity || 1}</span>
                <span className="w-28 text-right text-sm font-semibold">
                  <ProductPrice product={item} compact />
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default ProductBundleItems;
