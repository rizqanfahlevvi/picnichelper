import { Link } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Disclaimer } from '../components/Disclaimer';

export function Home() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">PICNIC Helper</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Pediatric ER &amp; Intensive Care Companion</p>
      </div>

      <Link to="/kalkulator" className="block">
        <Card className="transition-colors hover:border-primary cursor-pointer">
          <CardContent className="pt-4 flex items-center justify-between">
            <div>
              <div className="font-semibold text-primary">Kalkulator ETT</div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Ukuran endotracheal tube berdasarkan usia / berat.
              </p>
            </div>
            <Badge variant="secondary">MVP</Badge>
          </CardContent>
        </Card>
      </Link>

      <Disclaimer />
    </div>
  );
}
