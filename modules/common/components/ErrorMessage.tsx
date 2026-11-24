import { ExclamationTriangleIcon } from '@heroicons/react/20/solid';

const ErrorMessage = ({ message }) => {
  if (!message) return null;
  return (
    <aside
      role="alert"
      className="flex gap-2 rounded-lg border border-danger/30 bg-danger-soft p-4 text-sm text-danger"
    >
      <ExclamationTriangleIcon className="mt-0.5 size-4 shrink-0" />
      <span>{message}</span>
    </aside>
  );
};

export default ErrorMessage;
