/*
 * Input — Apple HIG text field
 * Touch target: min 48px height (clinical ergonomics — thumb + stethoscope)
 * Rounded, generous padding, clear focus ring
 */
import * as React from 'react';
import { cn } from './cn';

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      ref={ref}
      className={cn(
        /* Layout — min 48px height */
        'flex w-full min-h-[48px] px-4 py-3 text-base',
        /* Shape */
        'rounded-xl',
        /* Surface */
        'bg-white border border-slate-200 text-slate-900',
        'placeholder:text-slate-400',
        /* Dark */
        'dark:bg-slate-800 dark:border-slate-700 dark:text-slate-50',
        'dark:placeholder:text-slate-500',
        /* Focus */
        'transition-colors focus:outline-none',
        'focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20',
        'dark:focus:border-blue-400 dark:focus:ring-blue-400/20',
        /* Disabled */
        'disabled:opacity-40 disabled:cursor-not-allowed',
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = 'Input';

export { Input };
