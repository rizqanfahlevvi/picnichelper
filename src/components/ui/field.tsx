/*
 * Field — M3 "Filled Text Field" dengan label mengambang
 * Menggunakan Input (filled style) + Label di atasnya.
 */
import type { InputHTMLAttributes } from 'react';
import { Input } from './input';
import { Label } from './label';
import { cn } from './cn';

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  unit?: string;
  hint?: { tone: 'warn' | 'danger'; text: string };
}

export function Field({ label, unit, hint, className, id, ...rest }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label
        htmlFor={id}
        className={cn(
          'text-xs font-medium',
          hint?.tone === 'danger' ? 'text-destructive' : 'text-muted-foreground',
        )}
      >
        {label}
      </Label>
      <div className="flex items-stretch gap-2">
        <Input
          id={id}
          inputMode="decimal"
          className={cn(
            hint?.tone === 'danger' && 'border-destructive',
            hint?.tone === 'warn'   && 'border-warning',
            className,
          )}
          {...rest}
        />
        {unit && (
          <span className="flex h-14 items-center rounded-t-md rounded-b-none border-b-2 border-outline bg-surface-container px-3 text-sm text-muted-foreground">
            {unit}
          </span>
        )}
      </div>
      {hint && (
        <p className={cn(
          'text-xs',
          hint.tone === 'danger' ? 'text-destructive' : 'text-[hsl(var(--warning))]',
        )}>
          {hint.text}
        </p>
      )}
    </div>
  );
}
