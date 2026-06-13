import { useState } from 'react';
import { Wind, Zap, Droplets, FlaskConical, Beaker, ChevronLeft } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { PatientInput } from '../components/PatientInput';
import { EttCalculator } from '../components/calculators/EttCalculator';
import { EmergencyDrugsCalculator } from '../components/calculators/EmergencyDrugsCalculator';
import { SyringePumpCalculator } from '../components/calculators/SyringePumpCalculator';
import { AbgInterpreter } from '../components/calculators/AbgInterpreter';
import { ElectrolyteCalculator } from '../components/calculators/ElectrolyteCalculator';

type CalcId = 'ett' | 'dosis' | 'syringe' | 'agd' | 'elektrolit';

interface CalcCard {
  id: CalcId;
  label: string;
  desc: string;
  icon: LucideIcon;
  tintClass: string;
  tintColor: string;
}

const CALCULATORS: CalcCard[] = [
  {
    id: 'ett', label: 'ETT & Intubasi',
    desc: 'Ukuran tube + kedalaman insersi',
    icon: Wind, tintClass: 'tint-resp', tintColor: 'var(--sys-teal)',
  },
  {
    id: 'dosis', label: 'Dosis Emergensi',
    desc: 'Obat resusitasi berbasis berat',
    icon: Zap, tintClass: 'tint-vital', tintColor: 'var(--sys-red)',
  },
  {
    id: 'syringe', label: 'Syringe Pump',
    desc: 'Kecepatan infus kontinu',
    icon: Droplets, tintClass: 'tint-drug', tintColor: 'var(--sys-indigo)',
  },
  {
    id: 'agd', label: 'Analisis Gas Darah',
    desc: 'Boston Rules · AG · P/F Ratio',
    icon: FlaskConical, tintClass: 'tint-resp', tintColor: 'var(--sys-teal)',
  },
  {
    id: 'elektrolit', label: 'Elektrolit',
    desc: 'Na · K · Ca · Mg — koreksi & teori',
    icon: Beaker, tintClass: 'tint-renal', tintColor: 'var(--sys-mint)',
  },
];

export function Kalkulator() {
  const [active, setActive] = useState<CalcId | null>(null);

  return (
    <div className="ios-screen pb-6">
      <div style={{ padding: '24px 20px 8px', display: 'flex', alignItems: 'center', gap: 12 }}>
        {active ? (
          <>
            <button
              onClick={() => setActive(null)}
              style={{
                display: 'flex', alignItems: 'center', gap: 2,
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--accent)', font: 'var(--type-body)',
                padding: '0 4px 0 0',
              }}
            >
              <ChevronLeft size={20} strokeWidth={2} />
              Kalkulator
            </button>
          </>
        ) : (
          <h1 className="ios-large-title">Kalkulator</h1>
        )}
      </div>

      <PatientInput />

      {active === null ? (
        /* ── Card grid ── */
        <div style={{ padding: '16px 16px 0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {CALCULATORS.map((card) => (
            <CalcCardButton key={card.id} card={card} onSelect={() => setActive(card.id)} />
          ))}
        </div>
      ) : (
        /* ── Active calculator ── */
        <div style={{ marginTop: 16 }}>
          {active === 'ett'    && <EttCalculator />}
          {active === 'dosis'  && <EmergencyDrugsCalculator />}
          {active === 'syringe'&& <SyringePumpCalculator />}
          {active === 'agd'       && <AbgInterpreter />}
          {active === 'elektrolit'&& <ElectrolyteCalculator />}
        </div>
      )}
    </div>
  );
}

function CalcCardButton({ card, onSelect }: { card: CalcCard; onSelect: () => void }) {
  const Icon = card.icon;
  return (
    <button
      onClick={onSelect}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
        gap: 10, padding: '16px 14px',
        background: 'var(--bg-tertiary)',
        borderRadius: 'var(--r-card)',
        border: 'none', cursor: 'pointer',
        boxShadow: 'var(--shadow-1)',
        textAlign: 'left',
        transition: 'transform var(--dur-fast)',
        WebkitTapHighlightColor: 'transparent',
      }}
      onPointerDown={(e) => { (e.currentTarget.style.transform = 'scale(0.97)'); }}
      onPointerUp={(e)   => { (e.currentTarget.style.transform = 'scale(1)'); }}
      onPointerLeave={(e)=> { (e.currentTarget.style.transform = 'scale(1)'); }}
    >
      <span
        className={card.tintClass}
        style={{
          width: 40, height: 40, borderRadius: 10,
          display: 'grid', placeItems: 'center',
          background: `color-mix(in srgb, ${card.tintColor} 15%, var(--bg-tertiary))`,
          color: card.tintColor,
        }}
      >
        <Icon size={20} strokeWidth={2} />
      </span>
      <div>
        <p style={{ font: 'var(--type-subheadline)', fontWeight: 600, color: 'var(--label-primary)', marginBottom: 2 }}>
          {card.label}
        </p>
        <p style={{ font: 'var(--type-caption-1)', color: 'var(--label-secondary)', lineHeight: 1.3 }}>
          {card.desc}
        </p>
      </div>
    </button>
  );
}
