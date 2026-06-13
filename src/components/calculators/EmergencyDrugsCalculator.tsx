import { Disclaimer } from '../Disclaimer';
import { TheoryAccordion, type TheorySection } from '../TheoryAccordion';
import { usePatientStore } from '../../store/patientStore';
import { calculateDose, EMERGENCY_DRUGS, type CalculatedDose } from '../../utils/emergencyDrugs';

const EMERGENCY_THEORY: TheorySection[] = [
  {
    title: 'Prinsip Resusitasi PALS 2020',
    content: `Urutan prioritas resusitasi anak (AHA PALS 2020):
1. C–A–B: Kompresi → Airway → Breathing
2. Kompresi dada berkualitas tinggi: frekuensi 100–120/mnt, kedalaman 1/3 diameter AP dada
3. Rasio kompresi:ventilasi = 30:2 (1 penolong) atau 15:2 (2 penolong pediatrik)
4. Minimalisasi interupsi (< 10 detik)
5. Defibrilasi segera untuk VF/pVT: 2 J/kg → 4 J/kg → ≥ 4 J/kg (maks 10 J/kg)`,
  },
  {
    title: 'Epinefrin & Atropin',
    content: `Epinefrin (adrenalin) 1:10.000 IV/IO:
• Henti jantung: 0.01 mg/kg (0.1 mL/kg larutan 1:10.000), maks 1 mg
• Ulangi setiap 3–5 menit
• Bradikardi simptomatik: sama 0.01 mg/kg IV/IO

Atropin:
• Bradikardi vagal / blok AV: 0.02 mg/kg IV/IO
• Dosis minimum 0.1 mg (hindari paradoks bradikardia)
• Dosis maksimum 0.5 mg anak / 1 mg remaja`,
  },
  {
    title: 'Adenosin & Amiodarone',
    content: `Adenosin (SVT):
• Dosis pertama: 0.1 mg/kg IV push cepat, maks 6 mg
• Dosis kedua: 0.2 mg/kg IV push cepat, maks 12 mg
• Berikan di vena antekubiti / sentral, flush cepat

Amiodarone (VF/pVT atau SVT refrakter):
• Henti jantung: 5 mg/kg IV/IO bolus (maks 300 mg)
• Takikardia dengan nadi: 5 mg/kg IV dalam 20–60 menit (monitor hipotensi)`,
  },
];

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

      <TheoryAccordion sections={EMERGENCY_THEORY} />
      <Disclaimer />

      <div className="ios-card" style={{ padding: '12px 14px' }}>
        <p style={{ font: 'var(--type-caption-1)', color: 'var(--label-secondary)' }}>
          <span style={{ fontWeight: 700, color: 'var(--label-primary)' }}>[{REFERENCES.pals2020.id}]</span>{' '}
          {REFERENCES.pals2020.citation}
        </p>
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
