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
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Skoring Klinis</h1>

      <div className="flex gap-1 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'downes' && <DownesScore />}
      {activeTab === 'pelod2' && <Pelod2Score />}
      {activeTab === 'psofa'  && <PsofaScore />}
      {activeTab === 'cribii' && <CribIIScore />}
    </div>
  );
}
