import classNames from 'classnames';

interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  type?: 'button' | 'submit';
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'ghost' | 'link';
  size?: 'small' | 'medium' | 'large';
  icon?: React.ReactNode;
  text?: string;
  fullWidth?: boolean;
}

const variantClasses = {
  primary: 'btn btn-primary',
  secondary: 'btn btn-secondary',
  success: 'btn btn-success',
  danger: 'btn btn-danger',
  ghost: 'btn btn-ghost',
  link: 'link inline-flex items-center gap-2 text-sm',
};

const sizeClasses = {
  small: 'btn-sm',
  medium: '',
  large: 'btn-lg',
};

const Button = ({
  type = 'button',
  variant = 'primary',
  size = 'medium',
  icon = null,
  text = '',
  children,
  className = '',
  fullWidth = true,
  ...props
}: ButtonProps) => (
  <button
    type={type}
    className={classNames(
      variantClasses[variant],
      variant !== 'link' && sizeClasses[size],
      { 'w-full': fullWidth },
      className,
    )}
    {...props}
  >
    {children || (
      <>
        {icon}
        {text}
      </>
    )}
  </button>
);

export default Button;
