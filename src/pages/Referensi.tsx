import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { REFERENCES } from '../data/references';

export function Referensi() {
  const refs = Object.values(REFERENCES).sort((a, b) => a.id - b.id);
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Referensi</h1>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Daftar Pustaka</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-3 text-sm text-muted-foreground">
            {refs.map((r) => (
              <li key={r.id} id={`ref-${r.id}`} className="flex gap-2">
                <span className="font-semibold text-foreground shrink-0">[{r.id}]</span>
                <div>
                  {r.citation}
                  {!r.verified && (
                    <Badge variant="warning" className="ml-2 text-[10px]">perlu konfirmasi</Badge>
                  )}
                  {r.url && (
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-1 text-primary hover:underline"
                    >
                      ↗
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
