import classnames from "classnames";
import React from "react";
import { useFormContext } from "react-hook-form";
import useValidators from "../lib/useValidators";

import FieldWrapper, { fieldErrorId } from "./FieldWrapper";

const TextField = ({ ...props }) => {
  const { register, formState } = useFormContext();
  const { validateRequired } = useValidators();

  const error = formState?.errors?.[props?.name];

  return (
    <FieldWrapper {...props} error={error}>
      <div className="relative">
      <input
        className={classnames("input", { "pr-11": props.endAdornment }, props.className)}
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
        type={props.type}
        value={props.value}
        {...register(props.name, {
          required: props?.required ? validateRequired : false,
          validate: {
            ...props.validators,
          },
        })}
      />
      {props.endAdornment && (
        <div className="absolute inset-y-0 right-0 flex items-center pr-2">
          {props.endAdornment}
        </div>
      )}
      </div>
    </FieldWrapper>
  );
};

export default TextField;
