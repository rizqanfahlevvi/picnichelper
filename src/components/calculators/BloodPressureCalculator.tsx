import { useState } from 'react';
import { ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';
import { Disclaimer } from '../Disclaimer';
import { Cite } from '../Citation';
import { usePatientStore } from '../../store/patientStore';
import {
  interpretBp,
  BP_CATEGORY_LABEL, BP_CATEGORY_COLOR,
  type BpResult, type BpCategory,
} from '../../utils/bloodPressure';
import { REFERENCES } from '../../data/references';

export function BloodPressureCalculator() {
  const { ageYears } = usePatientStore();
  const [sbp, setSbp] = useState('');
  const [dbp, setDbp] = useState('');
  const [result, setResult] = useState<BpResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const ageNum = Number(ageYears);
  const canInterpret = sbp.trim() && dbp.trim() && ageYears.trim();

  function handleInterpret() {
    setError(null); setResult(null);
    try {
      setResult(interpretBp(Number(sbp), Number(dbp), ageNum));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Input tidak valid');
    }
  }

  function handleReset() { setSbp(''); setDbp(''); setResult(null); setError(null); }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ padding: '0 20px 4px' }}>
        <h2 className="ios-title-3">Tekanan Darah</h2>
        <p className="ios-footnote" style={{ marginTop: 2 }}>
          Klasifikasi HTN pediatri <Cite source="aap_bp2017" /> · AAP 2017.
        </p>
      </div>

      {/* Input */}
      <div className="ios-card">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', padding: '12px 14px', gap: 12 }}>
          <BpField label="Sistolik" unit="mmHg" value={sbp} onChange={setSbp} placeholder="110" />
          <BpField label="Diastolik" unit="mmHg" value={dbp} onChange={setDbp} placeholder="70" />
        </div>
        {!ageYears.trim() && (
          <div style={{ margin: '0 14px 10px', padding: '8px 12px', borderRadius: 'var(--r-sm)', background: 'rgba(255,149,0,0.1)' }}>
            <p style={{ font: 'var(--type-caption-1)', color: 'var(--sys-orange)' }}>
              ⚠ Masukkan usia pasien di Data Pasien untuk menentukan persentil.
            </p>
          </div>
        )}
        {ageYears.trim() && (
          <div style={{ padding: '0 14px 6px' }}>
            <p style={{ font: 'var(--type-caption-1)', color: 'var(--label-tertiary)' }}>
              Usia: {ageNum < 1 ? `${Math.round(ageNum * 12)} bulan` : `${ageNum} tahun`}
              {ageNum >= 13 ? ' — kriteria dewasa (AAP 2017)' : ' — tabel 50th percentile tinggi badan'}
            </p>
          </div>
        )}
        <div style={{ display: 'flex', gap: 8, padding: '4px 14px 14px' }}>
          <button
            onClick={handleInterpret} disabled={!canInterpret}
            style={{
              flex: 1, minHeight: 'var(--hit)', borderRadius: 'var(--r-sm)',
              border: 'none', cursor: 'pointer',
              background: 'var(--accent)', color: '#fff',
              font: 'var(--type-body)', fontWeight: 600,
              opacity: canInterpret ? 1 : 0.4, transition: 'opacity var(--dur-fast)',
            }}
          >
            Klasifikasi
          </button>
          <button
            onClick={handleReset}
            style={{
              padding: '0 20px', minHeight: 'var(--hit)', borderRadius: 'var(--r-sm)',
              border: '0.5px solid var(--separator)', cursor: 'pointer',
              background: 'transparent', color: 'var(--label-primary)', font: 'var(--type-body)',
            }}
          >
            Reset
          </button>
        </div>
      </div>

      {error && <div className="ios-warn ios-warn--danger"><AlertTriangle size={15} /><span>{error}</span></div>}

      {result && <BpResultCard result={result} sbp={Number(sbp)} dbp={Number(dbp)} />}

      <NormalRangeCard />
      <TheoryAccordion />
      <Disclaimer />

      <div className="ios-card" style={{ padding: '12px 14px' }}>
        <p style={{ font: 'var(--type-caption-2)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--label-secondary)', marginBottom: 8 }}>Referensi</p>
        <ol style={{ display: 'flex', flexDirection: 'column', gap: 6, paddingLeft: 0, listStyle: 'none', margin: 0 }}>
          {(['aap_bp2017'] as const).map((key) => (
            <li key={key} style={{ font: 'var(--type-caption-1)', color: 'var(--label-secondary)' }}>
              <span style={{ fontWeight: 700, color: 'var(--label-primary)' }}>[{REFERENCES[key].id}]</span>{' '}
              {REFERENCES[key].citation}
            </li>
          ))}
        </ol>
        <p style={{ font: 'var(--type-caption-2)', color: 'var(--label-tertiary)', marginTop: 8, lineHeight: 1.4 }}>
          Nilai 95th–99th percentile berdasarkan Table 3, 50th height percentile. Untuk akurasi penuh, gunakan tabel lengkap per tinggi badan dari panduan AAP 2017.
        </p>
      </div>
    </div>
  );
}

function BpField({ label, unit, value, onChange, placeholder }: {
  label: string; unit: string; value: string; onChange: (v: string) => void; placeholder: string;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <label style={{ font: 'var(--type-caption-1)', fontWeight: 600, color: 'var(--label-secondary)' }}>
        {label} <span style={{ color: 'var(--label-tertiary)', fontWeight: 400 }}>({unit})</span>
      </label>
      <input
        type="number" value={value} onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%', minHeight: 44, borderRadius: 'var(--r-sm)',
          border: '0.5px solid var(--separator)', outline: 'none',
          background: 'var(--fill-tertiary)', color: 'var(--label-primary)',
          font: 'var(--type-title-3)', fontWeight: 700, padding: '0 10px', boxSizing: 'border-box',
          textAlign: 'center',
        }}
      />
    </div>
  );
}

function BpResultCard({ result, sbp, dbp }: { result: BpResult; sbp: number; dbp: number }) {
  const col = BP_CATEGORY_COLOR[result.overallCategory];
  const isHtCrisis = result.overallCategory === 'htn_crisis';

  return (
    <div className="ios-card" style={{ overflow: 'hidden' }}>
      {isHtCrisis && (
        <div style={{ padding: '10px 14px', background: 'rgba(255,59,48,0.12)', borderBottom: '0.5px solid var(--separator)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <AlertTriangle size={16} color="var(--sys-red)" />
          <span style={{ font: 'var(--type-footnote)', fontWeight: 700, color: 'var(--sys-red)' }}>
            KRISIS HIPERTENSI — Tatalaksana segera
          </span>
        </div>
      )}

      {/* Overall classification */}
      <div style={{ padding: '14px 16px', background: `color-mix(in srgb, ${col} 10%, var(--bg-tertiary))`, borderBottom: '0.5px solid var(--separator)' }}>
        <p style={{ font: 'var(--type-caption-2)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--label-secondary)', marginBottom: 4 }}>
          Klasifikasi Keseluruhan
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: col, flexShrink: 0 }} />
          <span style={{ font: 'var(--type-headline)', fontWeight: 700, color: 'var(--label-primary)' }}>
            {BP_CATEGORY_LABEL[result.overallCategory]}
          </span>
        </div>
      </div>

      {/* Detail per komponen */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
        <BpDetailCell label="Sistolik" value={sbp} category={result.systolicCategory} borderRight />
        <BpDetailCell label="Diastolik" value={dbp} category={result.diastolicCategory} />
      </div>

      {/* Threshold reference */}
      {!result.isAdult && (
        <div style={{ padding: '10px 14px', borderTop: '0.5px solid var(--separator)' }}>
          <p style={{ font: 'var(--type-caption-2)', fontWeight: 700, color: 'var(--label-secondary)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Ambang Batas (50th persentil tinggi)
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 4 }}>
            {[
              { label: '90th SBP/DBP', sbp: result.p90SBP, dbp: result.p90DBP },
              { label: '95th SBP/DBP', sbp: result.p95SBP, dbp: result.p95DBP },
              { label: '99th SBP/DBP', sbp: result.p99SBP, dbp: result.p99DBP },
            ].map((t) => (
              <div key={t.label} style={{ textAlign: 'center', padding: '4px 0' }}>
                <p style={{ font: 'var(--type-caption-2)', color: 'var(--label-tertiary)', marginBottom: 2 }}>{t.label}</p>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, color: 'var(--label-primary)' }}>{t.sbp}/{t.dbp}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function BpDetailCell({ label, value, category, borderRight }: {
  label: string; value: number; category: BpCategory; borderRight?: boolean;
}) {
  const col = BP_CATEGORY_COLOR[category];
  return (
    <div style={{ padding: '12px 14px', borderRight: borderRight ? '0.5px solid var(--separator)' : 'none', textAlign: 'center' }}>
      <p style={{ font: 'var(--type-caption-2)', fontWeight: 700, color: 'var(--label-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</p>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 28, fontWeight: 700, color: col, marginTop: 2 }}>{value}</p>
      <span style={{
        display: 'inline-block', marginTop: 4,
        font: 'var(--type-caption-2)', fontWeight: 600, color: col,
        background: `color-mix(in srgb, ${col} 12%, transparent)`,
        padding: '2px 8px', borderRadius: 'var(--r-pill)',
      }}>
        {BP_CATEGORY_LABEL[category]}
      </span>
    </div>
  );
}

function NormalRangeCard() {
  return (
    <div className="ios-card" style={{ padding: '12px 14px' }}>
      <p style={{ font: 'var(--type-caption-2)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--label-secondary)', marginBottom: 8 }}>
        Nilai Normal (SBP/DBP mmHg)
      </p>
      {[
        { label: '1 th',  val: '< 100/54' },
        { label: '3 th',  val: '< 103/60' },
        { label: '5 th',  val: '< 106/62' },
        { label: '7 th',  val: '< 108/64' },
        { label: '10 th', val: '< 113/67' },
        { label: '12 th', val: '< 117/70' },
        { label: '≥ 13 th (remaja)', val: '< 120/80' },
      ].map((r) => (
        <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ font: 'var(--type-footnote)', color: 'var(--label-primary)' }}>{r.label}</span>
          <span style={{ fontFamily: 'var(--font-mono)', font: 'var(--type-footnote)', color: 'var(--label-secondary)' }}>{r.val}</span>
        </div>
      ))}
    </div>
  );
}

const THEORY_SECTIONS = [
  {
    title: 'Definisi & Staging (AAP 2017)',
    content: `Anak 1–12 tahun (berdasarkan persentil usia/jenis kelamin/tinggi):
• Normal: < 90th percentile
• Meningkat (Elevated): 90th – < 95th percentile
• HTN Stage 1: 95th – 99th percentile + 5 mmHg
• HTN Stage 2: > 99th percentile + 5 mmHg
• Krisis HTN: ≥ 180/120 atau simtomatik berat

Remaja ≥ 13 tahun (kriteria dewasa):
• Normal: < 120/80 mmHg
• Meningkat: 120–129 / < 80
• HTN Stage 1: 130–139 / 80–89
• HTN Stage 2: ≥ 140/90`,
  },
  {
    title: 'Penyebab Hipertensi Anak',
    content: `Penyebab sekunder lebih sering ditemukan dibanding pada dewasa.

Bayi & anak muda:
• Stenosis arteri renalis (tersering pada neonatus/bayi)
• Koarktasio aorta
• Penyakit ginjal parenkim

Anak & remaja:
• Penyakit ginjal parenkim (glomerulonefritis, CKD)
• HTN renovaskular
• Aldosteronisme primer, sindrom Cushing
• Feokromositoma (jarang namun penting)
• HTN esensial (makin sering pada anak obesitas > 6 tahun)

Penyebab sementara:
• Nyeri, ansietas, obat (steroid, simpatomimetik, AINS)
• White coat HTN`,
  },
  {
    title: 'Evaluasi Klinis',
    content: `Pengukuran yang benar:
• Manset ukuran tepat: lebar 40% lingkar lengan, panjang 80% lingkar lengan
• Posisi duduk, lengan setinggi jantung, istirahat 5 menit
• Konfirmasi ≥ 2 pengukuran berbeda

Temuan yang memerlukan evaluasi segera:
• TD diastolik sangat tinggi, sakit kepala, gangguan visual
• Disuria, hematuria (kemungkinan glomerulonefritis)
• Bising abdomen (stenosis arteri renalis)
• Pulse tekanan lebar + TD kaki < tangan (koarktasio)

Laboratorium awal (HTN stage 1):
• Urinalisis + protein:kreatinin urin
• Ureum, kreatinin serum, eGFR
• Elektrolit, CBC
• Echo jantung bila stage 2`,
  },
  {
    title: 'Tatalaksana',
    content: `HTN non-darurat (stage 1–2, tanpa gejala):
→ Modifikasi gaya hidup dulu (6–12 bulan): diet DASH, kurangi garam, olahraga
→ Obat bila: target organ damage, HTN simtomatik, DM, CKD, atau no response

Obat lini pertama (anak):
• ACEi / ARB (terutama bila CKD/proteinuria): lisinopril, enalapril
• CCB amlodipin (anak > 6 tahun): aman, efektif
• Tiazid (bila hipervolemia)
• Beta-blocker (bila komorbid aritmia/migren)

Krisis Hipertensi:
→ Urgensi: penurunan bertahap 25% dalam 8 jam, oral OK
→ Emergensi (ensefalopati, LVF, AKI): IV nicardipine, labetalol
→ Target: turunkan 25% MAP dalam 1 jam pertama, lanjutkan bertahap`,
  },
];

function TheoryAccordion() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="ios-card" style={{ overflow: 'hidden' }}>
      <div style={{ padding: '10px 14px 8px' }}>
        <p style={{ font: 'var(--type-caption-2)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--label-secondary)' }}>Panduan Klinis</p>
      </div>
      {THEORY_SECTIONS.map((s, i) => (
        <div key={i} style={{ borderTop: '0.5px solid var(--separator)' }}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 14px', background: 'none', border: 'none', cursor: 'pointer', minHeight: 'var(--hit)' }}
          >
            <span style={{ font: 'var(--type-subheadline)', fontWeight: 600, color: 'var(--label-primary)', textAlign: 'left' }}>{s.title}</span>
            {open === i ? <ChevronUp size={16} color="var(--label-tertiary)" /> : <ChevronDown size={16} color="var(--label-tertiary)" />}
          </button>
          {open === i && (
            <div style={{ padding: '0 14px 14px' }}>
              <p style={{ font: 'var(--type-footnote)', color: 'var(--label-secondary)', lineHeight: 1.6, whiteSpace: 'pre-line' }}>{s.content}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
