const AuthLayout = ({ title, subtitle = null, footer = null, children }) => (
  <div className="mx-auto w-full max-w-md py-6 sm:py-12">
    <div className="text-center">
      <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
      {subtitle && <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>}
    </div>
    <div className="card mt-8 p-6 sm:p-8">{children}</div>
    {footer && (
      <p className="mt-6 text-center text-sm text-muted-foreground">{footer}</p>
    )}
  </div>
);

export default AuthLayout;
