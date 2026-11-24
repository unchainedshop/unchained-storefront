import React from "react";
import { useFormContext } from "react-hook-form";
import { ExclamationCircleIcon } from "@heroicons/react/20/solid";

const FormErrors = () => {
  const { formState } = useFormContext();
  const submitErrors = Object.entries(formState?.errors || {}).filter(
    ([name]) => name === "root" || name === "submit",
  );
  if (!submitErrors.length) return null;
  return (
    <div
      role="alert"
      className="mt-4 flex gap-2 rounded-lg border border-danger/30 bg-danger-soft p-3 text-sm text-danger"
    >
      <ExclamationCircleIcon className="mt-0.5 size-4 shrink-0" />
      <div>
        {submitErrors.map(([name, error]) => (
          <p key={name}>{error.message?.replace(/{label}/gi, name)}</p>
        ))}
      </div>
    </div>
  );
};

export default FormErrors;
