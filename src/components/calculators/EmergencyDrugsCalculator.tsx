import { Disclaimer } from '../Disclaimer';
import { usePatientStore } from '../../store/patientStore';
import { calculateDose, EMERGENCY_DRUGS, type CalculatedDose } from '../../utils/emergencyDrugs';
import { REFERENCES } from '../../data/references';
import { Cite } from '../Citation';

export function EmergencyDrugsCalculator() {
  const { weightKg } = usePatientStore();
  const weightNum = Number(weightKg);
  const valid = weightKg.trim() !== '' && Number.isFinite(weightNum) && weightNum > 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ padding: '0 20px 4px' }}>
        <h2 className="ios-title-3">Dosis Obat Emergensi</h2>
        <p className="ios-footnote" style={{ marginTop: 2 }}>
          PALS 2020 <Cite source="pals2020" /> · Berdasarkan berat pasien.
        </p>
      </div>

      {!valid ? (
        <div className="ios-card" style={{ padding: '14px 16px' }}>
          <p className="ios-footnote">Masukkan berat badan pasien untuk menghitung dosis.</p>
        </div>
      ) : (
        <div className="ios-list">
          {EMERGENCY_DRUGS.map((drug, i) => {
            const result = calculateDose(drug, weightNum);
            return <DrugRow key={drug.id} result={result} first={i === 0} />;
          })}
        </div>
      )}

      <Disclaimer />

      <div className="ios-card" style={{ padding: '12px 14px' }}>
        <p style={{ font: 'var(--type-caption-2)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--label-secondary)', marginBottom: 8 }}>Referensi</p>
        <ol style={{ display: 'flex', flexDirection: 'column', gap: 6, paddingLeft: 0, listStyle: 'none', margin: 0 }}>
          {(['pals2020'] as const).map((key) => (
            <li key={key} style={{ font: 'var(--type-caption-1)', color: 'var(--label-secondary)' }}>
              <span style={{ fontWeight: 700, color: 'var(--label-primary)' }}>[{REFERENCES[key].id}]</span>{' '}
              {REFERENCES[key].citation}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

function DrugRow({ result, first }: { result: CalculatedDose; first: boolean }) {
  const { drug, rawDose, clampedDose, unit, isClamped, clampReason } = result;

  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 12,
      padding: '10px 14px', minHeight: 'var(--hit)',
      background: 'var(--bg-tertiary)',
      borderTop: first ? 'none' : '0.5px solid var(--separator)',
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
          <span style={{ font: 'var(--type-body)', fontWeight: 600, color: 'var(--label-primary)' }}>
            {drug.name}
          </span>
          <span style={{ flexShrink: 0 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 700, color: 'var(--tint-drug)' }}>
              {clampedDose.toFixed(2).replace(/\.?0+$/, '')}
            </span>
            <span style={{ font: 'var(--type-footnote)', color: 'var(--label-secondary)', marginLeft: 4 }}>{unit}</span>
          </span>
        </div>

        <div style={{ marginTop: 2, display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
          <span style={{ font: 'var(--type-footnote)', color: 'var(--label-secondary)' }}>
            {drug.indication} · {drug.dosePerKg}{drug.dosePerKgMax ? `–${drug.dosePerKgMax}` : ''} {unit}/kg · {drug.route}
          </span>
          {isClamped && (
            <span style={{
              font: 'var(--type-caption-2)', fontWeight: 600,
              color: 'var(--warning)',
              background: 'color-mix(in srgb, var(--warning) 12%, transparent)',
              padding: '2px 7px', borderRadius: 'var(--r-pill)',
            }}>
              {clampReason === 'max' ? `max ${drug.maxDose}` : `min ${drug.minDose}`} {unit}
              {' '}(raw {rawDose.toFixed(2).replace(/\.?0+$/, '')})
            </span>
          )}
        </div>

        {drug.notes && (
          <p style={{ font: 'var(--type-caption-1)', color: 'var(--label-secondary)', marginTop: 4 }}>
            {drug.notes}
          </p>
        )}
      </div>
    </div>
  );
}
