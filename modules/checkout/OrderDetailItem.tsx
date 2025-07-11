import { useIntl } from "react-intl";
import Link from "next/link";
import { useFormatPrice } from "../common/utils/utils";
import ImageWithFallback from "../common/components/ImageWithFallback";

const OrderDetailItem = ({ item }) => {
  const { formatMessage } = useIntl();
  const { formatPrice } = useFormatPrice();
  return (
    <Link href={`/product/${item.product.texts.slug}`} className="block group">
      <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors duration-200">
        {/* Product Image */}
        <div className="flex-shrink-0">
          {item.product?.media?.length ? (
            <ImageWithFallback
              src={`${item.product?.media[0].file.url}`}
              alt={
                item?.product?.texts?.title || item?.product?.texts?.subtitle
              }
              className="object-cover object-center rounded"
              width={48}
              height={48}
            />
          ) : (
            <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded flex items-center justify-center">
              <span className="text-slate-400 text-xs">No image</span>
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-slate-900 dark:text-white truncate">
            {item?.product?.texts?.title || item?.product?.texts?.subtitle}
          </h3>
          <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Qty: {item?.quantity}
          </div>
        </div>

        {/* Price */}
        <div className="text-sm font-medium text-slate-900 dark:text-white">
          {formatPrice(item?.unitPrice)}
        </div>
      </div>
    </Link>
  );
};

export default OrderDetailItem;
