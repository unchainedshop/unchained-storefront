import { useFormContext } from "react-hook-form";
import Button from "../../common/components/Button";

const SubmitButton = ({ children, className = "" }) => {
  const {
    formState: { isSubmitting },
  } = useFormContext();

  return (
    <Button
      type="submit"
      variant="primary"
      disabled={isSubmitting}
      aria-busy={isSubmitting}
      className={className}
    >
      {isSubmitting && (
        <span className="size-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
      )}
      {children}
    </Button>
  );
};

export default SubmitButton;
