/*
 * Card — M3 "Filled Card" + "Outlined Card" variants
 *
 * Light mode : surface-lowest (#FFFFFF) + elevation-1 shadow + border outline-variant
 * Dark mode  : surface-low  (#1A1A21) + NO shadow + border outline-variant
 *
 * Elevasi visual di dark mode datang HANYA dari perbedaan warna latar.
 * Komponen induk (background) menggunakan surface-dim (#0F0F16).
 */
import * as React from 'react';
import { cn } from './cn';

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        /* Shape */
        'rounded-2xl',
        /* Surface — light: putih; dark: surface-container-low (tonal elevation 1) */
        'bg-surface-lowest dark:bg-surface-low',
        /* Border */
        'border border-border',
        /* Elevasi light: shadow; dark: otomatis none via CSS */
        'elevation-1',
        /* Typography */
        'text-card-foreground',
        className,
      )}
      {...props}
    />
  ),
);
Card.displayName = 'Card';

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col gap-1.5 p-5', className)} {...props} />
  ),
);
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('text-base font-semibold leading-snug tracking-tight', className)}
      {...props}
    />
  ),
);
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('text-sm text-muted-foreground', className)} {...props} />
  ),
);
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('px-5 pb-5', className)} {...props} />
  ),
);
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center px-5 pb-5', className)} {...props} />
  ),
);
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
