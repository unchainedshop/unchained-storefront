import classNames from 'classnames';

interface EmptyStateProps {
  icon?: React.ComponentType<{ className?: string }>;
  title: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

const EmptyState = ({ icon: Icon, title, description, children, className }: EmptyStateProps) => (
  <div
    className={classNames(
      'relative isolate flex flex-col items-center overflow-hidden rounded-2xl border border-border bg-surface px-6 py-16 text-center',
      className,
    )}
  >
    <div
      aria-hidden
      className="absolute inset-x-0 top-0 -z-10 h-40 bg-[radial-gradient(60%_100%_at_50%_0%,var(--accent-soft),transparent)]"
    />
    {Icon && (
      <span className="flex size-14 items-center justify-center rounded-2xl bg-surface text-accent shadow-card ring-1 ring-border">
        <Icon className="size-7" />
      </span>
    )}
    <h2 className="mt-5 text-lg font-semibold">{title}</h2>
    {description && <p className="mt-1.5 max-w-md text-sm text-muted-foreground">{description}</p>}
    {children && <div className="mt-6 flex flex-wrap justify-center gap-3">{children}</div>}
  </div>
);

export default EmptyState;
