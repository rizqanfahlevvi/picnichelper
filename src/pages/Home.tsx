import { Link } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Disclaimer } from '../components/Disclaimer';

export function Home() {
  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-bold">PICNIC Helper</h1>
        <p className="text-sm text-[var(--color-text-muted)]">
          Pediatric ER &amp; Intensive Care Companion
        </p>
      </header>
      <Link to="/kalkulator">
        <Card className="transition-colors hover:border-[var(--color-primary)]">
          <div className="text-base font-semibold text-[var(--color-primary)]">
            Kalkulator ETT
          </div>
          <p className="text-sm text-[var(--color-text-muted)]">
            Ukuran endotracheal tube berdasarkan usia/berat.
          </p>
        </Card>
      </Link>
      <Disclaimer />
    </div>
  );
}
