/*
 * Button — M3 button variants
 * filled       → primary bg (default CTA)
 * tonal        → primary-container bg (secondary CTA, M3 "filled tonal")
 * outlined     → transparent bg + border (tertiary)
 * ghost        → transparent (icon button, list item)
 * destructive  → error bg
 */
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './cn';

const buttonVariants = cva(
  [
    /* Base */
    'inline-flex items-center justify-center gap-2 whitespace-nowrap',
    'font-medium transition-colors select-none',
    /* Shape — M3 "full" untuk button (pill) */
    'rounded-full',
    /* Focus ring */
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    /* Disabled */
    'disabled:pointer-events-none disabled:opacity-38',
  ].join(' '),
  {
    variants: {
      variant: {
        /* M3 Filled Button */
        filled:
          'bg-primary text-primary-foreground hover:opacity-90 active:opacity-80 elevation-1 dark:shadow-none',
        /* M3 Filled Tonal Button */
        tonal:
          'bg-primary-container text-[hsl(var(--on-primary-container))] hover:opacity-90 active:opacity-80',
        /* M3 Outlined Button */
        outlined:
          'border border-border bg-transparent text-primary hover:bg-primary/8 active:bg-primary/12',
        /* M3 Text Button */
        ghost:
          'bg-transparent text-primary hover:bg-primary/8 active:bg-primary/12',
        /* Destructive */
        destructive:
          'bg-destructive text-white hover:opacity-90 active:opacity-80',
        /* Secondary action */
        secondary:
          'bg-surface-container text-foreground hover:bg-surface-high active:bg-surface-high',
      },
      size: {
        default: 'h-11 px-6 text-sm',
        sm:      'h-9  px-4 text-xs',
        lg:      'h-12 px-8 text-base',
        icon:    'h-11 w-11',
        'icon-sm': 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'filled',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
