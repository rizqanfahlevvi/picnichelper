import type { InputHTMLAttributes } from 'react';
import { cn } from './cn';

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  unit?: string;
  /** Pesan validasi; warna kuning = peringatan, merah = blokir */
  hint?: { tone: 'warn' | 'danger'; text: string };
}

/** Input numerik dengan label, satuan, dan target sentuh ≥ 44px. */
export function Field({ label, unit, hint, className, id, ...rest }: FieldProps) {
  return (
    <label htmlFor={id} className="block">
      <span className="mb-1 block text-sm font-medium text-[var(--color-text-muted)]">
        {label}
      </span>
      <div className="flex items-stretch gap-2">
        <input
          id={id}
          inputMode="decimal"
          className={cn(
            'min-h-[44px] flex-1 rounded-xl border bg-[var(--color-surface-2)] px-3 text-lg text-[var(--color-text)]',
            'outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/40',
            hint?.tone === 'danger'
              ? 'border-[var(--color-danger)]'
              : hint?.tone === 'warn'
                ? 'border-[var(--color-warn)]'
                : 'border-[var(--color-border)]',
            className,
          )}
          {...rest}
        />
        {unit && (
          <span className="flex min-h-[44px] items-center rounded-xl bg-[var(--color-surface-2)] px-3 text-sm text-[var(--color-text-muted)]">
            {unit}
          </span>
        )}
      </div>
      {hint && (
        <span
          className={cn(
            'mt-1 block text-sm',
            hint.tone === 'danger' ? 'text-[var(--color-danger)]' : 'text-[var(--color-warn)]',
          )}
        >
          {hint.text}
        </span>
      )}
    </label>
  );
}
