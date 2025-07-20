import isLength from 'validator/lib/isLength';
import isEmail from 'validator/lib/isEmail';

import { useIntl } from 'react-intl';
import { CountryCodes, LanguageCodes } from '../../common/data/iso-codes';

const useValidators = () => {
  const { formatMessage } = useIntl();
  const isString = (value) => typeof value === 'string';

  const validateMaxLength = (max: number) => (value) => {
    if (isLength(value || '', { max })) return true;
    return formatMessage(
      {
        id: 'error_max_length',
        defaultMessage:
          '{label} must not be longer than {maxLength} characters',
      },
      {
        maxLength: max,
      },
    );
  };

  const validateEmail = (value) => {
    if (isEmail(value || '') || !value) return true;
    return formatMessage({
      id: 'error_email',
      defaultMessage: '{label} must be a valid email address',
    });
  };

  const validateLanguage = (value) => {
    if (LanguageCodes.includes(value?.toLowerCase())) return true;
    return formatMessage({
      id: 'error_language_code',
      defaultMessage: 'Invalid language code',
    });
  };

  const isContractAddress = (isRequired) => (value) => {
    if (!isRequired && !value ? true : /^(0x)?[a-z0-9]{40}$/i.test(value))
      return true;
    return formatMessage({
      id: 'error_contract_address',
      defaultMessage: 'Invalid contract address',
    });
  };

  const validateInteger = (value) => {
    if (!Number.isNaN(value) && Number.isInteger(value)) return true;
    return formatMessage({
      id: 'error_number_not_int',
      defaultMessage: 'Invalid value please provide integer value',
    });
  };

  const validateCountry = (value) => {
    if (CountryCodes.includes(value.toUpperCase())) return true;
    return formatMessage({
      id: 'error_country_code',
      defaultMessage: 'Invalid country code',
    });
  };

  const validateRequired = (value) => {
    if (isString(value)) {
      if (value.trim().length > 0) return true;
      return formatMessage({
        id: 'error_required',
        defaultMessage: '{label} is a required field',
      });
    }
    if (typeof value === 'number') {
      return true;
    }
    if (Array.isArray(value)) {
      if (value.length > 0) return true;
      return formatMessage({
        id: 'error_required',
        defaultMessage: '{label} is a required field',
      });
    }
    if (value) return true;
    return formatMessage({
      id: 'error_required',
      defaultMessage: '{label} is a required field',
    });
  };

  const isEmpty = (value) =>
    value === null || value === '' || value === undefined;

  const validateProductCommerceOneNull = (values) => {
    return {
      isValid: () => {
        if (
          values?.length &&
          values?.length === 1 &&
          !isEmpty(values[0].maxQuantity)
        )
          return false;
        if (
          values.filter(({ maxQuantity }) => isEmpty(maxQuantity))?.length !== 1
        )
          return false;
        return true;
      },

      intlMessageDescriptor: formatMessage({
        id: 'error_commerce_quantity_null_required',
        defaultMessage: '{label} should have one price with null max quantity',
      }),
    };
  };

  return {
    validateProductCommerceOneNull,

    validateEmail,
    validateCountry,
    validateMaxLength,
    validateInteger,
    validateRequired,
    validateLanguage,
    isContractAddress,
  };
};

export default useValidators;
