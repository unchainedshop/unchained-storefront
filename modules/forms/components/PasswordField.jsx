import React, { useState } from "react";
import { useIntl } from "react-intl";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import TextField from "./TextField";

const PasswordField = (props) => {
  const [visible, setVisible] = useState(false);
  const { formatMessage } = useIntl();

  return (
    <TextField
      {...props}
      type={visible ? "text" : "password"}
      endAdornment={
        <button
          type="button"
          className="rounded-md p-1.5 text-subtle-foreground hover:bg-muted hover:text-foreground"
          aria-label={
            visible
              ? formatMessage({ id: "hide_password", defaultMessage: "Hide password" })
              : formatMessage({ id: "show_password", defaultMessage: "Show password" })
          }
          aria-pressed={visible}
          onClick={() => setVisible((v) => !v)}
        >
          {visible ? <EyeSlashIcon className="size-5" /> : <EyeIcon className="size-5" />}
        </button>
      }
    />
  );
};

export default PasswordField;
