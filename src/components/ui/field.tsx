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
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <div className="flex items-stretch gap-2">
        <Input
          id={id}
          inputMode="decimal"
          className={cn(
            hint?.tone === 'danger' && 'border-destructive focus-visible:ring-destructive',
            hint?.tone === 'warn' && 'border-yellow-500 focus-visible:ring-yellow-500',
            className,
          )}
          {...rest}
        />
        {unit && (
          <span className="flex h-11 items-center rounded-md border border-input bg-secondary px-3 text-sm text-muted-foreground">
            {unit}
          </span>
        )}
      </div>
      {hint && (
        <p className={cn('text-sm', hint.tone === 'danger' ? 'text-destructive' : 'text-yellow-500')}>
          {hint.text}
        </p>
      )}
    </div>
  );
}
