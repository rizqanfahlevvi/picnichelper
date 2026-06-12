import { useState } from 'react';
import { DownesScore } from '../components/scoring/DownesScore';
import { Pelod2Score } from '../components/scoring/Pelod2Score';
import { PsofaScore } from '../components/scoring/PsofaScore';
import { CribIIScore } from '../components/scoring/CribIIScore';

type SkoringTab = 'downes' | 'pelod2' | 'psofa' | 'cribii';

const TABS: { id: SkoringTab; label: string }[] = [
  { id: 'downes', label: 'Downes'  },
  { id: 'pelod2', label: 'PELOD-2' },
  { id: 'psofa',  label: 'pSOFA'   },
  { id: 'cribii', label: 'CRIB-II' },
];

export function Skoring() {
  const [activeTab, setActiveTab] = useState<SkoringTab>('downes');

  return (
    <div className="ios-screen pb-6">
      <div style={{ padding: '24px 20px 8px' }}>
        <h1 className="ios-large-title">Skoring Klinis</h1>
      </div>

      <div style={{
        display: 'flex', gap: 6, overflowX: 'auto', padding: '8px 16px',
        scrollbarWidth: 'none',
      }}>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flexShrink: 0, padding: '7px 18px', borderRadius: 'var(--r-pill)',
              border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
              font: 'var(--type-subheadline)', fontWeight: activeTab === tab.id ? 600 : 400,
              background: activeTab === tab.id ? 'var(--tint-score)' : 'var(--fill-secondary)',
              color: activeTab === tab.id ? '#fff' : 'var(--label-primary)',
              transition: 'all var(--dur-fast)',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div style={{ marginTop: 8 }}>
        {activeTab === 'downes' && <DownesScore />}
        {activeTab === 'pelod2' && <Pelod2Score />}
        {activeTab === 'psofa'  && <PsofaScore />}
        {activeTab === 'cribii' && <CribIIScore />}
      </div>
    </div>
  );
}
