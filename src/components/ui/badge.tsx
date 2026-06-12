import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './cn';

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default:
          'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
        outline:
          'border border-slate-200 text-slate-600 dark:border-slate-700 dark:text-slate-400',
        secondary:
          'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
        destructive:
          'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300',
        warning:
          'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
        success:
          'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300',
      },
    },
    defaultVariants: { variant: 'default' },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
