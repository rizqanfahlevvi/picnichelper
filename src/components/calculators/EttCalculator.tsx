import { AlertTriangle } from 'lucide-react';
import { Cite } from '../Citation';
import { Disclaimer } from '../Disclaimer';
import { TheoryAccordion, type TheorySection } from '../TheoryAccordion';
import { usePatientStore } from '../../store/patientStore';
import {
  ettSizeByAge,
  ettSizeNeonate,
  ETT_AGE_MIN_YEARS,
  ETT_AGE_MAX_YEARS,
} from '../../utils/ett';
import { REFERENCES } from '../../data/references';

const ETT_THEORY: TheorySection[] = [
  {
    title: 'Pemilihan Ukuran ETT',
    content: `Rumus Cole (1957) untuk anak ≥ 1 tahun:
• Cuffed: usia/4 + 3.5 mm
• Uncuffed: usia/4 + 4.0 mm

AHA PALS 2020 merekomendasikan ETT cuffed pada bayi & anak karena mengurangi re-intubasi tanpa meningkatkan risiko edema subglotis. Sediakan ± 0.5 mm dari ukuran kalkulasi.`,
  },
  {
    title: 'Kedalaman Insersi Orotrakeal',
    content: `Panduan PALS 2020:
• Per usia: usia/2 + 12 cm (untuk anak ≥ 2 tahun)
• Per tube ID: ID × 3 cm dari bibir

Konfirmasi posisi wajib dengan:
1. Auskultasi bilateral (midaksila & epigastrium)
2. Kapnografi end-tidal CO₂ kontinu
3. Rontgen dada: ujung ETT 2–3 cm di atas karina`,
  },
  {
    title: 'ETT Neonatus (NRP)',
    content: `Berdasarkan tabel NRP 8th Edition (berat lahir):
• < 1 kg    → ETT 2.5 mm, kedalaman ±6.5 cm
• 1–2 kg   → ETT 3.0 mm, kedalaman ±7.5 cm
• 2–3 kg   → ETT 3.5 mm, kedalaman ±8.5 cm
• > 3 kg   → ETT 3.5–4.0 mm, kedalaman ±9.5 cm

Rumus kedalaman: berat (kg) + 6 cm dari bibir.`,
  },
];

const NEONATE_WEIGHT_MIN_G = 300;
const NEONATE_WEIGHT_MAX_G = 6000;

type Validation = { tone: 'warn' | 'danger'; text: string } | null;

export function EttCalculator() {
  const { category, ageYears, weightKg } = usePatientStore();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ padding: '0 20px 4px' }}>
        <h2 className="ios-title-3">Kalkulator Ukuran ETT</h2>
        <p className="ios-footnote" style={{ marginTop: 2 }}>
          Internal diameter (mm) berdasarkan {category === 'anak' ? 'usia' : 'berat badan'}.
        </p>
      </div>

      {category === 'anak' ? <ChildResult age={ageYears} /> : <NeonateResult weight={weightKg} />}

      <TheoryAccordion sections={ETT_THEORY} />
      <Disclaimer />
      <ReferenceFootnotes />
    </div>
  );
}

function ChildResult({ age }: { age: string }) {
  if (age.trim() === '') {
    return <EmptyHint text="Masukkan usia pasien untuk menghitung." />;
  }

  const ageNum = Number(age);
  const invalid = validateAge(ageNum);
  if (invalid?.tone === 'danger') {
    return (
      <div className="ios-warn ios-warn--danger">
        <AlertTriangle size={15} />
        <span>{invalid.text}</span>
      </div>
    );
  }

  const { cuffed, uncuffed } = ettSizeByAge(ageNum);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {invalid?.tone === 'warn' && (
        <div className="ios-warn">
          <AlertTriangle size={15} />
          <span>{invalid.text}</span>
        </div>
      )}
      <div className="ios-card">
        <div className="ios-result-grid">
          <ResultTile label="Cuffed" cite="duracher2008" value={cuffed} note="usia/4 + 3.5" preferred />
          <ResultTile label="Uncuffed" cite="cole1957" value={uncuffed} note="usia/4 + 4" />
        </div>
        <p style={{ padding: '10px 14px 12px', font: 'var(--type-footnote)', color: 'var(--label-secondary)', borderTop: '0.5px solid var(--separator)' }}>
          AHA PALS 2020 lebih menyukai cuffed pada bayi &amp; anak{' '}
          <Cite source="pals2020" />. Selalu sediakan ukuran ± 0.5 mm.
        </p>
      </div>
    </div>
  );
}

function NeonateResult({ weight }: { weight: string }) {
  if (weight.trim() === '') {
    return <EmptyHint text="Masukkan berat badan pasien untuk menghitung." />;
  }

  const grams = Number(weight) * 1000;
  const v = validateNeonateWeight(grams);
  if (v?.tone === 'danger') {
    return (
      <div className="ios-warn ios-warn--danger">
        <AlertTriangle size={15} />
        <span>{v.text}</span>
      </div>
    );
  }

  const row = ettSizeNeonate(grams);
  if (!row) {
    return (
      <div className="ios-warn ios-warn--danger">
        <AlertTriangle size={15} />
        <span>Berat di luar rentang tabel.</span>
      </div>
    );
  }

  return (
    <div className="ios-card">
      <div className="ios-result-grid">
        <ResultTile label="ETT Uncuffed" cite="nrp8" value={row.sizeMm} note={row.gestation} />
      </div>
      <p style={{ padding: '10px 14px 12px', font: 'var(--type-footnote)', color: 'var(--label-secondary)', borderTop: '0.5px solid var(--separator)' }}>
        Berdasarkan tabel berat NRP 8th ed. <Cite source="nrp8" />
      </p>
    </div>
  );
}

function ResultTile({
  label, cite, value, note, preferred,
}: {
  label: string;
  cite: keyof typeof REFERENCES;
  value: number;
  note: string;
  preferred?: boolean;
}) {
  return (
    <div className="ios-result tint-resp">
      <div className="ios-result-label">
        {label} <Cite source={cite} />
        {preferred && (
          <span style={{
            marginLeft: 6, font: 'var(--type-caption-2)', fontWeight: 700,
            color: 'var(--accent)', background: 'var(--accent-tint)',
            padding: '2px 6px', borderRadius: 'var(--r-pill)',
          }}>PALS</span>
        )}
      </div>
      <div>
        <span className="ios-result-value">{value.toFixed(1)}</span>
        <span className="ios-result-unit">mm</span>
      </div>
      <div className="ios-result-note ios-mono">{note}</div>
    </div>
  );
}

function EmptyHint({ text }: { text: string }) {
  return (
    <div className="ios-card" style={{ padding: '14px 16px' }}>
      <p className="ios-footnote">{text}</p>
    </div>
  );
}

function ReferenceFootnotes() {
  const used = ['cole1957', 'duracher2008', 'pals2020', 'nrp8'] as const;
  return (
    <div className="ios-card" style={{ padding: '12px 14px' }}>
      <p style={{ font: 'var(--type-caption-2)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--label-secondary)', marginBottom: 8 }}>Referensi</p>
      <ol style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {used.map((key) => (
          <li key={key} style={{ font: 'var(--type-caption-1)', color: 'var(--label-secondary)' }}>
            <span style={{ fontWeight: 700, color: 'var(--label-primary)' }}>[{REFERENCES[key].id}]</span>{' '}
            {REFERENCES[key].citation}
            {!REFERENCES[key].verified && (
              <span style={{ color: 'var(--warning)' }}> (perlu konfirmasi)</span>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}

function validateAge(age: number): Validation {
  if (!Number.isFinite(age)) return { tone: 'danger', text: 'Usia harus berupa angka.' };
  if (age <= 0) return { tone: 'danger', text: 'Usia harus lebih dari 0.' };
  if (age < ETT_AGE_MIN_YEARS)
    return { tone: 'danger', text: `Rumus usia/4 tidak valid < ${ETT_AGE_MIN_YEARS} th. Pakai kategori Neonatus.` };
  if (age > ETT_AGE_MAX_YEARS)
    return { tone: 'warn', text: `Usia > ${ETT_AGE_MAX_YEARS} th: pertimbangkan ukuran dewasa & penilaian klinis.` };
  return null;
}

function validateNeonateWeight(grams: number): Validation {
  if (!Number.isFinite(grams)) return { tone: 'danger', text: 'Berat harus berupa angka.' };
  if (grams <= 0) return { tone: 'danger', text: 'Berat harus lebih dari 0.' };
  if (grams < NEONATE_WEIGHT_MIN_G || grams > NEONATE_WEIGHT_MAX_G)
    return { tone: 'danger', text: 'Berat di luar rentang neonatus wajar (0.3–6 kg). Periksa kembali.' };
  return null;
}
