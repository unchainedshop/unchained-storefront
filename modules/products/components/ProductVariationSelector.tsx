import classNames from 'classnames';

const ProductVariationSelector = ({
  product,
  selectedOptions,
  setSelectedOptions,
}) => {
  if (!product?.variations?.length) return null;

  return (
    <div className="product-variations space-y-4">
      {product.variations.map((variation) => {
        const availableOptions = variation.options.map((option) => {
          const isAvailable = product.assignments.some((assignment) =>
            assignment.vectors.every((vector) =>
              vector.variation.key === variation.key
                ? vector.option.value === option.value
                : selectedOptions[vector.variation.key] ===
                    vector.option.value ||
                  !selectedOptions[vector.variation.key],
            ),
          );
          return { ...option, isAvailable };
        });

        return (
          <div key={variation._id}>
            <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              {variation.texts?.title}
            </h3>
            <div className="flex flex-wrap gap-2">
              {availableOptions.map((option) => (
                <button
                  key={option._id}
                  type="button"
                  disabled={!option.isAvailable}
                  className={classNames('px-3 py-1 border rounded-md text-sm', {
                    'bg-slate-900 text-white':
                      selectedOptions[variation.key] === option.value,
                    'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-white':
                      option.isAvailable &&
                      selectedOptions[variation.key] !== option.value,
                    'bg-slate-200 text-slate-400 cursor-not-allowed':
                      !option.isAvailable,
                  })}
                  onClick={() =>
                    setSelectedOptions((prev) => ({
                      ...prev,
                      [variation.key]: option.value,
                    }))
                  }
                >
                  {option.texts?.title || option.value}
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProductVariationSelector;
