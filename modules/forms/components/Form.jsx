import classNames from "classnames";
import { FormProvider, useForm } from "react-hook-form";

const Form = ({
  children,
  onSubmit,
  onSubmitError,
  defaultValues,
  onBeforeSubmitValidator = null,
  className = "",
}) => {
  const context = useForm({
    mode: "onTouched",
    defaultValues,
  });

  const handler = async (data) => {
    try {
      const error =
        onBeforeSubmitValidator && (await onBeforeSubmitValidator(data));
      if (error) {
        const [key] = Object.keys(error);
        context.setError(key, error[key]);
        return;
      }

      await onSubmit(data);
    } catch (e) {
      const error = (onSubmitError && (await onSubmitError(e))) || {
        submit: {
          type: "manual",
          message: e.message,
        },
      };
      const [key] = Object.keys(error);
      context.setError(key, error[key]);
    }
  };
  return (
    <FormProvider {...context}>
      <form
        onSubmit={(event) => {
          // A server error from the last attempt is not a field error;
          // react-hook-form only clears "root" itself and refuses to submit
          // while any error is left, which locked the form after one failure.
          context.clearErrors(["submit", "root"]);
          return context.handleSubmit(handler)(event);
        }}
        className={classNames("form", className)}
      >
        {children}
      </form>
    </FormProvider>
  );
};

export default Form;
