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
    <div className="ios-screen pb-6">
      <div style={{ padding: '24px 20px 8px' }}>
        <h1 className="ios-large-title">Monitoring & Weaning</h1>
      </div>

      <div className="ios-segmented" style={{ margin: '8px 16px 0' }}>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            aria-selected={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div style={{ marginTop: 16 }}>
        {activeTab === 'vital'   && <VitalSignsChecker />}
        {activeTab === 'weaning' && <WeaningChecklist />}
      </div>
    </div>
  );
}
