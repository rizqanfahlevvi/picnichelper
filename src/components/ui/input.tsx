/*
 * Input — M3 "Filled Text Field" style
 * - Background: surface-container (level 2 elevation)
 * - Rounded top corners, flat bottom dengan underline
 * - Focus: underline tebal berwarna primary
 * - Minimum height 44pt (Apple HIG) / 56dp (M3 spec)
 */
import * as React from 'react';
import { cn } from './cn';

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      ref={ref}
      className={cn(
        /* Layout */
        'flex h-14 w-full px-4 py-2 text-base',
        /* M3 Filled Field shape — rounded top, flat bottom */
        'rounded-t-md rounded-b-none',
        /* Surface & border */
        'bg-surface-container border-0 border-b-2 border-outline',
        'text-foreground placeholder:text-muted-foreground',
        /* Transitions */
        'transition-colors',
        /* Focus — underline jadi primary */
        'focus:border-primary focus:outline-none',
        /* Disabled */
        'disabled:opacity-38 disabled:cursor-not-allowed',
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = 'Input';

export { Input };
