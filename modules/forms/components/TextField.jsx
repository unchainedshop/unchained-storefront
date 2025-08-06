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
          "relative mt-1 block w-full dark:focus:autofill dark:hover:autofill dark:autofill dark:placeholder:text-white dark:bg-slate-900 dark:text-slate-200 appearance-none rounded-md border-2 border-slate-200 dark:border-0 px-4 py-2.5 text-sm text-slate-900 shadow-xs placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400",
          props.className,
          {
            "border-2 border-color-danger-600 placeholder:text-red-300":
              !!props.error,
            "border-slate-200": ![error],
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
