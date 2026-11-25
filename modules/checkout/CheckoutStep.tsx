import classNames from 'classnames';
import { CheckIcon } from '@heroicons/react/20/solid';

const CheckoutStep = ({ number, done = false, title = null, children }) => (
  <section className="card flex gap-4 p-5 sm:p-6">
    <span
      className={classNames(
        'flex size-7 shrink-0 items-center justify-center rounded-full text-sm font-semibold',
        done ? 'bg-success text-white' : 'bg-primary text-primary-foreground',
      )}
    >
      {done ? <CheckIcon className="size-4" /> : number}
    </span>
    <div className="min-w-0 flex-1">
      {title && <h2 className="mb-4 text-lg font-semibold">{title}</h2>}
      {children}
    </div>
  </section>
);

export default CheckoutStep;
