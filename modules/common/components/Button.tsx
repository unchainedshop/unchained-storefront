import classNames from 'classnames';
import { designTokens } from '../constants/designTokens';

interface ButtonProps {
  type?: 'button' | 'submit';
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'link';
  size?: 'small' | 'medium' | 'large';
  icon?: React.ReactNode;
  text?: string;
  children?: React.ReactNode;
  disabled?: boolean;
  className?: string;
  fullWidth?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  'aria-label'?: string;
}

const Button = ({
  type = 'button',
  variant = 'primary',
  size = 'medium',
  icon = null,
  text = '',
  children,
  disabled = false,
  className = '',
  fullWidth = true,
  onClick,
  'aria-label': ariaLabel,
  ...props
}: ButtonProps) => {
  const baseClasses = classNames(
    'inline-flex items-center justify-center rounded-md text-sm font-medium',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'transition-colors duration-200',
    'dark:focus:ring-offset-slate-900',
    {
      'w-full': fullWidth,
      'cursor-not-allowed opacity-50': disabled,
    },
  );

  const sizeClasses = {
    small: designTokens.spacing.button.paddingSmall,
    medium: designTokens.spacing.button.padding,
    large: designTokens.spacing.button.paddingLarge,
  };

  const variantClasses = {
    primary: classNames(
      designTokens.colors.primary.bg,
      designTokens.colors.primary.bgHover,
      designTokens.colors.primary.bgActive,
      designTokens.colors.primary.text,
      designTokens.colors.primary.border,
      designTokens.colors.primary.focusRing,
      'border',
    ),
    secondary: classNames(
      designTokens.colors.secondary.bg,
      designTokens.colors.secondary.bgHover,
      designTokens.colors.secondary.bgActive,
      designTokens.colors.secondary.text,
      designTokens.colors.secondary.border,
      designTokens.colors.secondary.borderHover,
      designTokens.colors.secondary.focusRing,
      designTokens.colors.secondary.darkBg,
      designTokens.colors.secondary.darkText,
      designTokens.colors.secondary.darkBorder,
      designTokens.colors.secondary.darkBgHover,
      designTokens.colors.secondary.darkBorderHover,
      designTokens.colors.secondary.darkBgActive,
      'border-2',
    ),
    success: classNames(
      designTokens.colors.success.bg,
      designTokens.colors.success.bgHover,
      designTokens.colors.success.bgActive,
      designTokens.colors.success.text,
      designTokens.colors.success.border,
      designTokens.colors.success.focusRing,
      'border',
    ),
    danger: classNames(
      designTokens.colors.danger.bg,
      designTokens.colors.danger.bgHover,
      designTokens.colors.danger.bgActive,
      designTokens.colors.danger.text,
      designTokens.colors.danger.border,
      designTokens.colors.danger.focusRing,
      'border',
    ),
    link: classNames(
      'bg-transparent text-blue-500 hover:text-blue-600',
      'dark:text-slate-400 dark:hover:text-white',
      'border-none p-0 focus:ring-0',
    ),
  };

  const content = children || (
    <>
      {icon && <span className={text ? 'mr-2' : ''}>{icon}</span>}
      {text}
    </>
  );

  return (
    <button
      className={classNames(
        baseClasses,
        sizeClasses[size],
        variantClasses[variant],
        className,
      )}
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      {...props}
    >
      {content}
    </button>
  );
};

export default Button;
