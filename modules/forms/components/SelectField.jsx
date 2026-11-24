import classNames from "classnames";
import React from "react";
import { useFormContext } from "react-hook-form";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import useValidators from "../lib/useValidators";

import FieldWrapper from "./FieldWrapper";

const SelectField = ({ ...props }) => {
  const { register, formState } = useFormContext();
  const { validateRequired } = useValidators();

  const error = formState?.errors?.[props?.name];

  return (
    <FieldWrapper {...props} error={error}>
      <div className="relative">
        <select
          className={classNames(
            "relative mt-1 block w-full dark:focus:autofill dark:hover:autofill dark:autofill appearance-none rounded-md border-2 dark:border-0 px-4 py-2.5 pr-10 text-sm text-foreground placeholder-subtle-foreground shadow-xs placeholder:text-subtle-foreground focus:border-input focus:outline-none focus:ring-1 focus:ring-ring",
            props.className,
            {
              "border-2 border-color-danger-600 placeholder:text-danger":
                !!props.error,
              "border-border": !error,
            },
          )}
          disabled={props.disabled}
          id={props.name}
          name={props.name}
          onChange={props.onChange}
          onBlur={props.onBlur}
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
        <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-subtle-foreground pointer-events-none" />
      </div>
    </FieldWrapper>
  );
};

export default SelectField;
