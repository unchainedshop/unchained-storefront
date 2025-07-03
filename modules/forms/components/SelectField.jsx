import classNames from "classnames";
import React from "react";
import { useFormContext } from "react-hook-form";
import useValidators from "../lib/useValidators";

import FieldWrapper from "./FieldWrapper";

const SelectField = ({ ...props }) => {
  const { register, formState } = useFormContext();
  const { validateRequired } = useValidators();

  const error = formState?.errors?.[props?.name];

  return (
    <FieldWrapper {...props} error={error}>
      <select
        className={classNames(
          "mt-1 block w-full appearance-none rounded-md border focus:outline-none px-3 py-2 text-slate-900 placeholder-slate-400 shadow-xs dark:bg-slate-300 sm:text-sm",
          {
            "border-slate-300 focus:border-slate-900 focus:ring-slate-900":
              !props.error,
            "border-red-300 focus:border-red-500 focus:ring-red-500":
              props.error,
          },
        )}
        disabled={props.disabled}
        id={props.name}
        name={props.name}
        onChange={props.onChange}
        onBlur={props.onBlur}
        placeholder={props.placeholder}
        value={props.value}
        {...register(props.name, {
          required: props?.required ? validateRequired : false,
          validate: {
            ...props.validators,
          },
        })}
      >
        {props.children}
      </select>
    </FieldWrapper>
  );
};

export default SelectField;
