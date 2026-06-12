import { PatientInput } from '../components/PatientInput';
import { FluidCalculator } from '../components/drugsfluid/FluidCalculator';

export function DrugsFluid() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Drugs & Fluids</h1>
      <PatientInput />
      <FluidCalculator />
    </div>
  );
}
