import classnames from "classnames";
import React from "react";
import { useFormContext } from "react-hook-form";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import useValidators from "../lib/useValidators";

import FieldWrapper, { fieldErrorId } from "./FieldWrapper";

const SelectField = ({ ...props }) => {
  const { register, formState } = useFormContext();
  const { validateRequired } = useValidators();

  const error = formState?.errors?.[props?.name];

  return (
    <FieldWrapper {...props} error={error}>
      <div className="relative">
        <select
          className={classnames("input appearance-none pr-10", props.className)}
        aria-invalid={!!error || undefined}
        aria-describedby={error ? fieldErrorId(props.name) : undefined}
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
        <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 size-5 -translate-y-1/2 text-subtle-foreground" />
      </div>
    </FieldWrapper>
  );
};

export default SelectField;
