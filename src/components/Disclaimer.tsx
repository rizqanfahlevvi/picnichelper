import { Badge } from './ui/badge';

/** Disclaimer klinis — terlihat namun tidak mengganggu (CLAUDE.md). */
export function Disclaimer() {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2">
      <Badge variant="outline" className="shrink-0 text-[10px]">ℹ</Badge>
      <p className="text-xs text-slate-500 dark:text-slate-400">
        Untuk panduan klinis · bukan pengganti penilaian klinis profesional.
      </p>
    </div>
  );
}
