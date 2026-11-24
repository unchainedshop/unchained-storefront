import { useIntl } from 'react-intl';
import { CheckCircleIcon } from '@heroicons/react/20/solid';

const AuthLayout = ({ title, subtitle = null, footer = null, children }) => {
  const { formatMessage } = useIntl();
  const benefits = [
    formatMessage({ id: 'auth_benefit_orders', defaultMessage: 'Track orders and download invoices' }),
    formatMessage({ id: 'auth_benefit_checkout', defaultMessage: 'Check out faster with saved addresses' }),
    formatMessage({ id: 'auth_benefit_wishlist', defaultMessage: 'Keep your wishlist on every device' }),
  ];

  return (
    <div className="mx-auto grid max-w-5xl overflow-hidden rounded-2xl border border-border bg-surface shadow-card lg:grid-cols-2">
      <aside className="relative isolate hidden flex-col justify-between overflow-hidden bg-hero p-10 text-hero-foreground lg:flex">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 opacity-70 [background:radial-gradient(70%_60%_at_100%_0%,color-mix(in_oklch,var(--accent-soft)_40%,transparent),transparent),radial-gradient(60%_60%_at_0%_100%,color-mix(in_oklch,var(--hero)_60%,black),transparent)]"
        />
        <p className="font-display text-lg font-bold tracking-tight">
          {formatMessage({ id: 'shop_title', defaultMessage: 'Unchained Store' })}
        </p>
        <div>
          <p className="text-3xl font-bold leading-tight tracking-tight">
            {formatMessage({ id: 'auth_panel_title', defaultMessage: 'Your favourite products, one account away.' })}
          </p>
          <ul className="mt-8 space-y-3">
            {benefits.map((benefit) => (
              <li key={benefit} className="flex items-center gap-3 text-sm opacity-90">
                <CheckCircleIcon className="size-5 shrink-0" />
                {benefit}
              </li>
            ))}
          </ul>
        </div>
        <p className="text-xs opacity-70">
          {formatMessage({ id: 'auth_panel_secure', defaultMessage: 'Your data is transmitted securely.' })}
        </p>
      </aside>

      <div className="px-6 py-10 sm:px-12 sm:py-14">
        <div className="mx-auto w-full max-w-sm">
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          {subtitle && <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>}
          <div className="mt-8">{children}</div>
          {footer && (
            <p className="mt-8 border-t border-border pt-6 text-center text-sm text-muted-foreground">{footer}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
