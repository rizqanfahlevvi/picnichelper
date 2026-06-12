/*
 * Sheet — Apple HIG Modal Sheet
 * White / slate-900 surface, subtle border, no heavy shadow
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
      'fixed inset-0 z-50 bg-black/30 backdrop-blur-sm',
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
        'bg-white dark:bg-slate-900',
        'border-slate-200 dark:border-slate-800',
        'data-[state=open]:animate-in data-[state=closed]:animate-out',
        side === 'bottom' && [
          'inset-x-0 bottom-0',
          'rounded-t-2xl border-t',
          'data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom',
        ],
        side === 'left'  && [
          'inset-y-0 left-0 h-full w-72 border-r',
          'data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left',
        ],
        side === 'right' && [
          'inset-y-0 right-0 h-full w-72 border-l',
          'data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right',
        ],
        className,
      )}
      {...props}
    >
      {/* drag handle */}
      {side === 'bottom' && (
        <div className="mx-auto mt-3 mb-1 h-1 w-10 rounded-full bg-slate-200 dark:bg-slate-700" />
      )}
      {children}
    </DialogPrimitive.Content>
  </SheetPortal>
));
SheetContent.displayName = 'SheetContent';

const SheetHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('px-5 pb-2 pt-3', className)} {...props} />
);

const SheetTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      'text-base font-semibold',
      'text-slate-900 dark:text-slate-50',
      className,
    )}
    {...props}
  />
));
SheetTitle.displayName = 'SheetTitle';

export { Sheet, SheetTrigger, SheetClose, SheetContent, SheetHeader, SheetTitle };
