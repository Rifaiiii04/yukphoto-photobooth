/* ============================================================
   BUTTON COMPONENT
   Reusable button dengan beberapa variant.
   Menggunakan warna solid (tanpa gradient).
   ============================================================ */

import type { ButtonHTMLAttributes, ReactNode } from 'react';

/* ----------------------------------------------------------
   Types
   ---------------------------------------------------------- */

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Icon yang ditampilkan di sebelah kiri teks */
  icon?: ReactNode;
  /** Tampilkan loading state */
  loading?: boolean;
  /** Full width button */
  fullWidth?: boolean;
  children: ReactNode;
}

/* ----------------------------------------------------------
   Style Maps
   ---------------------------------------------------------- */

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] active:bg-[var(--color-primary-hover)]',
  secondary:
    'bg-transparent text-[var(--color-text)] border-2 border-[var(--color-border)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]',
  danger:
    'bg-[var(--color-danger)] text-white hover:bg-[var(--color-danger-hover)]',
  ghost:
    'bg-transparent text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)]',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm gap-1.5',
  md: 'px-6 py-3 text-base gap-2',
  lg: 'px-8 py-4 text-lg gap-2.5',
};

/* ----------------------------------------------------------
   Component
   ---------------------------------------------------------- */

export default function Button({
  variant = 'primary',
  size = 'md',
  icon,
  loading = false,
  fullWidth = false,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-full transition-all duration-200 cursor-pointer select-none';
  const disabledStyles = 'opacity-50 cursor-not-allowed pointer-events-none';
  const widthStyles = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyles} ${
        disabled || loading ? disabledStyles : ''
      } ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <svg
          className="animate-spin h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      ) : icon ? (
        <span className="flex-shrink-0">{icon}</span>
      ) : null}
      {children}
    </button>
  );
}
