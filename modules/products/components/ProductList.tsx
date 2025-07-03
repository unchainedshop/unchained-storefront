import { useIntl } from "react-intl";
import { ChevronDoubleDownIcon } from "@heroicons/react/20/solid";

import ProductListItem from "./ProductListItem";
import Button from "../../common/components/Button";

const ProductList = ({ products, totalProducts, onLoadMore }) => {
  const { formatMessage } = useIntl();

  return (
    <div className="bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h2 className="sr-only">
          {formatMessage({ id: "products", defaultMessage: "Products" })}
        </h2>

        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {products.map((product) => (
            <ProductListItem key={product?._id} product={product} />
          ))}
        </div>

        {totalProducts > products?.length && (
          <div className="mt-12 flex items-center justify-center">
            <button
              type="button"
              onClick={onLoadMore}
              className="inline-flex items-center rounded-md bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <ChevronDoubleDownIcon
                className="-ml-1 mr-2 h-5 w-5"
                aria-hidden="true"
              />
              {formatMessage({
                id: "load_more",
                defaultMessage: "Load More",
              })}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;
