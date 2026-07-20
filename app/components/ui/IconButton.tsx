/* ============================================================
   ICON BUTTON COMPONENT
   Tombol bulat khusus untuk icon (capture, switch camera, dll).
   ============================================================ */

import type { ButtonHTMLAttributes, ReactNode } from 'react';

/* ----------------------------------------------------------
   Types
   ---------------------------------------------------------- */

type IconButtonSize = 'sm' | 'md' | 'lg';
type IconButtonVariant = 'primary' | 'secondary' | 'ghost';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  size?: IconButtonSize;
  variant?: IconButtonVariant;
  /** Label untuk accessibility (screen readers) */
  label: string;
}

/* ----------------------------------------------------------
   Style Maps
   ---------------------------------------------------------- */

const sizeStyles: Record<IconButtonSize, string> = {
  sm: 'w-9 h-9',
  md: 'w-11 h-11',
  lg: 'w-14 h-14',
};

const variantStyles: Record<IconButtonVariant, string> = {
  primary:
    'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)]',
  secondary:
    'bg-[var(--color-surface)] text-[var(--color-text)] border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]',
  ghost:
    'bg-transparent text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)] hover:text-[var(--color-text)]',
};

/* ----------------------------------------------------------
   Component
   ---------------------------------------------------------- */

export default function IconButton({
  icon,
  size = 'md',
  variant = 'secondary',
  label,
  className = '',
  disabled,
  ...props
}: IconButtonProps) {
  const baseStyles =
    'inline-flex items-center justify-center rounded-full transition-all duration-200 cursor-pointer select-none';
  const disabledStyles = 'opacity-50 cursor-not-allowed pointer-events-none';

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${
        disabled ? disabledStyles : ''
      } ${className}`}
      disabled={disabled}
      aria-label={label}
      title={label}
      {...props}
    >
      {icon}
    </button>
  );
}
