import { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Disclaimer } from '../Disclaimer';
import { Cite } from '../Citation';
import { usePatientStore } from '../../store/patientStore';
import {
  calculateMaintenance,
  calculateResuscitationBolus,
  calculateDehydrationCorrection,
  type DehydrationDegree,
} from '../../utils/fluids';

type FluidTab = 'maintenance' | 'resusitasi' | 'dehidrasi';

const TABS: { id: FluidTab; label: string }[] = [
  { id: 'maintenance', label: 'Maintenance' },
  { id: 'resusitasi',  label: 'Resusitasi'  },
  { id: 'dehidrasi',   label: 'Dehidrasi'   },
];

export function FluidCalculator() {
  const { weightKg } = usePatientStore();
  const [tab, setTab] = useState<FluidTab>('maintenance');

  const weightNum = Number(weightKg);
  const validWeight = weightKg.trim() !== '' && Number.isFinite(weightNum) && weightNum > 0;

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold">Cairan</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Maintenance <Cite source="holliday1957" /> · Resusitasi <Cite source="pals2020" />.
        </p>
      </div>

      <div className="flex gap-1">
        {TABS.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex-1 py-2 rounded-full text-sm font-medium transition-colors ${
              tab === t.id
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {!validWeight && (
        <Card><CardContent className="pt-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">Masukkan berat badan pasien untuk menghitung.</p>
        </CardContent></Card>
      )}

      {validWeight && tab === 'maintenance' && <MaintenanceSection weight={weightNum} />}
      {validWeight && tab === 'resusitasi'  && <ResuscitationSection weight={weightNum} />}
      {validWeight && tab === 'dehidrasi'   && <DehydrationSection weight={weightNum} />}

      <Disclaimer />
    </div>
  );
}

function MaintenanceSection({ weight }: { weight: number }) {
  let result: ReturnType<typeof calculateMaintenance> | null = null;
  let error: string | null = null;
  try { result = calculateMaintenance(weight); } catch (e) { error = e instanceof Error ? e.message : ''; }

  if (error) return <ErrorCard text={error} />;
  if (!result) return null;

  return (
    <>
      <ResultGrid>
        <BigResult label="mL/jam" value={result.mlPerHour.toFixed(1)} />
        <BigResult label="mL/24 jam" value={result.mlPer24Hours.toFixed(0)} />
      </ResultGrid>
      <Card>
        <CardContent className="pt-4 space-y-1 text-sm">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
            Holliday-Segar (4-2-1) <Cite source="holliday1957" />
          </p>
          <p className="font-mono text-slate-600 dark:text-slate-300">{result.breakdown}</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 pt-1">
            ≤10 kg: 4 mL/kg/jam · 10–20 kg: +2/kg · &gt;20 kg: +1/kg
          </p>
        </CardContent>
      </Card>
    </>
  );
}

function ResuscitationSection({ weight }: { weight: number }) {
  const r10 = calculateResuscitationBolus(weight, 10);
  const r20 = calculateResuscitationBolus(weight, 20);

  return (
    <>
      <Card>
        <CardContent className="pt-4 space-y-4">
          <BolusTile label="Bolus 10 mL/kg" note="sepsis tanpa hipovolemia" value={r10.bolusMl} />
          <BolusTile label="Bolus 20 mL/kg" note="standar resusitasi" value={r20.bolusMl} preferred />
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-4 text-xs text-slate-500 dark:text-slate-400 space-y-1">
          <p>Cairan: NaCl 0.9% atau Ringer Laktat. Berikan dalam 5–20 menit IV/IO.</p>
          <p>Ulangi bolus sesuai respons (max 60 mL/kg kecuali kontraindikasi). <Cite source="pals2020" /></p>
        </CardContent>
      </Card>
    </>
  );
}

function DehydrationSection({ weight }: { weight: number }) {
  const [degree, setDegree] = useState<DehydrationDegree>('sedang');

  let result: ReturnType<typeof calculateDehydrationCorrection> | null = null;
  try { result = calculateDehydrationCorrection(weight, degree); } catch { /* handled */ }

  return (
    <>
      <Card>
        <CardContent className="pt-4 space-y-3">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Derajat Dehidrasi</p>
          <div className="grid grid-cols-3 gap-2">
            {(['ringan', 'sedang', 'berat'] as DehydrationDegree[]).map((d) => (
              <button key={d} onClick={() => setDegree(d)}
                className={`min-h-[48px] rounded-xl border text-sm font-medium capitalize transition-colors ${
                  degree === d
                    ? 'border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                }`}>
                {d}<br />
                <span className="text-xs opacity-60">
                  {d === 'ringan' ? '5%' : d === 'sedang' ? '10%' : '15%'}
                </span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardContent className="pt-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <SmallResult label="Defisit" value={`${result.deficitMl} mL`} />
              <SmallResult label="Total 24 jam" value={`${result.totalMl} mL`} />
            </div>
            <div className="space-y-2 pt-1">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 dark:text-slate-400">Fase 1 (8 jam pertama)</span>
                <span className="font-bold">{result.phase1Ml} mL</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 dark:text-slate-400">Fase 2 (16 jam berikutnya)</span>
                <span className="font-bold">{result.phase2Ml} mL</span>
              </div>
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              ½ defisit + ⅓ maintenance fase 1 · ½ defisit + ⅔ maintenance fase 2
            </p>
          </CardContent>
        </Card>
      )}
    </>
  );
}

/* ── Sub-komponen kecil ─────────────────────────────────────────────────── */
function ResultGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-2 gap-3">{children}</div>;
}

function BigResult({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/30 p-4 text-center">
      <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{value}</div>
      <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{label}</div>
    </div>
  );
}

function SmallResult({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-3 text-center">
      <div className="text-xl font-bold">{value}</div>
      <div className="text-xs text-slate-500 dark:text-slate-400">{label}</div>
    </div>
  );
}

function BolusTile({ label, note, value, preferred }: {
  label: string; note: string; value: number; preferred?: boolean;
}) {
  return (
    <div className={`rounded-xl border p-4 flex items-center justify-between ${
      preferred
        ? 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/20'
        : 'border-slate-200 dark:border-slate-700'
    }`}>
      <div>
        <div className="text-sm font-medium">{label}</div>
        <div className="text-xs text-slate-500 dark:text-slate-400">{note}</div>
      </div>
      <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
        {value}
        <span className="text-sm font-normal text-slate-400 ml-1">mL</span>
      </div>
    </div>
  );
}

function ErrorCard({ text }: { text: string }) {
  return (
    <Card><CardContent className="pt-4"><p className="text-sm text-destructive">{text}</p></CardContent></Card>
  );
}

