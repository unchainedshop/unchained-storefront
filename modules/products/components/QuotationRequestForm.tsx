import { ChatBubbleLeftIcon, PhotoIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { useIntl } from 'react-intl';
import defaultNextImageLoader from '../../common/utils/defaultNextImageLoader';
import useUser from '../../auth/hooks/useUser';
import EmailField from '../../forms/components/EmailField';
import Form from '../../forms/components/Form';
import FormErrors from '../../forms/components/FormErrors';
import SubmitButton from '../../forms/components/SubmitButton';
import TextField from '../../forms/components/TextField';
import TextAreaField from '../../forms/components/TextAreaField';
import useConditionalRequestProductQuotation from '../hooks/useConditionalRequestProductQuotation';

const GuestUserFields = () => {
  const { formatMessage } = useIntl();
  const optional = formatMessage({ id: 'optional', defaultMessage: '(Optional)' });
  return (
    <fieldset className="grid gap-4 sm:grid-cols-2">
      <legend className="mb-2 text-base font-semibold">
        {formatMessage({ id: 'contact_details', defaultMessage: 'Your contact details' })}
      </legend>
      <EmailField
        id="emailAddress"
        name="emailAddress"
        required
        label={formatMessage({ id: 'email_address', defaultMessage: 'E-Mail' })}
      />
      <TextField
        id="phoneNumber"
        name="phoneNumber"
        required
        type="tel"
        label={formatMessage({ id: 'phone-number', defaultMessage: 'Phone number' })}
      />
      <TextField id="firstName" name="firstName" required type="text" label={formatMessage({ id: 'first_name', defaultMessage: 'First name' })} />
      <TextField id="lastName" name="lastName" required type="text" label={formatMessage({ id: 'last-name', defaultMessage: 'Last name' })} />
      <TextField id="company" name="company" required type="text" label={formatMessage({ id: 'company', defaultMessage: 'Company' })} />
      <TextField
        id="addressLine2"
        name="addressLine2"
        type="text"
        label={`${formatMessage({ id: 'addressLine2', defaultMessage: 'Addition/Department/Floor/Room' })} ${optional}`}
      />
      <TextField id="street" name="addressLine" required type="text" label={formatMessage({ id: 'street', defaultMessage: 'Street' })} />
      <div className="grid grid-cols-[1fr_2fr] gap-4">
        <TextField id="postalCode" name="postalCode" required type="text" label={formatMessage({ id: 'postal-code', defaultMessage: 'Postal code' })} />
        <TextField id="city" name="city" required type="text" label={formatMessage({ id: 'city', defaultMessage: 'City' })} />
      </div>
    </fieldset>
  );
};

const QuotationRequestForm = ({ product }) => {
  const { requestQuotation } = useConditionalRequestProductQuotation();
  const { formatMessage } = useIntl();
  const router = useRouter();
  const { user } = useUser();
  const isGuestUser = !user || user?.isGuest;
  const firstMediaUrl = product?.media?.[0]?.file?.url;

  const onSubmitError = async (error) => {
    if (error?.code === 'InvalidCaptchaValue') {
      return {
        captcha: {
          type: 'manual',
          message: formatMessage({ id: 'incorrect-captcha-answer', defaultMessage: 'Incorrect CAPTCHA answer' }),
        },
      };
    }
    return {
      submit: {
        type: 'manual',
        message: formatMessage(
          { id: 'quotation-request-failed', defaultMessage: 'quotation request failed with the {error}' },
          { error: error.message },
        ),
      },
    };
  };

  const onSubmit = async ({ quantity, ...contactInfo }) => {
    await requestQuotation({
      productId: product?._id,
      quantity: (quantity || 1)?.toString(),
      contactInfo,
    });
    toast.success(
      formatMessage({ id: 'quotation-request-sent', defaultMessage: 'Quotation request sent' }),
    );
    // Guests cannot open the account area, so only registered customers are sent there.
    if (!isGuestUser) router.push('/quotation');
  };

  return (
    <Form
      onSubmit={onSubmit}
      defaultValues={{
        quantity: 1,
        firstName: user?.profile?.address?.firstName,
        lastName: user?.profile?.address?.lastName,
        company: user?.profile?.address?.company,
        addressLine2: user?.profile?.address?.addressLine2,
        addressLine: user?.profile?.address?.addressLine,
        postalCode: user?.profile?.address?.postalCode,
        city: user?.profile?.address?.city,
        emailAddress: user?.primaryEmail?.address,
      }}
      onSubmitError={onSubmitError}
      className="grid items-start gap-8 lg:grid-cols-[320px_1fr]"
    >
      <aside className="card overflow-hidden lg:sticky lg:top-24">
        <div className="relative aspect-square bg-muted">
          {firstMediaUrl ? (
            <Image
              src={firstMediaUrl}
              alt={product?.texts?.title}
              className="object-contain"
              fill
              loader={defaultNextImageLoader}
              sizes="(max-width: 1024px) 100vw, 320px"
            />
          ) : (
            <span className="flex size-full items-center justify-center">
              <PhotoIcon className="size-16 text-subtle-foreground" />
            </span>
          )}
        </div>
        <div className="p-5">
          <p className="font-semibold">{product?.texts?.title}</p>
          {product?.texts?.subtitle && <p className="mt-1 text-sm text-muted-foreground">{product.texts.subtitle}</p>}
        </div>
      </aside>

      <div className="card space-y-6 p-5 sm:p-8">
        <div className="flex items-end gap-3">
          <div className="w-40">
            <TextField
              type="number"
              name="quantity"
              min="1"
              id="quantity"
              onInput={(e) => {
                e.target.value = Math.abs(e.target.value);
              }}
              label={formatMessage({ id: 'quantity', defaultMessage: 'Quantity' })}
            />
          </div>
          {product?.salesUnit && <span className="pb-3 text-sm text-muted-foreground">{product.salesUnit}</span>}
        </div>

        {isGuestUser && <GuestUserFields />}

        <TextAreaField
          name="message"
          rows={5}
          label={`${formatMessage({ id: 'message', defaultMessage: 'Message' })} ${formatMessage({
            id: 'optional',
            defaultMessage: '(Optional)',
          })}`}
          placeholder={formatMessage({
            id: 'quotation_message_placeholder',
            defaultMessage: 'Tell us about volumes, delivery dates or anything else that affects the offer.',
          })}
        />

        <FormErrors />
        <SubmitButton>
          <ChatBubbleLeftIcon className="size-5" />
          {formatMessage({ id: 'request-quotation-offer', defaultMessage: 'Request offer' })}
        </SubmitButton>
      </div>
    </Form>
  );
};

export default QuotationRequestForm;
