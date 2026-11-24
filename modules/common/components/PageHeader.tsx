import classNames from 'classnames';

interface PageHeaderProps {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
  actions?: React.ReactNode;
  centered?: boolean;
  children?: React.ReactNode;
  className?: string;
}

const PageHeader = ({ eyebrow, title, description, icon: Icon, actions, centered, className, children }: PageHeaderProps) => (
  <header
    className={classNames(
      'relative isolate mb-8 overflow-hidden rounded-2xl border border-border bg-surface px-6 py-8 sm:px-10 sm:py-10',
      className,
    )}
  >
    <div
      aria-hidden
      className="absolute inset-0 -z-10 bg-[radial-gradient(50%_120%_at_100%_0%,var(--accent-soft),transparent),radial-gradient(40%_80%_at_0%_100%,color-mix(in_oklch,var(--accent-soft)_50%,transparent),transparent)]"
    />
    <div
      className={
        centered
          ? 'flex flex-col items-center gap-6 text-center'
          : 'flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between'
      }
    >
      <div className={classNames('flex gap-4', { 'flex-col items-center': centered })}>
        {Icon && (
          <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <Icon className="size-6" />
          </span>
        )}
        <div>
          {eyebrow && (
            <p className="text-xs font-semibold uppercase tracking-widest text-accent">{eyebrow}</p>
          )}
          <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
          {description && (
            <p className={classNames('mt-2 max-w-2xl text-muted-foreground', { 'mx-auto': centered })}>
              {description}
            </p>
          )}
        </div>
      </div>
      {actions && <div className="flex shrink-0 gap-2">{actions}</div>}
    </div>
    {children && <div className="mt-6">{children}</div>}
  </header>
);

export default PageHeader;
