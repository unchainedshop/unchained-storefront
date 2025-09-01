import Link from 'next/link';
import { useIntl } from 'react-intl';
import FormattedPrice from '../../common/components/FormattedPrice';

const Option = ({
  title,
  optionValue,
  variationKey,
  activeProductId,
  assignments,
}) => {
  const currentProductAssignment = assignments.find((assignment) => {
    return assignment.product._id === activeProductId;
  });

  const vectorsToLookFor = (currentProductAssignment?.vectors || []).map(
    (vector) => {
      if (vector?.variation?.key === variationKey) {
        return [variationKey, optionValue];
      }
      return [vector.variation?.key, vector.option?.value];
    },
  );

  const assignment = assignments.find((assignment) => {
    const isMatchingVector = vectorsToLookFor.every(([k, v]) => {
      return assignment.vectors.find(
        (otherVector) =>
          otherVector.variation?.key === k && otherVector.option?.value === v,
      );
    });

    return isMatchingVector;
  });

  return (
    <div className="option border p-2 mb-2">
      <div className="text-gray-500">
        {title}
        <br />
        {assignment ? (
          <Link
            href={`/product/${assignment?.product.texts.slug}`}
            className={
              assignment.product._id === activeProductId ? 'active' : ''
            }
          >
            {assignment?.product.texts.title}
            <br />
            <FormattedPrice price={assignment?.product?.simulatedPrice} />
          </Link>
        ) : (
          <span className="text-red-500">Not available</span>
        )}
      </div>
    </div>
  );
};

const ProductVariants = ({ proxy, activeProductId }) => {
  const { formatMessage } = useIntl();

  if (!proxy?._id) return null;

  return (
    <div className="product-variants">
      <h2 className="text-lg font-semibold mb-4">
        {formatMessage({
          id: 'product.variants.title',
          defaultMessage: 'Variants',
        })}
      </h2>

      {proxy.variations.map((variation) => (
        <div key={variation._id} className="variant">
          <h4>{variation.texts.title}</h4>
          <div>
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
