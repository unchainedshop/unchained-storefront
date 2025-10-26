import classNames from 'classnames';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import useValidators from '../lib/useValidators';
import FieldWrapper from './FieldWrapper';

const CheckboxField = ({ ...props }) => {
  const { register, formState, getValues } = useFormContext();
  const { validateRequired } = useValidators();

  const error = formState?.errors?.[props?.name];
  const { className, ...restProps } = props;
  const selectedValue = getValues()?.[props.name];
  let checked = !!selectedValue;
  if (Array.isArray(selectedValue)) {
    checked = selectedValue.includes(props?.value);
  }
  return (
    <FieldWrapper
      {...restProps}
      error={error}
      className={`${restProps.wrapperClass} `}
      labelClassName={`${restProps.labelClassName} ${
        checked ? 'checkbox-checked' : 'checkbox-unchecked'
      }`}
    >
      <input
        disabled={props.disabled}
        id={restProps?.id}
        name={props.name}
        placeholder={props.placeholder}
        autoComplete={props.autoComplete}
        defaultValue={props.defaultValue}
        type={props.type}
        value={props.value}
        {...register(props.name, {
          required: props?.required ? validateRequired : false,
          validate: {
            ...props.validators,
          },
        })}
        className={classNames('form-check-input', className, {
          'color-red': !!props.error,
          'border-slate-200': ![error],
        })}
      />
    </FieldWrapper>
  );
};

export default CheckboxField;
