import clsx from 'clsx';
import * as React from 'react';
import { Spinner } from './Spinner';

const variants = {
  primaryContained: 'bg-blue-600 text-white shadow-sm',
  inverseContained: 'bg-white text-blue-600 shadow-sm',
  dangerContained: 'bg-red-600 text-white shadow-sm',
  primaryText: 'text-blue-600 border-none',
  dangerText: 'text-red-600 border-none',
};

const sizes = {
  sm: 'py-2 px-4 text-sm',
  md: 'py-2 px-6 text-md',
  lg: 'py-3 px-8 text-lg',
};

type IconProps =
  | { startIcon: React.ReactElement; endIcon?: never }
  | { endIcon: React.ReactElement; startIcon?: never }
  | { endIcon?: undefined; startIcon?: undefined };

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  isLoading?: boolean;
} & IconProps;

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      type = 'button',
      className = '',
      variant = 'primaryContained',
      size = 'md',
      isLoading = false,
      startIcon,
      endIcon,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        className={clsx(
          'flex justify-center items-center border border-gray-300 disabled:opacity-70 disabled:cursor-not-allowed rounded-md font-medium hover:opacity-80',
          variants[variant],
          sizes[size],
          className,
        )}
        {...props}
      >
        {isLoading && <Spinner size="sm" className="text-current" />}
        {!isLoading && startIcon}
        <span className="mx-2">{props.children}</span> {!isLoading && endIcon}
      </button>
    );
  },
);

Button.displayName = 'Button';
