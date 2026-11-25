import { useForm } from 'react-hook-form';
import { useIntl } from 'react-intl';

import useAddCartDiscount from '../hooks/useAddCartDiscount';
import Form from '../../forms/components/Form';
import TextField from '../../forms/components/TextField';
import Button from '../../common/components/Button';
import FormErrors from '../../forms/components/FormErrors';

const AddDiscount = ({ orderId }) => {
  const { formatMessage } = useIntl();
  const { addCartDiscount } = useAddCartDiscount();

  const onSubmit = async ({ code }) => {
    await addCartDiscount({ orderId, code });
  };

  const onSubmitError = async (e) => {
    const alreadyUsed = /already/i.test(e?.message || '');
    return {
      code: {
        type: 'manual',
        message: alreadyUsed
          ? formatMessage({
              id: 'discount_code_already_used',
              defaultMessage: 'Code already used',
            })
          : formatMessage({
              id: 'invalid_discount_code',
              defaultMessage: 'Invalid Code',
            }),
      },
    };
  };

  return (
    <Form
      onSubmit={onSubmit}
      onSubmitError={onSubmitError}
      defaultValues={{ code: '' }}
      className="w-full"
    >
      <div className="flex items-start gap-2">
        <TextField
          type="text"
          name="code"
          hideLabel
          label={formatMessage({
            id: 'discount_code',
            defaultMessage: 'Discount Code',
          })}
          placeholder={formatMessage({
            id: 'enter_discount_code',
            defaultMessage: 'Discount code',
          })}
        />
        <Button
          type="submit"
          variant="secondary"
          fullWidth={false}
          text={formatMessage({ id: 'apply_discount', defaultMessage: 'Apply' })}
        />
      </div>
      <FormErrors />
    </Form>
  );
};

export default AddDiscount;
