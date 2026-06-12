import { useState } from 'react';
import { PatientInput } from '../components/PatientInput';
import { EttCalculator } from '../components/calculators/EttCalculator';
import { EttDepthCalculator } from '../components/calculators/EttDepthCalculator';
import { EmergencyDrugsCalculator } from '../components/calculators/EmergencyDrugsCalculator';
import { SyringePumpCalculator } from '../components/calculators/SyringePumpCalculator';
import { AbgInterpreter } from '../components/calculators/AbgInterpreter';

type CalcTab = 'ett_size' | 'ett_depth' | 'dosis' | 'syringe' | 'agd';

const TABS: { id: CalcTab; label: string }[] = [
  { id: 'ett_size',  label: 'ETT Ukuran' },
  { id: 'ett_depth', label: 'ETT Kedalaman' },
  { id: 'dosis',     label: 'Dosis' },
  { id: 'syringe',   label: 'Syringe Pump' },
  { id: 'agd',       label: 'AGD' },
];

export function Kalkulator() {
  const [activeTab, setActiveTab] = useState<CalcTab>('ett_size');

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Kalkulator</h1>
      <PatientInput />

      {/* Tab bar */}
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

      {/* Tab content */}
      {activeTab === 'ett_size'  && <EttCalculator />}
      {activeTab === 'ett_depth' && <EttDepthCalculator />}
      {activeTab === 'dosis'     && <EmergencyDrugsCalculator />}
      {activeTab === 'syringe'   && <SyringePumpCalculator />}
      {activeTab === 'agd'       && <AbgInterpreter />}
    </div>
  );
}
