import { BookmarkIcon, PhotoIcon } from "@heroicons/react/20/solid";
import classNames from "classnames";
import Image from "next/legacy/image";
import Link from "next/link";

import useUser from "../../auth/hooks/useUser";
import useConditionalBookmarkProduct from "../../cart/hooks/useConditionalBookmarkProduct";
import useRemoveBookmark from "../../common/hooks/useRemoveBookmark";
import defaultNextImageLoader from "../../common/utils/defaultNextImageLoader";
import FormattedPrice from "../../common/components/FormattedPrice";

const ProductListItem = ({ product, disableBookmark = false }) => {
  const { conditionalBookmarkProduct } = useConditionalBookmarkProduct();
  const { removeBookmark } = useRemoveBookmark();

  const { user } = useUser();

  const [filteredBookmark] =
    user?.bookmarks?.filter(
      (bookmark) => bookmark?.product?._id === product?._id,
    ) || [];

  const firstMediaUrl = product?.media?.[0]?.file?.url;

  return (
    <>
      <div className="relative">
        <div className="aspect-w-1 aspect-h-1 overflow-hidden rounded-lg  text-slate-200 group-hover:opacity-75 dark:bg-slate-500">
          <Link
            href={`/product/${product?.texts?.slug}`}
            className="h-full py-5 text-center"
          >
            {firstMediaUrl ? (
              <Image
                src={firstMediaUrl}
                alt={product?.texts?.title}
                layout="fill"
                placeholder="blur"
                blurDataURL="placeholder.png"
                objectFit="cover"
                className="h-full w-full"
                loader={defaultNextImageLoader}
              />
            ) : (
              <div className="relative h-full w-full">
                <PhotoIcon className="absolute inset-0 h-full w-full  dark:text-slate-500" />
              </div>
            )}
          </Link>
        </div>
      </div>
      {!disableBookmark && (
        <button
          type="button"
          className="bg-white absolute top-1 right-1 dark:text-white"
          onClick={() =>
            filteredBookmark
              ? removeBookmark({
                  bookmarkId: filteredBookmark?._id,
                })
              : conditionalBookmarkProduct({
                  productId: product?._id,
                })
          }
        >
          <BookmarkIcon
            className={classNames("h-6 w-6", {
              "text-purple-600 hover:text-purple-700 dark:text-yellow-500 dark:hover:text-yellow-700":
                filteredBookmark,
              "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-300":
                !filteredBookmark,
            })}
          />
        </button>
      )}

      <div className="pt-4 text-center">
        <h3 className="text-sm font-medium text-slate-900 dark:text-white">
          {product?.texts?.title}
        </h3>
        <span className="ml-1">
          <FormattedPrice price={product?.simulatedPrice} />
        </span>
      </div>
    </>
  );
};

export default ProductListItem;
