import { usePatientStore } from '../../store/patientStore';
import {
  whoWFA, whoLHFA, whoWFLH, whoBMIFA,
  cdcWFA, cdcHFA,
  calcBBI, calcHA, calcWA,
  interpretZScore,
  type ZInterpretation,
} from '../../utils/nutritionStatus';

export function NutritionStatus() {
  const { weightKg, heightCm, ageMonths, gender, agePrecise, nama } = usePatientStore();

  const wKg = parseFloat(weightKg);
  const hCm = parseFloat(heightCm);
  const ageM = parseFloat(ageMonths);
  const sex = gender as 'L' | 'P';

  const hasWeight = !isNaN(wKg) && wKg > 0;
  const hasHeight = !isNaN(hCm) && hCm > 0;
  const hasAge = !isNaN(ageM) && ageM >= 0;
  const hasSex = sex === 'L' || sex === 'P';

  if (!hasAge || !hasSex) {
    return (
      <div style={{ padding: '16px 16px 0' }}>
        <InfoCard message="Lengkapi usia dan jenis kelamin pasien di Data Pasien untuk menghitung status gizi." />
      </div>
    );
  }

  const bmi = hasWeight && hasHeight ? wKg / Math.pow(hCm / 100, 2) : null;
  const use5y = ageM <= 60; // ≤5 tahun: WHO; >5 tahun: CDC

  // Z-scores
  const zWFA   = hasWeight && use5y     ? whoWFA(ageM, sex, wKg)           : hasWeight ? cdcWFA(ageM, sex, wKg)  : null;
  const zLHFA  = hasHeight && use5y     ? whoLHFA(ageM, sex, hCm)          : hasHeight ? cdcHFA(ageM, sex, hCm)  : null;
  const zWFLH  = hasWeight && hasHeight && use5y ? whoWFLH(ageM, sex, wKg, hCm) : null;
  const zBMI   = bmi != null && use5y   ? whoBMIFA(ageM, sex, bmi)        : null;

  // Derived
  const bbi = hasSex ? calcBBI(ageM, sex) : null;
  const haM = hasHeight && hasSex ? calcHA(sex, hCm) : null;
  const waM = hasWeight && hasSex ? calcWA(sex, wKg) : null;

  const pctBBI = bbi && hasWeight ? Math.round((wKg / bbi) * 100) : null;

  return (
    <div style={{ padding: '0 16px 0' }}>
      {/* Patient summary strip */}
      {(nama || agePrecise) && (
        <div style={{
          padding: '8px 12px', marginBottom: 12,
          background: 'var(--fill-secondary)', borderRadius: 'var(--r-card)',
          font: 'var(--type-caption-1)', color: 'var(--label-secondary)',
        }}>
          {nama && <span style={{ fontWeight: 600, color: 'var(--label-primary)' }}>{nama}</span>}
          {nama && agePrecise && ' · '}
          {agePrecise && <span>{agePrecise}</span>}
          {hasSex && <span> · {sex === 'L' ? 'Laki-laki' : 'Perempuan'}</span>}
        </div>
      )}

      {/* Source tag */}
      <div style={{
        font: 'var(--type-caption-2)', color: 'var(--label-tertiary)',
        marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.04em',
      }}>
        {use5y ? 'WHO Growth Standards 2006 [35]' : 'CDC Growth Charts 2000 [36]'}
        {ageM > 60 && ageM <= 228 && ' · WHO Growth Reference 2007 [37]'}
      </div>

      {/* Indicator cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
        {hasWeight && (
          <ZScoreCard
            label="BB/U (Berat Badan per Usia)"
            z={zWFA}
            interp={zWFA != null ? interpretZScore(zWFA, 'wfa') : null}
            detail={hasWeight ? `${wKg} kg` : undefined}
          />
        )}
        {hasHeight && (
          <ZScoreCard
            label={ageM < 24 ? 'PB/U (Panjang Badan per Usia)' : 'TB/U (Tinggi Badan per Usia)'}
            z={zLHFA}
            interp={zLHFA != null ? interpretZScore(zLHFA, 'lhfa') : null}
            detail={hasHeight ? `${hCm} cm` : undefined}
          />
        )}
        {use5y && hasWeight && hasHeight && (
          <ZScoreCard
            label={ageM < 24 ? 'BB/PB (Berat per Panjang Badan)' : 'BB/TB (Berat per Tinggi Badan)'}
            z={zWFLH}
            interp={zWFLH != null ? interpretZScore(zWFLH, 'wflh') : null}
            detail={bmi != null ? `BMI ${bmi.toFixed(1)} kg/m²` : undefined}
          />
        )}
        {use5y && bmi != null && (
          <ZScoreCard
            label="IMT/U (Indeks Massa Tubuh per Usia)"
            z={zBMI}
            interp={zBMI != null ? interpretZScore(zBMI, 'bmi') : null}
            detail={`BMI ${bmi.toFixed(1)} kg/m²`}
          />
        )}
      </div>

      {/* Derived values */}
      {(bbi || haM || waM || pctBBI) && (
        <div style={{
          background: 'var(--fill-secondary)', borderRadius: 'var(--r-card)',
          padding: '12px 14px', marginBottom: 16,
        }}>
          <div style={{
            font: 'var(--type-caption-2)', color: 'var(--label-tertiary)',
            textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 8,
          }}>
            Nilai Turunan
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {bbi && (
              <DerivedItem label="BBI" value={`${bbi} kg`} sub="Berat badan ideal" />
            )}
            {pctBBI != null && (
              <DerivedItem
                label="% BBI"
                value={`${pctBBI}%`}
                sub={pctBBI >= 90 ? 'Normal' : pctBBI >= 70 ? 'Gizi kurang' : 'Gizi buruk'}
                color={pctBBI >= 90 ? 'var(--sys-green)' : pctBBI >= 70 ? 'var(--sys-orange)' : 'var(--sys-red)'}
              />
            )}
            {haM != null && (
              <DerivedItem label="Height Age" value={fmtMonths(haM)} sub="Usia tinggi badan" />
            )}
            {waM != null && (
              <DerivedItem label="Weight Age" value={fmtMonths(waM)} sub="Usia berat badan" />
            )}
          </div>
        </div>
      )}

      {/* Missing data hint */}
      {(!hasWeight || !hasHeight) && (
        <InfoCard message={
          !hasWeight && !hasHeight
            ? 'Tambahkan berat dan tinggi badan di Data Pasien untuk hasil lengkap.'
            : !hasWeight
              ? 'Tambahkan berat badan di Data Pasien.'
              : 'Tambahkan tinggi badan di Data Pasien.'
        } />
      )}

      {/* References */}
      <div style={{
        borderTop: '0.5px solid var(--separator)', paddingTop: 12, marginTop: 4,
        display: 'flex', flexDirection: 'column', gap: 4,
      }}>
        {[
          '[35] WHO. Child Growth Standards. Geneva: WHO; 2006.',
          '[36] Kuczmarski RJ, et al. 2000 CDC Growth Charts. Vital Health Stat. 2002.',
          '[37] de Onis M, et al. WHO growth reference 5–19 years. Bull WHO. 2007.',
          '[38] IDAI. Rekomendasi Asuhan Nutrisi Pediatrik. Jakarta: IDAI; 2011.',
        ].map((r) => (
          <p key={r} style={{ font: 'var(--type-caption-2)', color: 'var(--label-tertiary)', lineHeight: 1.4 }}>
            {r}
          </p>
        ))}
      </div>
    </div>
  );
}

// ── Sub-components ───────────────────────────────────────────────────────────

const COLOR_MAP: Record<ZInterpretation['color'], string> = {
  red:    'var(--sys-red)',
  orange: 'var(--sys-orange)',
  green:  'var(--sys-green)',
  blue:   'var(--sys-blue)',
};

function ZScoreCard({ label, z, interp, detail }: {
  label: string;
  z: number | null;
  interp: ZInterpretation | null;
  detail?: string;
}) {
  const color = interp ? COLOR_MAP[interp.color] : 'var(--label-tertiary)';
  return (
    <div style={{
      background: 'var(--bg-tertiary)', borderRadius: 'var(--r-card)',
      padding: '12px 14px', border: '0.5px solid var(--separator)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
        <div style={{ flex: 1 }}>
          <div style={{ font: 'var(--type-caption-1)', color: 'var(--label-secondary)', marginBottom: 2 }}>
            {label}
          </div>
          {detail && (
            <div style={{ font: 'var(--type-caption-2)', color: 'var(--label-tertiary)' }}>
              {detail}
            </div>
          )}
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ font: 'var(--type-headline)', fontWeight: 700, color }}>
            {z != null ? (z >= 0 ? '+' : '') + z.toFixed(2) : '—'}
          </div>
          <div style={{ font: 'var(--type-caption-2)', color: 'var(--label-tertiary)' }}>Z-score</div>
        </div>
      </div>
      {interp && (
        <div style={{
          marginTop: 8, paddingTop: 8, borderTop: '0.5px solid var(--separator)',
          font: 'var(--type-caption-1)', fontWeight: 600, color,
        }}>
          {interp.label}
        </div>
      )}
    </div>
  );
}

function DerivedItem({ label, value, sub, color }: {
  label: string; value: string; sub?: string; color?: string;
}) {
  return (
    <div>
      <div style={{ font: 'var(--type-caption-2)', color: 'var(--label-tertiary)', marginBottom: 2 }}>{label}</div>
      <div style={{ font: 'var(--type-subheadline)', fontWeight: 700, color: color ?? 'var(--label-primary)' }}>
        {value}
      </div>
      {sub && <div style={{ font: 'var(--type-caption-2)', color: color ?? 'var(--label-secondary)' }}>{sub}</div>}
    </div>
  );
}

function InfoCard({ message }: { message: string }) {
  return (
    <div style={{
      background: 'var(--fill-secondary)', borderRadius: 'var(--r-card)',
      padding: '12px 14px', marginBottom: 12,
      font: 'var(--type-caption-1)', color: 'var(--label-secondary)',
    }}>
      {message}
    </div>
  );
}

function fmtMonths(months: number): string {
  const y = Math.floor(months / 12);
  const m = Math.round(months % 12);
  if (y === 0) return `${m} bln`;
  if (m === 0) return `${y} th`;
  return `${y} th ${m} bln`;
}
