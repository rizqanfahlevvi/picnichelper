import { AlertTriangle } from 'lucide-react';
import { Cite } from '../Citation';
import { Disclaimer } from '../Disclaimer';
import { usePatientStore } from '../../store/patientStore';
import { ettDepthByAge, ettDepthByTubeId, ettDepthByWeight, ETT_DEPTH_AGE_MIN_YEARS } from '../../utils/ettDepth';
import { REFERENCES } from '../../data/references';

export function EttDepthCalculator() {
  const { category, ageYears, weightKg } = usePatientStore();

  const ageNum = Number(ageYears);
  const weightNum = Number(weightKg);

  const byAge = ageYears.trim() && Number.isFinite(ageNum) && ageNum >= ETT_DEPTH_AGE_MIN_YEARS
    ? ettDepthByAge(ageNum) : null;
  const byWeight = weightKg.trim() && Number.isFinite(weightNum) && weightNum > 0 && category === 'neonatus'
    ? ettDepthByWeight(weightNum) : null;

  const noInput = !ageYears.trim() && !weightKg.trim();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ padding: '0 20px 4px' }}>
        <h2 className="ios-title-3">Kedalaman Insersi ETT</h2>
        <p className="ios-footnote" style={{ marginTop: 2 }}>Jarak bibir ke ujung tube (cm).</p>
      </div>

      {noInput && (
        <div className="ios-card" style={{ padding: '14px 16px' }}>
          <p className="ios-footnote">Masukkan usia atau berat pasien untuk menghitung.</p>
        </div>
      )}

      {(byAge || byWeight) && (
        <div className="ios-card">
          {byAge && (
            <DepthTile
              label="Formula usia (bibir)"
              formula="usia/2 + 12"
              cite="pals2020"
              value={byAge}
              note={`${ageNum} tahun`}
            />
          )}
          {byAge && byWeight && <div style={{ height: '0.5px', background: 'var(--separator)' }} />}
          {byWeight && (
            <DepthTile
              label="Formula berat (neonatus)"
              formula="berat(kg) + 6"
              cite="nrp8"
              value={byWeight}
              note={`${weightNum} kg`}
            />
          )}
        </div>
      )}

      {ageYears.trim() && Number.isFinite(ageNum) && ageNum < ETT_DEPTH_AGE_MIN_YEARS && category === 'anak' && (
        <div className="ios-warn">
          <AlertTriangle size={15} />
          <span>
            Formula usia/2+12 berlaku mulai ≥{ETT_DEPTH_AGE_MIN_YEARS} tahun.
            Gunakan kategori Neonatus dan masukkan berat badan.
          </span>
        </div>
      )}

      <TubeIdSection />
      <Disclaimer />
      <ReferenceFootnotes />
    </div>
  );
}

function TubeIdSection() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div className="ios-section" style={{ paddingTop: 8 }}>
        <span className="label">Formula ID Tube</span>
      </div>
      <div className="ios-card" style={{ padding: '12px 14px' }}>
        <p className="ios-footnote" style={{ marginBottom: 10 }}>
          Kedalaman (cm) = ID tube (mm) × 3{' '}<Cite source="pals2020" />
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
          {[3.0, 3.5, 4.0, 4.5, 5.0, 5.5].map((id) => (
            <div
              key={id}
              style={{
                background: 'var(--fill-tertiary)', borderRadius: 10,
                padding: '8px 6px', textAlign: 'center',
              }}
            >
              <div style={{ font: 'var(--type-caption-2)', color: 'var(--label-secondary)', marginBottom: 3 }}>
                ID {id} mm
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 20, fontWeight: 700, color: 'var(--tint-resp)' }}>
                {ettDepthByTubeId(id)}
                <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--label-secondary)', marginLeft: 2 }}>cm</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DepthTile({
  label, formula, cite, value, note,
}: {
  label: string;
  formula: string;
  cite: keyof typeof REFERENCES;
  value: number;
  note: string;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', minHeight: 'var(--hit)' }}>
      <div>
        <div style={{ font: 'var(--type-subheadline)', color: 'var(--label-secondary)', display: 'flex', alignItems: 'center', gap: 2 }}>
          {label} <Cite source={cite} />
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', font: 'var(--type-caption-1)', color: 'var(--label-tertiary)', marginTop: 2 }}>
          {formula} · {note}
        </div>
      </div>
      <div>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 36, fontWeight: 700, color: 'var(--tint-resp)' }}>
          {value}
        </span>
        <span style={{ font: 'var(--type-body)', color: 'var(--label-secondary)', marginLeft: 4 }}>cm</span>
      </div>
    </div>
  );
}

function ReferenceFootnotes() {
  const used = ['pals2020', 'nrp8'] as const;
  return (
    <div className="ios-card" style={{ padding: '12px 14px' }}>
      <p style={{ font: 'var(--type-caption-2)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--label-secondary)', marginBottom: 8 }}>Referensi</p>
      <ol style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {used.map((key) => (
          <li key={key} style={{ font: 'var(--type-caption-1)', color: 'var(--label-secondary)' }}>
            <span style={{ fontWeight: 700, color: 'var(--label-primary)' }}>[{REFERENCES[key].id}]</span>{' '}
            {REFERENCES[key].citation}
          </li>
        ))}
      </ol>
    </div>
  );
}
