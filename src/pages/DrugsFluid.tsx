import { PatientInput } from '../components/PatientInput';
import { FluidCalculator } from '../components/drugsfluid/FluidCalculator';

export function DrugsFluid() {
  return (
    <div className="ios-screen pb-6">
      <div style={{ padding: '24px 20px 8px' }}>
        <h1 className="ios-large-title">Drugs & Fluids</h1>
      </div>
      <PatientInput />
      <div style={{ marginTop: 16 }}>
        <FluidCalculator />
      </div>
    </div>
  );
}
