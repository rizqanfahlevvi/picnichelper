/*
 * Badge / Chip — M3 "Assist Chip" & "Suggestion Chip" style
 * Shape: rounded-full (M3 chip spec)
 */
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './cn';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        /* M3 "Suggestion Chip" — tonal primary */
        default:     'border-transparent bg-primary-container text-[hsl(var(--on-primary-container))]',
        /* Outlined chip */
        outline:     'border-border bg-transparent text-foreground',
        /* Surface chip */
        secondary:   'border-transparent bg-surface-container text-muted-foreground',
        destructive: 'border-transparent bg-destructive/20 text-destructive',
        warning:     'border-transparent bg-[hsl(var(--warning)/0.2)] text-[hsl(var(--warning))]',
        success:     'border-transparent bg-[hsl(var(--success)/0.2)] text-[hsl(var(--success))]',
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
