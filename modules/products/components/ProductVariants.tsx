import Link from 'next/link';
import { useIntl } from 'react-intl';
import classNames from 'classnames';
import ProductPrice from '../../common/components/ProductPrice';

const Option = ({
  title,
  optionValue,
  variationKey,
  activeProductId,
  assignments,
}) => {
  const { formatMessage } = useIntl();
  const currentProductAssignment = assignments.find(
    (assignment) => assignment.product._id === activeProductId,
  );

  const vectorsToLookFor = (currentProductAssignment?.vectors || []).map(
    (vector) =>
      vector?.variation?.key === variationKey
        ? [variationKey, optionValue]
        : [vector.variation?.key, vector.option?.value],
  );

  const assignment = assignments.find((assignment) =>
    vectorsToLookFor.every(([k, v]) =>
      assignment.vectors.find(
        (otherVector) =>
          otherVector.variation?.key === k && otherVector.option?.value === v,
      ),
    ),
  );

  const isActive = assignment?.product._id === activeProductId;
  const isDisabled = !assignment;

  return (
    <Link
      href={assignment ? `/product/${assignment.product.texts.slug}` : '#'}
      className={classNames(
        'option inline-flex flex-col items-start justify-center p-3 mb-2 border rounded-lg transition-all duration-200 text-left',
        {
          'bg-primary text-primary-foreground border-primary': isActive,
          'bg-surface text-muted-foreground border-input hover:border-input hover:shadow-sm':
            !isActive && !isDisabled,
          'bg-muted text-subtle-foreground border-border pointer-events-none cursor-not-allowed':
            isDisabled,
        },
      )}
    >
      <span className="font-medium">{title}</span>
      {assignment && (
        <>
          <span className="text-sm text-subtle-foreground mt-1">
            {assignment.product.texts.title}
          </span>
          <ProductPrice product={assignment.product} />
        </>
      )}
      {isDisabled && (
        <span className="text-xs mt-1">
          {formatMessage({
            id: 'not_available',
            defaultMessage: 'Not available',
          })}{' '}
        </span>
      )}
    </Link>
  );
};

const ProductVariants = ({ proxy, activeProductId }) => {
  const { formatMessage } = useIntl();

  if (!proxy?._id) return null;

  return (
    <div className="product-variants space-y-6">
      <h2 className="text-lg font-semibold">
        {formatMessage({
          id: 'product.variants.title',
          defaultMessage: 'Variants',
        })}
      </h2>

      {proxy.variations.map((variation) => (
        <div key={variation._id} className="variant space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">
            {variation.texts.title}
          </h4>
          <div className="flex flex-wrap gap-2">
            {variation.options.map((option) => (
              <Option
                key={option._id}
                title={option.texts.title}
                optionValue={option.value}
                variationKey={variation.key}
                assignments={proxy.assignments}
                activeProductId={activeProductId}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductVariants;
