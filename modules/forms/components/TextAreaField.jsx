import classnames from "classnames";
import React from "react";
import { useFormContext } from "react-hook-form";
import useValidators from "../lib/useValidators";

import FieldWrapper, { fieldErrorId } from "./FieldWrapper";

const TextAreaField = ({ ...props }) => {
  const { register, formState } = useFormContext();
  const { validateRequired } = useValidators();

  const error = formState?.errors?.[props?.name];

  return (
    <FieldWrapper {...props} error={error}>
      <textarea
        className={classnames("input", props.className)}
        aria-invalid={!!error || undefined}
        aria-describedby={error ? fieldErrorId(props.name) : undefined}
        disabled={props.disabled}
        id={props.name}
        name={props.name}
        onChange={props.onChange}
        onBlur={props.onBlur}
        placeholder={props.placeholder}
        autoComplete={props.autoComplete}
        defaultValue={props.defaultValue}
        value={props.value}
        {...register(props.name, {
          required: props?.required ? validateRequired : false,
          validate: {
            ...props.validators,
          },
        })}
      />
    </FieldWrapper>
  );
};

export default TextAreaField;
