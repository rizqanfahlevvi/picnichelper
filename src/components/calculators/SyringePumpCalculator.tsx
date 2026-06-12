import { useState } from 'react';
import { Disclaimer } from '../Disclaimer';
import { usePatientStore } from '../../store/patientStore';
import {
  calculateSyringePumpRate,
  SYRINGE_PUMP_DRUGS,
  type DoseTimeUnit,
} from '../../utils/syringePump';

export function SyringePumpCalculator() {
  const { weightKg } = usePatientStore();
  const [dose, setDose] = useState('');
  const [timeUnit, setTimeUnit] = useState<DoseTimeUnit>('per_minute');
  const [concentration, setConcentration] = useState('');
  const [selectedDrug, setSelectedDrug] = useState('');

  const weightNum = Number(weightKg);
  const doseNum = Number(dose);
  const concNum = Number(concentration);

  const canCalculate =
    weightKg.trim() !== '' && Number.isFinite(weightNum) && weightNum > 0 &&
    dose.trim() !== '' && Number.isFinite(doseNum) && doseNum > 0 &&
    concentration.trim() !== '' && Number.isFinite(concNum) && concNum > 0;

  let result: ReturnType<typeof calculateSyringePumpRate> | null = null;
  let error: string | null = null;

  if (canCalculate) {
    try {
      result = calculateSyringePumpRate({
        dosePerKgPerTime: doseNum,
        timeUnit,
        weightKg: weightNum,
        concentrationMcgPerMl: concNum,
      });
    } catch (e) {
      error = e instanceof Error ? e.message : 'Error';
    }
  }

  function applyDrugPreset(name: string) {
    const drug = SYRINGE_PUMP_DRUGS.find((d) => d.name === name);
    if (!drug) return;
    setSelectedDrug(name);
    setTimeUnit(drug.unit);
    setDose(String(drug.minDose));
    if (drug.commonConcentrations.length > 0) {
      setConcentration(String(drug.commonConcentrations[0]));
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ padding: '0 20px 4px' }}>
        <h2 className="ios-title-3">Syringe Pump</h2>
        <p className="ios-footnote" style={{ marginTop: 2 }}>Kecepatan infus kontinu (mL/jam).</p>
      </div>

      {/* Drug presets */}
      <div style={{ padding: '0 16px', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {SYRINGE_PUMP_DRUGS.map((d) => (
          <button
            key={d.name}
            onClick={() => applyDrugPreset(d.name)}
            style={{
              padding: '6px 14px', borderRadius: 'var(--r-pill)', border: 'none', cursor: 'pointer',
              font: 'var(--type-footnote)', fontWeight: selectedDrug === d.name ? 600 : 400,
              background: selectedDrug === d.name ? 'var(--tint-drug)' : 'var(--fill-secondary)',
              color: selectedDrug === d.name ? '#fff' : 'var(--label-primary)',
              transition: 'all var(--dur-fast)',
            }}
          >
            {d.name}
          </button>
        ))}
      </div>

      {/* Inputs */}
      <div className="ios-card" style={{ padding: '2px 0' }}>
        <InputRow label="Berat pasien" unit="kg" value={weightKg} readOnly placeholder="dari input pasien" />
        <div style={{ height: '0.5px', background: 'var(--separator)' }} />
        <InputRow
          label="Konsentrasi" unit="mcg/mL"
          value={concentration} onChange={setConcentration}
          placeholder="mis. 1600" type="number"
        />
        <div style={{ height: '0.5px', background: 'var(--separator)' }} />

        {/* Dose + unit toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', minHeight: 'var(--hit)' }}>
          <span style={{ flex: 1, font: 'var(--type-subheadline)', color: 'var(--label-primary)' }}>Dosis</span>
          <input
            type="number" min="0" value={dose}
            onChange={(e) => setDose(e.target.value)}
            placeholder="mis. 5"
            style={{
              width: 70, textAlign: 'right', borderRadius: 'var(--r-sm)',
              border: 'none', outline: 'none',
              background: 'var(--fill-tertiary)', color: 'var(--label-primary)',
              font: 'var(--type-body)', padding: '4px 10px', minHeight: 36,
            }}
          />
          <div style={{
            display: 'flex', borderRadius: 'var(--r-sm)', overflow: 'hidden',
            border: '0.5px solid var(--separator)',
          }}>
            {(['per_minute', 'per_hour'] as DoseTimeUnit[]).map((u) => (
              <button
                key={u}
                onClick={() => setTimeUnit(u)}
                style={{
                  padding: '6px 10px', border: 'none', cursor: 'pointer',
                  font: 'var(--type-caption-1)', fontWeight: timeUnit === u ? 600 : 400,
                  background: timeUnit === u ? 'var(--accent)' : 'transparent',
                  color: timeUnit === u ? '#fff' : 'var(--label-secondary)',
                  transition: 'all var(--dur-fast)',
                }}
              >
                {u === 'per_minute' ? 'mcg/kg/mnt' : 'mcg/kg/jam'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="ios-warn ios-warn--danger">
          <span>{error}</span>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="ios-card tint-drug">
          <div style={{ padding: '16px 16px 12px' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 48, fontWeight: 700, color: 'var(--tint, var(--accent))', letterSpacing: '-0.02em' }}>
                {result.ratePerHour.toFixed(2)}
              </span>
              <span style={{ font: 'var(--type-title-3)', color: 'var(--label-secondary)' }}>mL/jam</span>
            </div>
            <p style={{ font: 'var(--type-subheadline)', color: 'var(--label-secondary)', marginTop: 4 }}>
              Dosis absolut:{' '}
              <span style={{ fontWeight: 600, color: 'var(--label-primary)' }}>
                {result.absoluteDosePerTime.toFixed(2)} mcg/{result.timeUnit === 'per_minute' ? 'mnt' : 'jam'}
              </span>
            </p>
            <p style={{ fontFamily: 'var(--font-mono)', font: 'var(--type-caption-1)', color: 'var(--label-tertiary)', marginTop: 6 }}>
              {doseNum} × {weightNum} {timeUnit === 'per_minute' ? '× 60' : ''} ÷ {concNum}
            </p>
          </div>
        </div>
      )}

      {/* Dose range hint */}
      {selectedDrug && <DoseRangeHint drugName={selectedDrug} />}

      <Disclaimer />
    </div>
  );
}

function InputRow({ label, unit, value, onChange, placeholder, type, readOnly }: {
  label: string; unit: string; value: string;
  onChange?: (v: string) => void;
  placeholder: string; type?: string; readOnly?: boolean;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', minHeight: 'var(--hit)' }}>
      <div style={{ flex: 1 }}>
        <span style={{ font: 'var(--type-subheadline)', color: 'var(--label-primary)' }}>{label}</span>
        <span style={{ font: 'var(--type-caption-1)', color: 'var(--label-tertiary)', marginLeft: 6 }}>({unit})</span>
      </div>
      <input
        type={type ?? 'text'} value={value} readOnly={readOnly} placeholder={placeholder}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        style={{
          width: 100, textAlign: 'right', borderRadius: 'var(--r-sm)',
          border: 'none', outline: 'none',
          background: readOnly ? 'transparent' : 'var(--fill-tertiary)',
          color: readOnly ? 'var(--label-secondary)' : 'var(--label-primary)',
          font: 'var(--type-body)', padding: '4px 10px', minHeight: 36,
        }}
      />
    </div>
  );
}

function DoseRangeHint({ drugName }: { drugName: string }) {
  const drug = SYRINGE_PUMP_DRUGS.find((d) => d.name === drugName);
  if (!drug) return null;
  return (
    <div className="ios-card" style={{ padding: '12px 14px' }}>
      <p style={{ font: 'var(--type-subheadline)', fontWeight: 600, color: 'var(--label-primary)', marginBottom: 6 }}>
        {drug.name} — rentang dosis referensi
      </p>
      <p style={{ font: 'var(--type-footnote)', color: 'var(--label-secondary)' }}>
        {drug.minDose}–{drug.maxDose} mcg/kg/{drug.unit === 'per_minute' ? 'mnt' : 'jam'}
      </p>
      <p style={{ font: 'var(--type-footnote)', color: 'var(--label-secondary)', marginTop: 2 }}>
        Konsentrasi umum: {drug.commonConcentrations.join(', ')} mcg/mL
      </p>
    </div>
  );
}
