import { PatientInput } from '../components/PatientInput';
import { EttCalculator } from '../components/calculators/EttCalculator';

export function Kalkulator() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Kalkulator</h1>
      <PatientInput />
      <EttCalculator />
    </div>
  );
}
