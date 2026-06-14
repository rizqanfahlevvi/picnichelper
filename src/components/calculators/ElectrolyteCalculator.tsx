import React, { useState } from 'react';
import { Disclaimer } from '../Disclaimer';
import { Cite } from '../Citation';
import { TheoryAccordion, type TheorySection } from '../TheoryAccordion';
import { usePatientStore } from '../../store/patientStore';
import {
  classifyNa, calc3pctNaClVol, calcFreeWaterDeficit,
  classifyK, calcKDose,
  classifyCaTotal, classifyCaIonized, calcCaGluconateVol, correctCaForAlbumin,
  classifyMg, calcMgSO4Vol,
  severityColor, SEVERITY_LABEL, STATUS_LABEL,
  type ElectClass,
} from '../../utils/electrolytes';
import { REFERENCES } from '../../data/references';

type ElectTab = 'na' | 'k' | 'ca' | 'mg';

const TABS: { id: ElectTab; label: string; unit: string }[] = [
  { id: 'na', label: 'Natrium',  unit: 'mEq/L' },
  { id: 'k',  label: 'Kalium',   unit: 'mEq/L' },
  { id: 'ca', label: 'Kalsium',  unit: 'mg/dL / mmol/L' },
  { id: 'mg', label: 'Magnesium', unit: 'mg/dL' },
];

export function ElectrolyteCalculator() {
  const [tab, setTab] = useState<ElectTab>('na');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ padding: '0 20px 4px' }}>
        <h2 className="ios-title-3">Elektrolit</h2>
        <p className="ios-footnote" style={{ marginTop: 2 }}>
          Interpretasi & strategi koreksi <Cite source="greenbaum2020" /><Cite source="feld2018" />.
        </p>
      </div>

      {/* Tab selector */}
      <div style={{ display: 'flex', gap: 6, padding: '0 16px', overflowX: 'auto', scrollbarWidth: 'none' }}>
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              flexShrink: 0, padding: '7px 16px', borderRadius: 'var(--r-pill)',
              border: 'none', cursor: 'pointer',
              font: 'var(--type-subheadline)', fontWeight: tab === t.id ? 600 : 400,
              background: tab === t.id ? 'var(--accent)' : 'var(--fill-secondary)',
              color: tab === t.id ? '#fff' : 'var(--label-primary)',
              transition: 'all var(--dur-fast)',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'na' && <NaSection />}
      {tab === 'k'  && <KSection />}
      {tab === 'ca' && <CaSection />}
      {tab === 'mg' && <MgSection />}

      <Disclaimer />
      <div className="ios-card" style={{ padding: '12px 14px' }}>
        <p style={{ font: 'var(--type-caption-2)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--label-secondary)', marginBottom: 8 }}>Referensi</p>
        <ol style={{ display: 'flex', flexDirection: 'column', gap: 6, paddingLeft: 0, listStyle: 'none', margin: 0 }}>
          {(['greenbaum2020', 'feld2018', 'pals2020'] as const).map((key) => (
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

// ── Natrium ───────────────────────────────────────────────────────────────
function NaSection() {
  const { weightKg } = usePatientStore();
  const [val, setVal] = useState('');
  const [targetRise, setTargetRise] = useState('2');

  const na  = Number(val);
  const wt  = Number(weightKg);
  const ec  = val.trim() ? classifyNa(na) : null;
  const col = ec ? severityColor(ec.severity, ec.status) : 'var(--label-tertiary)';

  const vol3pct = ec?.status === 'hypo' && wt > 0
    ? calc3pctNaClVol(wt, Number(targetRise) || 2)
    : null;
  const fwd = ec?.status === 'hyper' && wt > 0
    ? calcFreeWaterDeficit(wt, na)
    : null;

  return (
    <>
      <ClassifyCard
        label="Natrium (Na⁺)"
        unit="mEq/L" placeholder="140"
        normal="135–145 mEq/L"
        value={val} onChange={setVal}
        ec={ec} col={col}
      />

      {/* Koreksi Hiponatremia */}
      {ec?.status === 'hypo' && (
        <div className="ios-card" style={{ overflow: 'hidden' }}>
          <SectionHeader>Koreksi Hiponatremia <Cite source="feld2018" /></SectionHeader>

          {/* Kalkulasi volume */}
          <div style={{ padding: '12px 16px', borderBottom: '0.5px solid var(--separator)' }}>
            <p style={{ font: 'var(--type-caption-2)', fontWeight: 700, color: 'var(--label-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 8 }}>
              Hitung Volume 3% NaCl
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <span style={{ font: 'var(--type-subheadline)', color: 'var(--label-primary)', flex: 1 }}>Target kenaikan Na</span>
              <input
                type="number" value={targetRise} onChange={(e) => setTargetRise(e.target.value)}
                min="1" max="12"
                style={{ width: 60, textAlign: 'right', borderRadius: 'var(--r-sm)', border: 'none', outline: 'none', background: 'var(--fill-tertiary)', color: 'var(--label-primary)', font: 'var(--type-body)', padding: '4px 8px', minHeight: 36 }}
              />
              <span style={{ font: 'var(--type-subheadline)', color: 'var(--label-secondary)' }}>mEq/L</span>
            </div>
            {wt > 0 && vol3pct != null ? (
              <ResultRow label="Volume 3% NaCl" value={vol3pct} unit="mL" note="ΔNa × BB × 0.6 / 0.514" />
            ) : (
              <p style={{ font: 'var(--type-caption-1)', color: 'var(--label-tertiary)' }}>Masukkan berat badan pasien untuk menghitung.</p>
            )}
          </div>

          {/* Protokol simtomatik */}
          <div style={{ padding: '12px 16px', borderBottom: '0.5px solid var(--separator)', background: 'color-mix(in srgb, var(--sys-red) 5%, var(--bg-tertiary))' }}>
            <p style={{ font: 'var(--type-caption-2)', fontWeight: 700, color: 'var(--sys-red)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 8 }}>
              Protokol Simtomatik (Kejang / Koma)
            </p>
            <ProtocolStep n={1} text="3% NaCl 2 mEq/kg IV (≈ 4 mL/kg) dalam 10–20 menit" />
            <ProtocolStep n={2} text="Ulangi bolus hingga 2× lagi bila kejang berlanjut" />
            <ProtocolStep n={3} text="Target: Na naik 5 mEq/L atau gejala teratasi" />
            <ProtocolStep n={4} text="Setelah gejala membaik → switch ke koreksi lambat (lihat di bawah)" />
          </div>

          {/* Protokol asimtomatik */}
          <div style={{ padding: '12px 16px', borderBottom: '0.5px solid var(--separator)' }}>
            <p style={{ font: 'var(--type-caption-2)', fontWeight: 700, color: 'var(--label-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 8 }}>
              Protokol Asimtomatik / Koreksi Lambat
            </p>
            <ProtocolStep n={1} text="Tentukan target kenaikan Na (gunakan kalkulator di atas)" />
            <ProtocolStep n={2} text="Berikan volume 3% NaCl dalam 24–48 jam (infus kontinu via syringe pump)" />
            <ProtocolStep n={3} text="Kecepatan maks: 1–2 mEq/L/jam hanya di fase akut simtomatik; kronis max 0.5 mEq/L/jam" />
            <ProtocolStep n={4} text="Alternatif bila Na tidak sangat rendah: NaCl 0.9% (154 mEq/L) atau NaCl 3% diencerkan" />
            <ProtocolStep n={5} text="SIADH: restriksi cairan 500–800 mL/m²/hari sebagai mainstay; hindari koreksi terlalu cepat" />
          </div>

          {/* Monitoring */}
          <div style={{ padding: '12px 16px', borderBottom: '0.5px solid var(--separator)' }}>
            <p style={{ font: 'var(--type-caption-2)', fontWeight: 700, color: 'var(--label-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 8 }}>
              Monitoring
            </p>
            <MonitorItem text="Na serum tiap 2–4 jam selama koreksi aktif" />
            <MonitorItem text="Output urin & berat badan tiap 4–6 jam" />
            <MonitorItem text="Status neurologi: kesadaran, pupil, kejang" />
            <MonitorItem text="Total koreksi 24 jam: MAKS 8–10 mEq/L (kronik), 10–12 mEq/L (akut)" />
          </div>

          <DangerBox text="Koreksi > 10 mEq/L/24 jam pada hiponatremia kronik → risiko Osmotic Demyelination Syndrome (ODS) / central pontine myelinolysis. Tidak dapat diperbaiki." />
        </div>
      )}

      {/* Koreksi Hipernatremia */}
      {ec?.status === 'hyper' && (
        <div className="ios-card" style={{ overflow: 'hidden' }}>
          <SectionHeader>Koreksi Hipernatremia</SectionHeader>

          {/* Kalkulasi */}
          <div style={{ padding: '12px 16px', borderBottom: '0.5px solid var(--separator)' }}>
            <p style={{ font: 'var(--type-caption-2)', fontWeight: 700, color: 'var(--label-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 8 }}>
              Hitung Defisit Air Bebas
            </p>
            {wt > 0 && fwd != null ? (
              <>
                <ResultRow label="Free Water Deficit" value={fwd} unit="L" note="BB × 0.6 × (Na/145 − 1)" />
                <p style={{ font: 'var(--type-caption-1)', color: 'var(--label-tertiary)', marginTop: 8 }}>
                  Berikan defisit ini dalam 48–72 jam → {wt > 0 && fwd ? ((fwd * 1000) / 48).toFixed(0) : '—'} mL/jam selama 48 jam (belum termasuk maintenance)
                </p>
              </>
            ) : (
              <p style={{ font: 'var(--type-caption-1)', color: 'var(--label-tertiary)' }}>Masukkan berat badan pasien untuk menghitung.</p>
            )}
          </div>

          {/* Protokol */}
          <div style={{ padding: '12px 16px', borderBottom: '0.5px solid var(--separator)' }}>
            <p style={{ font: 'var(--type-caption-2)', fontWeight: 700, color: 'var(--label-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 8 }}>
              Protokol Koreksi
            </p>
            <ProtocolStep n={1} text="Hitung total cairan = maintenance + defisit (dibagi 48–72 jam)" />
            <ProtocolStep n={2} text="Pilihan cairan: D5W, D5 0.2% NaCl, atau enteral water — BUKAN NaCl 0.9%" />
            <ProtocolStep n={3} text="Bila ada hipovolemia: koreksi volum dahulu dengan NaCl 0.9% 10–20 mL/kg bolus, baru lanjut koreksi lambat" />
            <ProtocolStep n={4} text="Rate awal: targetkan penurunan Na 10–12 mEq/L per 24 jam" />
            <ProtocolStep n={5} text="Hipernatremia akut (< 24 jam): boleh koreksi lebih cepat (0.5–1 mEq/L/jam)" />
          </div>

          {/* Monitoring */}
          <div style={{ padding: '12px 16px', borderBottom: '0.5px solid var(--separator)' }}>
            <p style={{ font: 'var(--type-caption-2)', fontWeight: 700, color: 'var(--label-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 8 }}>
              Monitoring
            </p>
            <MonitorItem text="Na serum tiap 4–6 jam; sesuaikan rate setelah setiap pemeriksaan" />
            <MonitorItem text="Output urin tiap jam (target 1–2 mL/kg/jam)" />
            <MonitorItem text="Status neurologi: bila deteriorasi → cek Na segera (mungkin turun terlalu cepat)" />
            <MonitorItem text="Glukosa darah tiap 4 jam bila menggunakan cairan D5%" />
          </div>

          <DangerBox text="Koreksi terlalu cepat → edema serebral → kejang, herniasi. Penurunan Na > 0.5 mEq/L/jam tidak dianjurkan kecuali hipernatremia akut." />
        </div>
      )}

      <TheoryAccordion sections={NA_THEORY} />
    </>
  );
}

// ── Kalium ────────────────────────────────────────────────────────────────
function KSection() {
  const { weightKg } = usePatientStore();
  const [val, setVal] = useState('');
  const wt  = Number(weightKg);
  const k   = Number(val);
  const ec  = val.trim() ? classifyK(k)  : null;
  const col = ec ? severityColor(ec.severity, ec.status) : 'var(--label-tertiary)';
  const dose = ec?.status === 'hypo' && wt > 0 ? calcKDose(wt) : null;

  return (
    <>
      <ClassifyCard
        label="Kalium (K⁺)"
        unit="mEq/L" placeholder="4.0"
        normal="3.5–5.5 mEq/L"
        value={val} onChange={setVal}
        ec={ec} col={col}
      />

      {ec?.status === 'hypo' && (
        <div className="ios-card" style={{ overflow: 'hidden' }}>
          <SectionHeader>Koreksi Hipokalemia <Cite source="pals2020" /></SectionHeader>

          {/* Kalkulasi */}
          <div style={{ padding: '12px 16px', borderBottom: '0.5px solid var(--separator)' }}>
            <p style={{ font: 'var(--type-caption-2)', fontWeight: 700, color: 'var(--label-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 8 }}>
              Dosis KCl IV per Dosis
            </p>
            {wt > 0 && dose ? (
              <>
                <ResultRow label="Dosis rendah" value={dose.lowMeq} unit="mEq" note="0.2 mEq/kg — untuk koreksi ringan / maintenance" />
                <div style={{ height: '0.5px', background: 'var(--separator)', margin: '10px 0' }} />
                <ResultRow label="Dosis standar" value={dose.highMeq} unit="mEq" note="0.5 mEq/kg — untuk koreksi sedang-berat" />
              </>
            ) : (
              <p style={{ font: 'var(--type-caption-1)', color: 'var(--label-tertiary)' }}>Masukkan berat badan pasien.</p>
            )}
          </div>

          {/* Route & persiapan */}
          <div style={{ padding: '12px 16px', borderBottom: '0.5px solid var(--separator)' }}>
            <p style={{ font: 'var(--type-caption-2)', fontWeight: 700, color: 'var(--label-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 8 }}>
              Route & Persiapan Larutan
            </p>
            <InfoRow label="Oral (ringan + toleransi OK)" value="KCl oral 1–2 mEq/kg/hari — pilihan utama bila memungkinkan" />
            <InfoRow label="IV perifer (maks 40 mEq/L)" value="Encerkan: mis. KCl 20 mEq + NaCl 0.9% 500 mL = 40 mEq/L" />
            <InfoRow label="IV sentral (maks 80 mEq/L)" value="Hanya via CVC; konsentrasi lebih tinggi boleh dengan monitor EKG kontinu" />
          </div>

          {/* Kecepatan infus */}
          <div style={{ padding: '12px 16px', borderBottom: '0.5px solid var(--separator)' }}>
            <p style={{ font: 'var(--type-caption-2)', fontWeight: 700, color: 'var(--label-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 8 }}>
              Kecepatan Infus (Rate Maks)
            </p>
            <InfoRow label="Via perifer" value="0.3 mEq/kg/jam — tidak boleh lebih cepat" />
            <InfoRow label="Via sentral (ICU)" value="0.5 mEq/kg/jam — wajib monitor EKG kontinu" />
            <InfoRow label="Durasi per dosis" value="1–4 jam (tergantung keparahan dan route)" />
          </div>

          {/* Protokol langkah */}
          <div style={{ padding: '12px 16px', borderBottom: '0.5px solid var(--separator)' }}>
            <p style={{ font: 'var(--type-caption-2)', fontWeight: 700, color: 'var(--label-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 8 }}>
              Langkah Klinis
            </p>
            <ProtocolStep n={1} text="Cek dan koreksi Mg TERLEBIH DAHULU jika hipomagnesemia ada — Mg defisiensi mencegah koreksi K" />
            <ProtocolStep n={2} text="Pilih route: oral bila K ≥ 3.0 dan tidak simtomatik; IV bila < 3.0 atau ada aritmia/kelemahan otot" />
            <ProtocolStep n={3} text="Hitung dosis (gunakan kalkulator di atas), encerkan sesuai route" />
            <ProtocolStep n={4} text="Infus via syringe pump, jangan bolus cepat" />
            <ProtocolStep n={5} text="Ulangi dosis hingga K > 3.5 mEq/L" />
          </div>

          {/* Monitoring */}
          <div style={{ padding: '12px 16px', borderBottom: '0.5px solid var(--separator)' }}>
            <p style={{ font: 'var(--type-caption-2)', fontWeight: 700, color: 'var(--label-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 8 }}>
              Monitoring
            </p>
            <MonitorItem text="EKG kontinu selama infus IV (terutama via sentral)" />
            <MonitorItem text="K serum ulang 2–4 jam setelah tiap dosis" />
            <MonitorItem text="Pantau gejala: kelemahan otot, kram, disritmia" />
            <MonitorItem text="Kreatinin & urin output (koreksi K lebih lambat bila fungsi ginjal terganggu)" />
          </div>

          <DangerBox text="Jangan bolus KCl IV langsung — dapat menyebabkan cardiac arrest. Selalu via infus lambat dengan syringe pump." />
        </div>
      )}

      {ec?.status === 'hyper' && (
        <div className="ios-card" style={{ overflow: 'hidden' }}>
          <SectionHeader>Tatalaksana Hiperkalemia <Cite source="pals2020" /></SectionHeader>

          {/* Indikasi emergensi */}
          <div style={{ padding: '12px 16px', borderBottom: '0.5px solid var(--separator)', background: 'color-mix(in srgb, var(--sys-red) 5%, var(--bg-tertiary))' }}>
            <p style={{ font: 'var(--type-caption-2)', fontWeight: 700, color: 'var(--sys-red)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 6 }}>
              Indikasi Terapi Emergensi
            </p>
            <p style={{ font: 'var(--type-footnote)', color: 'var(--label-secondary)', lineHeight: 1.5 }}>
              K &gt; 6.5 mEq/L ATAU perubahan EKG: T peaked tinggi, PR memanjang, QRS lebar, sine wave, VF
            </p>
          </div>

          {/* Step 1 */}
          <div style={{ padding: '12px 16px', borderBottom: '0.5px solid var(--separator)' }}>
            <p style={{ font: 'var(--type-caption-2)', fontWeight: 700, color: 'var(--label-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 8 }}>
              Langkah 1 — Stabilisasi Membran (Onset 1–3 mnt)
            </p>
            <InfoRow label="Obat" value="Ca glukonat 10% IV" />
            <InfoRow label="Dosis" value="0.5–1 mL/kg IV (maks 20 mL)" />
            <InfoRow label="Cara pemberian" value="Infus lambat 5–10 menit, monitor EKG terus-menerus" />
            <InfoRow label="Durasi efek" value="30–60 menit → ulangi jika EKG changes menetap" />
            <p style={{ font: 'var(--type-caption-2)', color: 'var(--label-tertiary)', marginTop: 6, lineHeight: 1.4 }}>
              Catatan: CaCl2 10% lebih potent (3× elemental Ca/mL) tapi harus via CVC — risiko nekrosis jaringan bila ekstravasasi perifer
            </p>
          </div>

          {/* Step 2 */}
          <div style={{ padding: '12px 16px', borderBottom: '0.5px solid var(--separator)' }}>
            <p style={{ font: 'var(--type-caption-2)', fontWeight: 700, color: 'var(--label-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 8 }}>
              Langkah 2 — Shift K ke Intrasel (Onset 15–30 mnt, Durasi 2–4 jam)
            </p>
            <InfoRow label="Insulin reguler" value="0.1 U/kg IV + Dextrose 10% 5 mL/kg (atau D25% 2 mL/kg) bersamaan" />
            <InfoRow label="Salbutamol nebulisasi" value="< 10 kg: 2.5 mg; ≥ 10 kg: 5 mg nebulisasi — onset 30 menit" />
            <InfoRow label="NaHCO₃ (bila asidosis)" value="1–2 mEq/kg IV lambat — hanya bila pH < 7.2, tidak efektif tanpa asidosis" />
            <p style={{ font: 'var(--type-caption-2)', color: 'var(--label-tertiary)', marginTop: 6 }}>
              Semua tindakan Step 2 bisa dilakukan bersamaan untuk efek maksimal
            </p>
          </div>

          {/* Step 3 */}
          <div style={{ padding: '12px 16px', borderBottom: '0.5px solid var(--separator)' }}>
            <p style={{ font: 'var(--type-caption-2)', fontWeight: 700, color: 'var(--label-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 8 }}>
              Langkah 3 — Eliminasi K (Onset Jam–Hari)
            </p>
            <InfoRow label="Kayexalate (resin penukar)" value="1 g/kg PO/PR (maks 30 g) — tidak untuk preterm/neonatus" />
            <InfoRow label="Furosemide" value="1 mg/kg IV — hanya bila fungsi ginjal masih adekuat" />
            <InfoRow label="Dialisis (HD/CRRT)" value="Indikasi: gagal ginjal, K > 7 mEq/L, atau refrakter terhadap Step 1–2" />
          </div>

          {/* Monitoring */}
          <div style={{ padding: '12px 16px', borderBottom: '0.5px solid var(--separator)' }}>
            <p style={{ font: 'var(--type-caption-2)', fontWeight: 700, color: 'var(--label-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 8 }}>
              Monitoring
            </p>
            <MonitorItem text="EKG kontinu sampai K < 5.5 mEq/L dan perubahan EKG resolusi" />
            <MonitorItem text="K serum tiap 1–2 jam selama terapi aktif" />
            <MonitorItem text="Gula darah tiap 30–60 mnt setelah insulin (risiko hipoglikemia)" />
            <MonitorItem text="Tekanan darah, frekuensi napas, saturasi O₂" />
          </div>

          <DangerBox text="Step 1 (Ca) hanya stabilisasi sementara — TIDAK menurunkan K. Langkah 2 dan 3 HARUS segera menyusul." />
        </div>
      )}

      <TheoryAccordion sections={K_THEORY} />
    </>
  );
}

// ── Kalsium ───────────────────────────────────────────────────────────────
function CaSection() {
  const { weightKg } = usePatientStore();
  const [mode, setMode]       = useState<'total' | 'ionized'>('total');
  const [val, setVal]         = useState('');
  const [albumin, setAlbumin] = useState('');

  const wt    = Number(weightKg);
  const caNum = Number(val);
  const albNum = albumin.trim() ? Number(albumin) : null;

  const correctedCa = mode === 'total' && val.trim() && albNum != null
    ? correctCaForAlbumin(caNum, albNum)
    : null;

  const ecRaw  = val.trim()
    ? (mode === 'total' ? classifyCaTotal(caNum) : classifyCaIonized(caNum))
    : null;
  const ecCorr = correctedCa != null ? classifyCaTotal(correctedCa) : null;
  const ec     = ecCorr ?? ecRaw;
  const col    = ec ? severityColor(ec.severity, ec.status) : 'var(--label-tertiary)';
  const dose   = ec?.status === 'hypo' && wt > 0 ? calcCaGluconateVol(wt) : null;

  return (
    <>
      {/* Mode toggle */}
      <div style={{ padding: '0 16px', display: 'flex', gap: 6 }}>
        {([['total', 'Ca Total (mg/dL)'], ['ionized', 'iCa (mmol/L)']] as const).map(([m, label]) => (
          <button key={m} onClick={() => { setMode(m); setVal(''); setAlbumin(''); }}
            style={{
              padding: '6px 14px', borderRadius: 'var(--r-pill)', border: 'none', cursor: 'pointer',
              font: 'var(--type-footnote)', fontWeight: mode === m ? 600 : 400,
              background: mode === m ? 'var(--accent)' : 'var(--fill-secondary)',
              color: mode === m ? '#fff' : 'var(--label-primary)', transition: 'all var(--dur-fast)',
            }}>{label}</button>
        ))}
      </div>

      <ClassifyCard
        label={mode === 'total' ? 'Kalsium Total' : 'Kalsium Ionisasi'}
        unit={mode === 'total' ? 'mg/dL' : 'mmol/L'}
        placeholder={mode === 'total' ? '9.0' : '1.20'}
        normal={mode === 'total' ? '8.5–10.5 mg/dL' : '1.12–1.32 mmol/L'}
        value={val} onChange={setVal}
        ec={ecRaw} col={col}
      />

      {/* Koreksi albumin (total Ca mode only) */}
      {mode === 'total' && val.trim() && (
        <div className="ios-card" style={{ padding: '12px 16px' }}>
          <p style={{ font: 'var(--type-footnote)', fontWeight: 700, color: 'var(--label-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 8 }}>
            Koreksi Albumin (opsional)
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: albNum != null ? 10 : 0 }}>
            <span style={{ font: 'var(--type-subheadline)', color: 'var(--label-primary)', flex: 1 }}>Albumin</span>
            <input
              type="number" value={albumin} onChange={(e) => setAlbumin(e.target.value)}
              placeholder="4.0" min="0" max="8"
              style={{ width: 70, textAlign: 'right', borderRadius: 'var(--r-sm)', border: 'none', outline: 'none', background: 'var(--fill-tertiary)', color: 'var(--label-primary)', font: 'var(--type-body)', padding: '4px 8px', minHeight: 36 }}
            />
            <span style={{ font: 'var(--type-subheadline)', color: 'var(--label-secondary)' }}>g/dL</span>
          </div>
          {correctedCa != null && (
            <ResultRow
              label="Ca terkoreksi"
              value={correctedCa} unit="mg/dL"
              note={`Ca + 0.8 × (4 − ${albNum})`}
              tint={severityColor(ecCorr!.severity, ecCorr!.status)}
            />
          )}
        </div>
      )}

      {ec?.status === 'hypo' && (
        <div className="ios-card" style={{ overflow: 'hidden' }}>
          <SectionHeader>Koreksi Hipokalsemia <Cite source="pals2020" /></SectionHeader>

          {/* Kalkulasi */}
          <div style={{ padding: '12px 16px', borderBottom: '0.5px solid var(--separator)' }}>
            <p style={{ font: 'var(--type-caption-2)', fontWeight: 700, color: 'var(--label-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 8 }}>
              Volume Ca Glukonat 10% IV
            </p>
            {wt > 0 && dose ? (
              <>
                <ResultRow label="Dosis rendah (simtomatik ringan)" value={dose.lowMl} unit="mL" note="0.5 mL/kg" />
                <div style={{ height: '0.5px', background: 'var(--separator)', margin: '10px 0' }} />
                <ResultRow label="Dosis penuh (tetani / kejang)" value={dose.highMl} unit="mL" note="1 mL/kg (maks 20 mL)" />
              </>
            ) : (
              <p style={{ font: 'var(--type-caption-1)', color: 'var(--label-tertiary)' }}>Masukkan berat badan pasien.</p>
            )}
          </div>

          {/* Perbandingan sediaan */}
          <div style={{ padding: '12px 16px', borderBottom: '0.5px solid var(--separator)' }}>
            <p style={{ font: 'var(--type-caption-2)', fontWeight: 700, color: 'var(--label-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 8 }}>
              Sediaan Ca: Glukonat vs Klorida
            </p>
            <InfoRow label="Ca glukonat 10%" value="9 mg elemental Ca/mL — aman via perifer (pilihan utama)" />
            <InfoRow label="CaCl₂ 10%" value="27 mg elemental Ca/mL — 3× lebih potent, HARUS via CVC (nekrosis perifer)" />
            <InfoRow label="Pengenceran IV" value="Encerkan 1:1 dengan D5% atau NaCl 0.9% sebelum infus" />
          </div>

          {/* Protokol */}
          <div style={{ padding: '12px 16px', borderBottom: '0.5px solid var(--separator)' }}>
            <p style={{ font: 'var(--type-caption-2)', fontWeight: 700, color: 'var(--label-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 8 }}>
              Langkah Pemberian
            </p>
            <ProtocolStep n={1} text="Pasang monitor EKG sebelum mulai infus" />
            <ProtocolStep n={2} text="Infus lambat: 1 mL/kg/jam (max rate — jangan lebih cepat)" />
            <ProtocolStep n={3} text="Durasi minimum: 10 menit untuk dosis penuh" />
            <ProtocolStep n={4} text="JANGAN campur dengan NaHCO₃ dalam satu jalur — akan mengendap (Ca carbonate)" />
            <ProtocolStep n={5} text="Setelah akut stabil: suplementasi oral Ca elemental 45–65 mg/kg/hari + Vitamin D" />
            <ProtocolStep n={6} text="Bila refrakter → cek dan koreksi Mg (hipoMg → PTH tidak bisa sekresi)" />
          </div>

          {/* Monitoring */}
          <div style={{ padding: '12px 16px', borderBottom: '0.5px solid var(--separator)' }}>
            <p style={{ font: 'var(--type-caption-2)', fontWeight: 700, color: 'var(--label-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 8 }}>
              Monitoring
            </p>
            <MonitorItem text="EKG kontinu selama infus: bila bradikardia → perlambat atau hentikan" />
            <MonitorItem text="Gejala klinis: cek Chvostek, Trousseau tiap jam" />
            <MonitorItem text="Ca total / iCa ulang 4–6 jam setelah infus" />
            <MonitorItem text="Pantau lokasi IV: Ca glukonat tetap bisa menyebabkan flebitis" />
          </div>

          <DangerBox text="Infus Ca terlalu cepat → bradikardia berat, henti jantung. Selalu infus lambat ≥ 10 menit dan monitor EKG terus-menerus." />
        </div>
      )}

      <TheoryAccordion sections={CA_THEORY} />
    </>
  );
}

// ── Magnesium ─────────────────────────────────────────────────────────────
function MgSection() {
  const { weightKg } = usePatientStore();
  const [val, setVal] = useState('');
  const wt  = Number(weightKg);
  const mg  = Number(val);
  const ec  = val.trim() ? classifyMg(mg)  : null;
  const col = ec ? severityColor(ec.severity, ec.status) : 'var(--label-tertiary)';
  const dose = ec?.status === 'hypo' && wt > 0 ? calcMgSO4Vol(wt) : null;

  return (
    <>
      <ClassifyCard
        label="Magnesium (Mg²⁺)"
        unit="mg/dL" placeholder="2.0"
        normal="1.7–2.4 mg/dL"
        value={val} onChange={setVal}
        ec={ec} col={col}
      />

      {ec?.status === 'hypo' && (
        <div className="ios-card" style={{ overflow: 'hidden' }}>
          <SectionHeader>Koreksi Hipomagnesemia <Cite source="greenbaum2020" /></SectionHeader>

          {/* Kalkulasi */}
          <div style={{ padding: '12px 16px', borderBottom: '0.5px solid var(--separator)' }}>
            <p style={{ font: 'var(--type-caption-2)', fontWeight: 700, color: 'var(--label-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 8 }}>
              Dosis MgSO₄ 50% IV
            </p>
            {wt > 0 && dose ? (
              <>
                <ResultRow label="Dosis rendah" value={dose.lowMg} unit="mg" note={`25 mg/kg → ${dose.lowMl} mL MgSO₄ 50%`} />
                <div style={{ height: '0.5px', background: 'var(--separator)', margin: '10px 0' }} />
                <ResultRow label="Dosis penuh" value={dose.highMg} unit="mg" note={`50 mg/kg → ${dose.highMl} mL MgSO₄ 50% (maks 2000 mg)`} />
              </>
            ) : (
              <p style={{ font: 'var(--type-caption-1)', color: 'var(--label-tertiary)' }}>Masukkan berat badan pasien.</p>
            )}
          </div>

          {/* Persiapan */}
          <div style={{ padding: '12px 16px', borderBottom: '0.5px solid var(--separator)' }}>
            <p style={{ font: 'var(--type-caption-2)', fontWeight: 700, color: 'var(--label-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 8 }}>
              Persiapan & Cara Pemberian
            </p>
            <InfoRow label="Pengenceran" value="Encerkan MgSO₄ 50% ke konsentrasi 20–50 mg/mL (mis: 2 g + 50 mL NaCl 0.9% = 40 mg/mL)" />
            <InfoRow label="Rate infus" value="Berikan dalam 15–30 menit via syringe pump — JANGAN bolus" />
            <InfoRow label="Maks dosis tunggal" value="2000 mg (4 mL MgSO₄ 50% yang tidak diencerkan)" />
            <InfoRow label="Ulangi" value="Boleh ulangi setelah 4–6 jam bila Mg masih rendah" />
          </div>

          {/* Protokol klinis */}
          <div style={{ padding: '12px 16px', borderBottom: '0.5px solid var(--separator)' }}>
            <p style={{ font: 'var(--type-caption-2)', fontWeight: 700, color: 'var(--label-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 8 }}>
              Langkah Klinis
            </p>
            <ProtocolStep n={1} text="Cek K dan Ca — koreksi Mg sering diperlukan bersama hipokalemia/hipokalsemia refrakter" />
            <ProtocolStep n={2} text="Encerkan MgSO₄ 50% — jangan berikan pekat langsung" />
            <ProtocolStep n={3} text="Infus 15–30 menit, pasang monitor tekanan darah kontinu" />
            <ProtocolStep n={4} text="Cek refleks patella TIAP 15 MENIT selama infus (indikator toksisitas paling sensitif)" />
            <ProtocolStep n={5} text="Bila refleks patella menghilang → STOP infus segera, berikan antidot Ca glukonat" />
            <ProtocolStep n={6} text="Cek ulang Mg serum setelah 4–6 jam, ulangi dosis jika perlu" />
          </div>

          {/* Monitoring */}
          <div style={{ padding: '12px 16px', borderBottom: '0.5px solid var(--separator)' }}>
            <p style={{ font: 'var(--type-caption-2)', fontWeight: 700, color: 'var(--label-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 8 }}>
              Monitoring (Setiap 15 Menit)
            </p>
            <MonitorItem text="Refleks patella: hilang → toksisitas Mg → STOP infus" />
            <MonitorItem text="Frekuensi napas: < 12/mnt → kurangi rate atau hentikan" />
            <MonitorItem text="Tekanan darah: hipotensi → perlambat infus" />
            <MonitorItem text="Saturasi O₂ dan status kesadaran" />
          </div>

          <DangerBox text="ANTIDOT: Ca glukonat 10% 0.5–1 mL/kg IV segera bila toksisitas (refleks hilang, depresi napas). Siapkan di samping pasien sebelum mulai infus MgSO₄." />
        </div>
      )}

      {ec?.status === 'hyper' && (
        <div className="ios-card" style={{ overflow: 'hidden' }}>
          <SectionHeader>Tatalaksana Hipermagnesemia</SectionHeader>

          {/* Klasifikasi berdasarkan kadar */}
          <div style={{ padding: '12px 16px', borderBottom: '0.5px solid var(--separator)' }}>
            <p style={{ font: 'var(--type-caption-2)', fontWeight: 700, color: 'var(--label-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 8 }}>
              Manifestasi Berdasarkan Kadar Mg
            </p>
            <InfoRow label="2.4–4 mg/dL" value="Flush, mual, letargi — monitor ketat" />
            <InfoRow label="4–8 mg/dL" value="Depresi refleks, hipotensi, EKG changes" />
            <InfoRow label="8–12 mg/dL" value="Depresi napas, henti napas — emergensi" />
            <InfoRow label="> 15 mg/dL" value="Henti jantung — dialisis segera" />
          </div>

          {/* Protokol */}
          <div style={{ padding: '12px 16px', borderBottom: '0.5px solid var(--separator)' }}>
            <p style={{ font: 'var(--type-caption-2)', fontWeight: 700, color: 'var(--label-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 8 }}>
              Langkah Tatalaksana
            </p>
            <ProtocolStep n={1} text="HENTIKAN semua sumber Mg (antasid, enema, infus MgSO₄)" />
            <ProtocolStep n={2} text="Bila simtomatik: Ca glukonat 10% 0.5–1 mL/kg IV segera (antidot fisiologis, onset menit)" />
            <ProtocolStep n={3} text="Hidrasi: NaCl 0.9% 10–20 mL/kg untuk meningkatkan ekskresi renal" />
            <ProtocolStep n={4} text="Furosemide 1 mg/kg IV bila fungsi ginjal baik (mendorong ekskresi Mg)" />
            <ProtocolStep n={5} text="Dialisis (HD/CRRT): indikasi gagal ginjal, Mg > 12 mg/dL, atau depresi napas berat" />
          </div>

          {/* Monitoring */}
          <div style={{ padding: '12px 16px', borderBottom: '0.5px solid var(--separator)' }}>
            <p style={{ font: 'var(--type-caption-2)', fontWeight: 700, color: 'var(--label-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 8 }}>
              Monitoring
            </p>
            <MonitorItem text="Refleks patella tiap 15 menit" />
            <MonitorItem text="Frekuensi napas, SpO₂, EKG" />
            <MonitorItem text="Mg serum tiap 2–4 jam" />
            <MonitorItem text="Siap intubasi bila ada tanda depresi napas" />
          </div>

          <DangerBox text="Ca glukonat adalah antidot, BUKAN terapi definitif. Harus diikuti dengan eliminasi Mg (diuresis atau dialisis)." />
        </div>
      )}

      <TheoryAccordion sections={MG_THEORY} />
    </>
  );
}

// ── Shared UI helpers ─────────────────────────────────────────────────────
function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ padding: '10px 16px 8px', borderBottom: '0.5px solid var(--separator)' }}>
      <p style={{ font: 'var(--type-caption-2)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--label-secondary)' }}>
        {children}
      </p>
    </div>
  );
}

function ProtocolStep({ n, text }: { n: number; text: string }) {
  return (
    <div style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
      <span style={{
        flexShrink: 0, width: 20, height: 20, borderRadius: '50%',
        background: 'var(--accent)', color: '#fff',
        font: 'var(--type-caption-2)', fontWeight: 700,
        display: 'grid', placeItems: 'center',
      }}>{n}</span>
      <p style={{ font: 'var(--type-footnote)', color: 'var(--label-secondary)', lineHeight: 1.5, marginTop: 1 }}>{text}</p>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', gap: 8, marginBottom: 6, alignItems: 'flex-start' }}>
      <span style={{ flexShrink: 0, font: 'var(--type-caption-1)', fontWeight: 600, color: 'var(--label-primary)', minWidth: 120 }}>{label}</span>
      <span style={{ font: 'var(--type-caption-1)', color: 'var(--label-secondary)', lineHeight: 1.4 }}>{value}</span>
    </div>
  );
}

function MonitorItem({ text }: { text: string }) {
  return (
    <div style={{ display: 'flex', gap: 6, marginBottom: 5 }}>
      <span style={{ flexShrink: 0, color: 'var(--accent)', font: 'var(--type-caption-1)' }}>•</span>
      <p style={{ font: 'var(--type-caption-1)', color: 'var(--label-secondary)', lineHeight: 1.4 }}>{text}</p>
    </div>
  );
}

function DangerBox({ text }: { text: string }) {
  return (
    <div style={{ padding: '10px 16px', background: 'color-mix(in srgb, var(--sys-orange) 10%, var(--bg-tertiary))' }}>
      <p style={{ font: 'var(--type-caption-2)', color: 'var(--sys-orange)', lineHeight: 1.5, fontWeight: 600 }}>
        ⚠ {text}
      </p>
    </div>
  );
}

// ── Shared components ─────────────────────────────────────────────────────
function ClassifyCard({ label, unit, placeholder, normal, value, onChange, ec, col }: {
  label: string; unit: string; placeholder: string; normal: string;
  value: string; onChange: (v: string) => void;
  ec: ElectClass | null; col: string;
}) {
  return (
    <div className="ios-card" style={{ overflow: 'hidden' }}>
      <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '0.5px solid var(--separator)' }}>
        <div style={{ flex: 1 }}>
          <span style={{ font: 'var(--type-subheadline)', color: 'var(--label-primary)', fontWeight: 600 }}>{label}</span>
          <span style={{ font: 'var(--type-caption-1)', color: 'var(--label-tertiary)', marginLeft: 6 }}>({unit})</span>
        </div>
        <input
          type="number" value={value} onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={{
            width: 90, textAlign: 'right', borderRadius: 'var(--r-sm)',
            border: 'none', outline: 'none', background: 'var(--fill-tertiary)',
            color: 'var(--label-primary)', font: 'var(--type-body)', padding: '4px 10px', minHeight: 36,
          }}
        />
      </div>
      <div style={{ padding: '10px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ font: 'var(--type-caption-1)', color: 'var(--label-tertiary)' }}>Normal: {normal}</span>
        {ec ? (
          <span style={{
            font: 'var(--type-caption-2)', fontWeight: 700,
            color: col,
            background: `color-mix(in srgb, ${col} 12%, transparent)`,
            padding: '3px 10px', borderRadius: 'var(--r-pill)',
          }}>
            {ec.status !== 'normal' ? `${STATUS_LABEL[ec.status]}-` : ''}{ec.status === 'normal' ? 'Normal' : `${label.split(' ')[0].slice(0,2).toLowerCase()}emia`} · {SEVERITY_LABEL[ec.severity]}
          </span>
        ) : (
          <span style={{ font: 'var(--type-caption-2)', color: 'var(--label-tertiary)' }}>—</span>
        )}
      </div>
    </div>
  );
}

function ResultRow({ label, value, unit, note, tint }: {
  label: string; value: number; unit: string; note: string; tint?: string;
}) {
  const c = tint ?? 'var(--accent)';
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
      <div>
        <p style={{ font: 'var(--type-subheadline)', color: 'var(--label-primary)' }}>{label}</p>
        <p style={{ font: 'var(--type-caption-2)', fontFamily: 'var(--font-mono)', color: 'var(--label-tertiary)', marginTop: 2 }}>{note}</p>
      </div>
      <div style={{ textAlign: 'right' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 24, fontWeight: 700, color: c }}>
          {value % 1 === 0 ? value : value.toFixed(1)}
        </span>
        <span style={{ font: 'var(--type-footnote)', color: 'var(--label-secondary)', marginLeft: 4 }}>{unit}</span>
      </div>
    </div>
  );
}

// ── Theory content ────────────────────────────────────────────────────────
const NA_THEORY: TheorySection[] = [
  {
    title: 'Definisi & Klasifikasi',
    content: `Hiponatremia: Na < 135 mEq/L
• Ringan: 130–134 · Sedang: 125–129 · Berat: < 125

Hipernatremia: Na > 145 mEq/L
• Ringan: 146–150 · Sedang: 151–160 · Berat: > 160

Hiponatremia adalah gangguan elektrolit tersering pada pasien rawat inap anak.`,
  },
  {
    title: 'Manifestasi Klinis',
    content: `Hiponatremia (terutama bila akut atau berat):
• Mual, sakit kepala, letargi, konfusi
• Kejang, koma → berat mengancam nyawa
• Edema serebral

Hipernatremia:
• Iritabilitas, letargi, high-pitched cry (bayi)
• Spastisitas, kejang (bila berat)
• Demam, mukosa kering`,
  },
  {
    title: 'Penyebab Tersering (Anak)',
    content: `Hiponatremia:
• Cairan IV hipotonik berlebihan (iatrogenik tersering)
• Gastroenteritis dengan rehidrasi air bebas berlebih
• SIADH (post-operatif, meningitis, pneumonia)
• Sindrom nefrotik, gagal jantung

Hipernatremia:
• Asupan tidak adekuat (neonatus/bayi ASI eksklusif)
• Diare osmotik atau diabetes insipidus
• Cairan IV hipertonik berlebihan`,
  },
  {
    title: 'Prinsip Koreksi',
    content: `Hiponatremia simtomatik (kejang/koma):
→ 3% NaCl 2 mEq/kg (≈ 4 mL/kg) IV dalam 10–20 menit
→ Ulangi bila gejala menetap
→ Target: Na naik 2–4 mEq/L atau gejala teratasi
→ Setelah gejala membaik: koreksi lambat, maks 8–10 mEq/L/24 jam

Hipernatremia:
→ Hitung defisit air bebas, ganti bertahap 48–72 jam
→ Maks penurunan 0.5 mEq/L/jam atau 10–12 mEq/L/24 jam
→ Koreksi terlalu cepat → edema serebral (herniasi)`,
  },
  {
    title: 'Monitoring',
    content: `• Cek ulang Na serum 2–4 jam setelah mulai koreksi
• Monitor output urin dan berat badan setiap 4–6 jam
• Bila SIADH: restriksi cairan, koreksi penyakit dasar
• Hindari koreksi hiponatremia > 10 mEq/L/24 jam → risiko ODS (Osmotic Demyelination Syndrome)
• Tanda bahaya: penurunan kesadaran tiba-tiba saat koreksi`,
  },
];

const K_THEORY: TheorySection[] = [
  {
    title: 'Definisi & Klasifikasi',
    content: `Hipokalemia: K < 3.5 mEq/L
• Ringan: 3.0–3.4 · Sedang: 2.5–2.9 · Berat: < 2.5

Hiperkalemia: K > 5.5 mEq/L
• Ringan: 5.5–6.0 · Sedang: 6.0–6.5 · Berat: > 6.5

Catatan: Neonatus memiliki nilai K normal lebih tinggi (3.5–6.0 mEq/L). Pseudohiperkalemia karena hemolisis spesimen harus disingkirkan.`,
  },
  {
    title: 'Manifestasi Klinis',
    content: `Hipokalemia:
• Kelemahan otot (paralisis flaksid pada berat)
• Kram, konstipasi, ileus
• EKG: T mendatar/inversi, U wave, ST depresi, PR memanjang

Hiperkalemia:
• Kelemahan otot, parastesia
• EKG: T tall peaked → PR memanjang → QRS lebar → sine wave → VF
• Hiperkalemia > 6.5 + EKG changes = EMERGENSI`,
  },
  {
    title: 'Penyebab Tersering',
    content: `Hipokalemia:
• Diare, muntah berkepanjangan (kehilangan GI)
• Diuretik (furosemid, tiazid)
• Alkalosis metabolik
• Kurang asupan (malnutrisi, anoreksia)
• Sindrom Bartter/Gitelman

Hiperkalemia:
• Gagal ginjal akut/kronik (tersering)
• Asidosis metabolik (distribusi K keluar sel)
• Hemolisis masif, rhabdomiolisis
• Insufisiensi adrenal, hipoaldosteronisme
• Obat: ACEi, ARB, spironolakton, succinylcholin`,
  },
  {
    title: 'Prinsip Koreksi',
    content: `Hipokalemia:
→ Koreksi penyebab (diare, diuretik)
→ Ringan-sedang: suplementasi oral (KCl) bila bisa
→ Sedang-berat: KCl IV 0.2–0.5 mEq/kg/dosis dalam 1–2 jam
→ Monitor EKG selama infus IV
→ Koreksi Mg bersamaan bila hipomagnesemia ada (Mg defisiensi mencegah koreksi K)

Hiperkalemia (urutan prioritas):
1. Ca glukonat (stabilisasi membran, onset 1–3 menit)
2. Insulin + dextrose / salbutamol (shift intrasel, onset 15–30 menit)
3. Kayexalate / diuretik / dialisis (eliminasi K, onset jam–hari)`,
  },
];

const CA_THEORY: TheorySection[] = [
  {
    title: 'Definisi & Nilai Normal',
    content: `Ca Total (serum):
• Normal: 8.5–10.5 mg/dL (anak > 1 bulan)
• Neonatus (< 7 hari): batas bawah ~7.0 mg/dL

Ca Ionisasi (iCa):
• Normal: 1.12–1.32 mmol/L
• iCa lebih mencerminkan fungsi fisiologis

Koreksi Albumin:
• Ca terkoreksi = Ca terukur + 0.8 × (4 − albumin)
• Penting: hipoalbuminemia menyebabkan Ca total rendah palsu`,
  },
  {
    title: 'Manifestasi Klinis',
    content: `Hipokalsemia:
• Tanda Chvostek (+): ketukan N. facialis → kedutan
• Tanda Trousseau (+): manset tensimeter > sistolik 3 mnt → spasme karpal
• Tetani, laringospasme, bronkospasme
• Kejang (neonatus dan bayi)
• EKG: QTc memanjang

Hiperkalsemia:
• "Bones, Stones, Groans, Psychic Moans"
• Kelemahan, mual, poliuria, konstipasi
• EKG: QTc memendek`,
  },
  {
    title: 'Penyebab Tersering',
    content: `Hipokalsemia:
• Hipoparatiroidisme (pasca tiroid/paratiroid, DiGeorge)
• Defisiensi vitamin D (rakhitis)
• Hipomagnesemia (mencegah sekresi PTH)
• Alkalosis (menurunkan fraksi iCa)
• Neonatal: prematuritas, asfiksia, ibu diabetes

Hiperkalsemia:
• Hiperparatiroidisme primer
• Keganasan (PTHrP)
• Intoksikasi vitamin D
• Imobilisasi berkepanjangan
• Williams syndrome`,
  },
  {
    title: 'Tatalaksana',
    content: `Hipokalsemia simtomatik:
→ Ca glukonat 10% IV 0.5–1 mL/kg, infus ≥ 10 menit
→ Monitor EKG selama infus (risiko bradikardia)
→ Setelah akut stabil: suplemen oral Ca + Vitamin D

Hiperkalsemia:
→ Hidrasi agresif NaCl 0.9%: 10–20 mL/kg kemudian maintenance × 2
→ Furosemid setelah rehidrasi adekuat
→ Kortikosteroid (bila karena vitamin D, keganasan hematologi)
→ Pamidronate / bisphosphonate (bila berat)
→ Dialisis (bila gagal ginjal atau sangat berat)`,
  },
];

const MG_THEORY: TheorySection[] = [
  {
    title: 'Definisi & Nilai Normal',
    content: `Normal: 1.7–2.4 mg/dL (0.70–0.99 mmol/L)

Hipomagnesemia: < 1.7 mg/dL
• Ringan: 1.2–1.6 · Sedang: 0.8–1.1 · Berat: < 0.8

Hipermagnesemia: > 2.4 mg/dL
• Lebih jarang; umumnya iatrogenik (terapi Mg berlebihan)`,
  },
  {
    title: 'Manifestasi Klinis',
    content: `Hipomagnesemia:
• Tremor, fasikulasi, tetani (mirip hipokalsemia)
• Refrakter terhadap koreksi K dan Ca (Mg mengatur transport keduanya)
• EKG: T inversi, QT memanjang, aritmia
• Kejang pada berat

Hipermagnesemia:
• Flush, mual, kelemahan otot
• Depresi refleks patella (tanda penting!)
• Depresi napas (Mg > 5 mg/dL)
• Blok jantung, henti jantung (Mg > 15 mg/dL)`,
  },
  {
    title: 'Penyebab & Keterkaitan',
    content: `Hipomagnesemia:
• Malabsorpsi / malnutrisi
• Diuretik loop atau tiazid
• Diare kronik
• Diabetes mellitus (glikosuria membawa Mg)
• Refeeding syndrome

Keterkaitan klinis penting:
• Hipomagnesemia sering menyertai hipokalemia dan hipokalsemia yang sulit dikoreksi
• Selalu cek dan koreksi Mg bila K atau Ca refrakter terhadap terapi

Hipermagnesemia:
• Terapi tokolisis dengan MgSO4 pada ibu
• Pemberian Mg berlebihan pada eklampsia/preeklampsia
• Gagal ginjal dengan pemberian antasid Mg`,
  },
  {
    title: 'Prinsip Koreksi',
    content: `Hipomagnesemia simtomatik / sedang-berat:
→ MgSO4 50%: 25–50 mg/kg IV (maks 2000 mg per dosis)
→ Infus dalam 15–30 menit (jangan bolus)
→ Monitor: tekanan darah, frekuensi napas, refleks patella tiap 15 menit
→ Ulangi setelah 4–6 jam bila Mg masih rendah

Antidot MgSO4 (bila toksisitas):
→ Ca glukonat 10%: 0.5–1 mL/kg IV segera
→ Oksigen, bantu napas bila depresi napas

Hipermagnesemia:
→ Hentikan semua sumber Mg
→ Ca glukonat sebagai antidot fisiologis
→ Diuretik loop bila ginjal baik
→ Dialisis bila gagal ginjal atau berat`,
  },
];
