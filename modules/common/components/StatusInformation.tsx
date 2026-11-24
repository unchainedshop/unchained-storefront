const StatusInformation = ({
  enumType,
  currentType,
  label,
  component = null,
}) => {
  return (
    component || (
      <span
        title={label}
        className={`${
          currentType === enumType
            ? 'border-border bg-muted text-foreground'
            : 'opacity-10 '
        } mr-2 mb-2 inline-flex items-center rounded-md border border-input bg-surface px-2 py-1 text-sm`}
      >
        {enumType}
      </span>
    )
  );
};

export default StatusInformation;
