import { useState } from 'react';
import { Activity, Baby, BarChart2, ChevronLeft, Heart } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { PatientSummary } from '../components/PatientSummary';
import { DownesScore } from '../components/scoring/DownesScore';
import { Pelod2Score } from '../components/scoring/Pelod2Score';
import { PsofaScore } from '../components/scoring/PsofaScore';
import { CribIIScore } from '../components/scoring/CribIIScore';

type SkoringId = 'downes' | 'pelod2' | 'psofa' | 'cribii';

interface SkoringCard {
  id: SkoringId;
  label: string;
  desc: string;
  icon: LucideIcon;
  tintClass: string;
  tintColor: string;
}

const SCORING_CARDS: SkoringCard[] = [
  {
    id: 'downes', label: 'Downes Score',
    desc: 'Distres napas neonatus',
    icon: Baby, tintClass: 'tint-resp', tintColor: 'var(--sys-teal)',
  },
  {
    id: 'pelod2', label: 'PELOD-2',
    desc: 'Disfungsi organ pediatri',
    icon: BarChart2, tintClass: 'tint-score', tintColor: 'var(--sys-orange)',
  },
  {
    id: 'psofa', label: 'pSOFA',
    desc: 'Sepsis organ failure — anak',
    icon: Activity, tintClass: 'tint-vital', tintColor: 'var(--sys-red)',
  },
  {
    id: 'cribii', label: 'CRIB-II',
    desc: 'Risiko klinis neonatus',
    icon: Heart, tintClass: 'tint-drug', tintColor: 'var(--sys-pink)',
  },
];

export function Skoring() {
  const [active, setActive] = useState<SkoringId | null>(null);

  return (
    <div className="ios-screen pb-6">
      <div style={{ padding: '24px 20px 8px', display: 'flex', alignItems: 'center', gap: 12 }}>
        {active ? (
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
            Skoring Klinis
          </button>
        ) : (
          <h1 className="ios-large-title">Skoring Klinis</h1>
        )}
      </div>

      <PatientSummary />

      {active === null ? (
        <div style={{ padding: '16px 16px 0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {SCORING_CARDS.map((card) => (
            <SkoringCardButton key={card.id} card={card} onSelect={() => setActive(card.id)} />
          ))}
        </div>
      ) : (
        <div style={{ marginTop: 16 }}>
          {active === 'downes' && <DownesScore />}
          {active === 'pelod2' && <Pelod2Score />}
          {active === 'psofa'  && <PsofaScore />}
          {active === 'cribii' && <CribIIScore />}
        </div>
      )}
    </div>
  );
}

function SkoringCardButton({ card, onSelect }: { card: SkoringCard; onSelect: () => void }) {
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
