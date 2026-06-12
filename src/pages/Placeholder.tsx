import { Card } from '../components/ui/Card';

/** Halaman rute yang belum diisi pada MVP Fase 1. */
export function Placeholder({ title }: { title: string }) {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{title}</h1>
      <Card>
        <p className="text-sm text-[var(--color-text-muted)]">
          Modul ini belum tersedia pada MVP Fase 1. Akan dikerjakan pada sesi berikutnya.
        </p>
      </Card>
    </div>
  );
}
