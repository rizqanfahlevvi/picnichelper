import { useState } from 'react';
import { VitalSignsChecker } from '../components/monitoring/VitalSignsChecker';
import { WeaningChecklist } from '../components/monitoring/WeaningChecklist';

type MonitoringTab = 'vital' | 'weaning';

const TABS: { id: MonitoringTab; label: string }[] = [
  { id: 'vital',   label: 'Tanda Vital' },
  { id: 'weaning', label: 'Weaning'     },
];

export function Monitoring() {
  const [activeTab, setActiveTab] = useState<MonitoringTab>('vital');

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Monitoring & Weaning</h1>

      <div className="flex gap-1">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2 rounded-full text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'vital'   && <VitalSignsChecker />}
      {activeTab === 'weaning' && <WeaningChecklist />}
    </div>
  );
}
