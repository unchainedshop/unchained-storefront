import { useFormContext } from "react-hook-form";
import Button from "../../common/components/Button";

const SubmitButton = ({ children }) => {
  const {
    formState: { errors, isValid },
  } = useFormContext();
  const isDisabled = !isValid && Object.keys(errors || {}).length;

  return (
    <Button
      type="submit"
      variant="primary"
      size="small"
      disabled={isDisabled}
      className="group relative"
      fullWidth={true}
    >
      {children}
    </Button>
  );
};

export default SubmitButton;
