import { useForm } from 'react-hook-form';
import { useIntl } from 'react-intl';

import useAddCartDiscount from '../hooks/useAddCartDiscount';
import Form from '../../forms/components/Form';
import TextField from '../../forms/components/TextField';
import SubmitButton from '../../common/components/Button';
import FormErrors from '../../forms/components/FormErrors';

const AddDiscount = ({ orderId }) => {
  const { formatMessage } = useIntl();
  const { addCartDiscount } = useAddCartDiscount();

  const onSubmit = async ({ code }) => {
    await addCartDiscount({ orderId, code });
  };

  const onSubmitError = async (e) => {
    if (e.message.includes('CODE_NOT_VALID')) {
      return {
        code: {
          type: 'manual',
          message: formatMessage({
            id: 'invalid_discount_code',
            defaultMessage: 'Invalid Code',
          }),
        },
      };
    }

    if (
      e.message.includes('CODE_ALREADY_REDEEMED') ||
      e.message.includes('CODE_ALREADY_PRESENT')
    ) {
      return {
        code: {
          type: 'manual',
          message: formatMessage({
            id: 'discount_code_already_used',
            defaultMessage: 'Code already used',
          }),
        },
      };
    }

    return null;
  };

  return (
    <Form
      onSubmit={onSubmit}
      onSubmitError={onSubmitError}
      defaultValues={{ code: '' }}
      className="w-full"
    >
      <div className="flex flex-col sm:flex-row items-stretch gap-3 bg-slate-50 dark:bg-slate-800 p-3 rounded-lg shadow-sm">
        <div className="flex-1">
          <TextField
            type="text"
            name="code"
            id="code"
            className="w-full"
            label={formatMessage({
              id: 'discount_code',
              defaultMessage: 'Discount Code',
            })}
            placeholder={formatMessage({
              id: 'enter_discount_code',
              defaultMessage: 'Enter your code',
            })}
          />
        </div>

        <div className="flex items-end sm:items-center justify-end sm:justify-start sm:flex-none mt-6">
          <SubmitButton
            type="submit"
            variant="primary"
            className="px-5 py-2.5 text-sm font-medium rounded-md bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 transition-all duration-200"
            text={formatMessage({
              id: 'apply_discount',
              defaultMessage: 'Apply Discount',
            })}
          />
        </div>
      </div>

      <FormErrors />
    </Form>
  );
};

export default AddDiscount;
