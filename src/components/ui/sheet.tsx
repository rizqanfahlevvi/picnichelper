/*
 * Sheet — M3 "Bottom Sheet" / "Side Sheet"
 * Bottom sheet: rounded-xl top corners (28dp — M3 extra-large shape)
 * Background: surface-container-highest (level 4 — paling tinggi)
 * Light: + elevation-3 shadow. Dark: tonal surface saja, no shadow.
 */
import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { cn } from './cn';

const Sheet        = DialogPrimitive.Root;
const SheetTrigger = DialogPrimitive.Trigger;
const SheetClose   = DialogPrimitive.Close;
const SheetPortal  = DialogPrimitive.Portal;

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'fixed inset-0 z-50 bg-black/40 backdrop-blur-sm',
      'data-[state=open]:animate-in  data-[state=open]:fade-in-0',
      'data-[state=closed]:animate-out data-[state=closed]:fade-out-0',
      className,
    )}
    {...props}
  />
));
SheetOverlay.displayName = 'SheetOverlay';

const SheetContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
    side?: 'bottom' | 'left' | 'right' | 'top';
  }
>(({ side = 'bottom', className, children, ...props }, ref) => (
  <SheetPortal>
    <SheetOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        'fixed z-50',
        /* Surface — highest tonal level */
        'bg-surface-highest dark:bg-surface-highest',
        /* Elevasi — light: shadow; dark: tonal sudah cukup */
        'elevation-3 dark:shadow-none',
        /* Animation */
        'data-[state=open]:animate-in data-[state=closed]:animate-out',
        side === 'bottom' && [
          'inset-x-0 bottom-0',
          /* M3 bottom sheet: extra-large rounded top corners */
          'rounded-t-[1.75rem]',
          'data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom',
        ],
        side === 'left' && [
          'inset-y-0 left-0 h-full w-72',
          'data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left',
        ],
        side === 'right' && [
          'inset-y-0 right-0 h-full w-72',
          'data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right',
        ],
        className,
      )}
      {...props}
    >
      {/* M3 drag handle */}
      {side === 'bottom' && (
        <div className="mx-auto mt-3 mb-1 h-1 w-10 rounded-full bg-outline/40" />
      )}
      {children}
    </DialogPrimitive.Content>
  </SheetPortal>
));
SheetContent.displayName = 'SheetContent';

const SheetHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('px-5 pb-2 pt-4', className)} {...props} />
);

const SheetTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn('text-base font-semibold text-foreground', className)}
    {...props}
  />
));
SheetTitle.displayName = 'SheetTitle';

export { Sheet, SheetTrigger, SheetClose, SheetContent, SheetHeader, SheetTitle };
