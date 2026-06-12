import { Card, CardContent } from '../components/ui/card';

export function Placeholder({ title }: { title: string }) {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{title}</h1>
      <Card>
        <CardContent className="pt-4">
          <p className="text-sm text-muted-foreground">
            Modul ini belum tersedia pada MVP Fase 1. Akan dikerjakan pada sesi berikutnya.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
