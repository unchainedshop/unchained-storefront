import classnames from "classnames";
import React from "react";
import { useFormContext } from "react-hook-form";
import useValidators from "../lib/useValidators";

import FieldWrapper from "./FieldWrapper";

const TextField = ({ ...props }) => {
  const { register, formState } = useFormContext();
  const { validateRequired } = useValidators();

  const error = formState?.errors?.[props?.name];

  return (
    <FieldWrapper {...props} error={error}>
      <input
        className={classnames(
          "relative mt-1 block w-full dark:focus:autofill dark:hover:autofill dark:autofill appearance-none rounded-md border-2 border-border dark:border-0 px-4 py-2.5 text-sm text-foreground shadow-xs placeholder:text-subtle-foreground focus:border-input focus:outline-none focus:ring-1 focus:ring-ring",
          props.className,
          {
            "border-2 border-color-danger-600 placeholder:text-danger":
              !!props.error,
            "border-border": ![error],
          },
        )}
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
    </FieldWrapper>
  );
};

export default TextField;
