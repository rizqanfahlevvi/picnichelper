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
          'text-sm font-medium',
          hint?.tone === 'danger'
            ? 'text-red-600 dark:text-red-400'
            : 'text-slate-700 dark:text-slate-300',
        )}
      >
        {label}
      </Label>
      <div className="flex items-stretch gap-2">
        <Input
          id={id}
          inputMode="decimal"
          className={cn(
            hint?.tone === 'danger' && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
            hint?.tone === 'warn'   && 'border-amber-500 focus:border-amber-500 focus:ring-amber-500/20',
            className,
          )}
          {...rest}
        />
        {unit && (
          /* Unit tag — same height as Input (min 48px), rounded to match */
          <span className={cn(
            'flex min-h-[48px] items-center rounded-xl border px-3 text-sm font-medium',
            'bg-slate-50 border-slate-200 text-slate-500',
            'dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400',
          )}>
            {unit}
          </span>
        )}
      </div>
      {hint && (
        <p className={cn(
          'text-xs',
          hint.tone === 'danger'
            ? 'text-red-600 dark:text-red-400'
            : 'text-amber-700 dark:text-amber-300',
        )}>
          {hint.text}
        </p>
      )}
    </div>
  );
}
