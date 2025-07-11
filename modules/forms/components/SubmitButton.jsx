import { useFormContext } from "react-hook-form";

const SubmitButton = ({ children }) => {
  const {
    formState: { errors, isValid },
  } = useFormContext();
  const isDisabled = !isValid && Object.keys(errors || {}).length;
  return (
    <button
      disabled={isDisabled}
      type="submit"
      className="group relative flex w-full justify-center rounded-md border border-transparent bg-slate-900 py-2 px-4 text-sm font-medium text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-800 focus:ring-offset-2"
    >
      {children}
    </button>
  );
};

export default SubmitButton;
