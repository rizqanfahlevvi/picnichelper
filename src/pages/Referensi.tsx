import { Card } from '../components/ui/Card';
import { REFERENCES } from '../data/references';

export function Referensi() {
  const refs = Object.values(REFERENCES).sort((a, b) => a.id - b.id);
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Referensi</h1>
      <Card>
        <ol className="space-y-3 text-sm text-[var(--color-text-muted)]">
          {refs.map((r) => (
            <li key={r.id} id={`ref-${r.id}`}>
              <span className="font-semibold text-[var(--color-text)]">[{r.id}]</span>{' '}
              {r.citation}
              {!r.verified && (
                <span className="text-[var(--color-warn)]"> · perlu konfirmasi sumber</span>
              )}
              {r.url && (
                <>
                  {' '}
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--color-primary)] hover:underline"
                  >
                    tautan
                  </a>
                </>
              )}
            </li>
          ))}
        </ol>
      </Card>
    </div>
  );
}
