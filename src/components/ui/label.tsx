import * as React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import { cn } from './cn';

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(
      'text-sm font-medium leading-none',
      'text-slate-700 dark:text-slate-300',
      'peer-disabled:opacity-40 cursor-default',
      className,
    )}
    {...props}
  />
));
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
