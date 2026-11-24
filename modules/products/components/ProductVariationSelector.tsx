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
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              {variation.texts?.title}
            </h3>
            <div className="flex flex-wrap gap-2">
              {availableOptions.map((option) => (
                <button
                  key={option._id}
                  type="button"
                  disabled={!option.isAvailable}
                  className={classNames('px-3 py-1 border rounded-md text-sm', {
                    'bg-primary text-primary-foreground':
                      selectedOptions[variation.key] === option.value,
                    'bg-muted text-foreground ':
                      option.isAvailable &&
                      selectedOptions[variation.key] !== option.value,
                    'bg-muted-strong text-subtle-foreground cursor-not-allowed':
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
