import {
  ChatBubbleLeftIcon,
  PhotoIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { useIntl } from 'react-intl';
import useUser from '../../auth/hooks/useUser';
import CheckboxField from '../../forms/components/CheckboxField';
import EmailField from '../../forms/components/EmailField';
import Form from '../../forms/components/Form';
import SubmitButton from '../../forms/components/SubmitButton';
import TextField from '../../forms/components/TextField';
import TextAreaField from '../../forms/components/TextAreaField';
import useConditionalRequestProductQuotation from '../hooks/useConditionalRequestProductQuotation';

const GuestUserFields = () => {
  const { formatMessage } = useIntl();
  return (
    <>
      <div className="row">
        <EmailField
          id="emailAddress"
          name="emailAddress"
          className="col-md-6"
          required
          label={formatMessage({
            id: 'email',
            defaultMessage: 'E-Mail',
          })}
        />
        <TextField
          id="phoneNumber"
          name="phoneNumber"
          className="col-md-6"
          required
          type="text"
          label={formatMessage({
            id: 'phone-number',
            defaultMessage: 'Telefonnummer',
          })}
        />
        <TextField
          id="firstName"
          name="firstName"
          required
          className="col-md-6"
          type="text"
          label={formatMessage({
            id: 'first_name',
            defaultMessage: 'Vorname',
          })}
        />
        <TextField
          id="lastName"
          name="lastName"
          className="col-md-6"
          required
          type="text"
          label={formatMessage({
            id: 'last-name',
            defaultMessage: 'Nachname',
          })}
        />
        <TextField
          id="company"
          name="company"
          className="col-md-6"
          required
          type="text"
          label={formatMessage({
            id: 'company',
            defaultMessage: 'Unternehmen',
          })}
        />
        <TextField
          id="addressLine2"
          name="addressLine2"
          className="col-md-6"
          type="text"
          label={`${formatMessage({
            id: 'addressLine2',
            defaultMessage: 'Zusatz/Abteilung/Etage/Raum',
          })} ${formatMessage({
            id: 'optional',
            defaultMessage: '(Optional)',
          })}`}
        />
        <TextField
          id="street"
          className="col-md-6"
          name="addressLine"
          required
          type="text"
          label={formatMessage({
            id: 'street',
            defaultMessage: 'Straße',
          })}
        />
        <TextField
          id="postalCode"
          name="postalCode"
          className="col-md-6"
          required
          type="text"
          label={formatMessage({
            id: 'postal-code',
            defaultMessage: 'Postleitzahl',
          })}
        />
        <TextField
          id="city"
          name="city"
          className="col-md-6"
          required
          type="text"
          label={formatMessage({
            id: 'city',
            defaultMessage: 'Ort',
          })}
        />
        <TextAreaField
          className="col-12"
          name="message"
          rows={5}
          label={formatMessage({
            id: 'message',
            defaultMessage: 'Nachricht (optional)',
          })}
        />
      </div>

      <div className="my-4">
        <h5 className="mb-0">
          {formatMessage({
            id: 'newsletter-subscription-options',
            defaultMessage: 'Newsletter Anmeldung gewünscht für:',
          })}
        </h5>
      </div>
    </>
  );
};

const QuotationRequestForm = ({ product }) => {
  const { requestQuotation } = useConditionalRequestProductQuotation();
  const { formatMessage } = useIntl();
  const { user } = useUser();

  const isGuestUser = !user || user?.isGuest;

  const newsletterSubscriptionOptionsMap = {
    news: formatMessage({
      id: 'newsletter-registration-option-news',
      defaultMessage: ' News/Angebote',
    }),
    device: formatMessage({
      id: 'newsletter-registration-option-devices',
      defaultMessage: ' Plotter/Maschinen/Geräte',
    }),
    paper: formatMessage({
      id: 'newsletter-registration-option-paper',
      defaultMessage: ' Papiere/Medien/Zubehör',
    }),
  };

  const onSubmitError = async (error) => {
    if (error?.code === 'InvalidCaptchaValue') {
      return {
        captcha: {
          type: 'manual',
          message: formatMessage({
            id: 'incorrect-captcha-answer',
            defaultMessage: 'Incorrect CAPTCHA answer',
          }),
        },
      };
    }

    return {
      submit: {
        type: 'manual',
        message: formatMessage(
          {
            id: 'quotation-request-failed',
            defaultMessage: 'quotation request failed with the {error}',
          },
          { error: error.message },
        ),
      },
    };
  };

  const firstMediaUrl = product?.media?.[0]?.file?.url;
  const isDevice = !!product?.tags?.includes('device');

  const onSubmit = async ({ quantity, ...contactInfo }) => {
    await requestQuotation({
      productId: product?._id,
      quantity: (quantity || 1)?.toString(),
      contactInfo,
    });

    toast.custom((t) => (
      <div
        className={`color-bg-white p-3 box-shadow position-relative ${
          t.visible ? 'animate-enter' : 'animate-leave'
        } `}
      >
        <button
          type="button"
          aria-label="Close"
          className="no-button position-absolute top-right"
          onClick={() => {
            toast.dismiss(t.id);
            close();
          }}
        >
          <XMarkIcon className="icon" />
        </button>
        <div className="mt-2">
          <div className="d-flex align-items-center justify-content-between">
            <div>
              <img
                className="h-max-44px"
                src={firstMediaUrl}
                alt={product?.texts?.title}
              />
            </div>
            <div className="ml-3">
              <div>
                {product?.texts?.title}
                <div className="mt-2 color-green">
                  {quantity} x
                  {formatMessage({
                    id: 'quotation-request-sent',
                    defaultMessage: 'Angebotsanfrage gesendet',
                  })}
                </div>
              </div>
              <div className="mt-1">{product?.texts?.subtitle}</div>
            </div>
          </div>
        </div>
      </div>
    ));
  };

  return (
    <Form
      onSubmit={onSubmit}
      defaultValues={{
        quantity: 1,
        firstName: user?.contactAddress?.firstName,
        lastName: user?.contactAddress?.lastName,
        company: user?.contactAddress?.company,
        addressLine2: user?.contactAddress?.addressLine2,
        addressLine: user?.contactAddress?.addressLine,
        postalCode: user?.contactAddress?.postalCode,
        city: user?.contactAddress?.city,
        emailAddress: user?.contactAddress?.emailAddress,
        newsletterSubscriptionOption: user?.isGuest
          ? Object.values(newsletterSubscriptionOptionsMap)
          : '',
      }}
      onSubmitError={onSubmitError}
    >
      <div className="row">
        <div className="col-md-6 position-relative grid-image-container">
          {firstMediaUrl ? (
            <Image
              src={firstMediaUrl}
              alt={product?.texts?.title}
              className="fit-contain"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          ) : (
            <PhotoIcon
              className="h-100 w-100 p-5"
              style={{ stroke: 'var(--color-lightgrey)' }}
            />
          )}
        </div>
        <div className="col-md-6">
          <h4 className="position-relative mt-4 mb-0">
            {product?.texts?.title}
          </h4>
          <div className="d-flex align-items-end pt-2">
            <TextField
              type="number"
              className="flex-grow-1"
              name="quantity"
              min="1"
              onInput={(e) => {
                e.target.value = Math.abs(e.target.value);
              }}
              id="quantity"
              placeholder="Menge"
              label="Menge"
            />
            <div className="rounded color-bg-white p-3">
              {product.salesUnit}
            </div>
          </div>
          {isDevice ? (
            <CheckboxField
              name="requestShowRoomVisit"
              id="requestShowRoomVisit"
              label={formatMessage({
                id: 'request-showroom-visit',
                defaultMessage:
                  'Ich wünsche einen Termin für eine Vorführung im Demoraum',
              })}
              type="checkbox"
              className="form-check-input"
              labelClassName="form-check-label line-height-normal"
              wrapperClass="form-check checkbox required"
            />
          ) : null}
          {isDevice ? (
            <CheckboxField
              name="requestAdviceByTelephone"
              id="requestAdviceByTelephone"
              label={formatMessage({
                id: 'request-showroom-visit',
                defaultMessage: 'Ich wünsche eine Beratung per Telefon',
              })}
              type="checkbox"
              className="form-check-input"
              labelClassName="form-check-label line-height-normal"
              wrapperClass="form-check checkbox required"
            />
          ) : null}
        </div>
      </div>

      {isGuestUser ? (
        <GuestUserFields />
      ) : (
        <TextAreaField
          className="col-12"
          name="message"
          rows={5}
          label={`${formatMessage({
            id: 'message',
            defaultMessage: 'Nachricht',
          })} ${formatMessage({
            id: 'optional',
            defaultMessage: '(Optional)',
          })}`}
        />
      )}
      <div className="mt-4">
        <SubmitButton>
          <ChatBubbleLeftIcon className="icon mr-2 h-5 w-5" />
          {formatMessage({
            id: 'request-quotation-offer',
            defaultMessage: 'Anfrage Angebot',
          })}
        </SubmitButton>
      </div>
    </Form>
  );
};

export default QuotationRequestForm;
