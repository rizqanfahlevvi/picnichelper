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
    <div className="ios-screen pb-6">
      <div style={{ padding: '24px 20px 8px' }}>
        <h1 className="ios-large-title">Kalkulator</h1>
      </div>

      <PatientInput />

      {/* Scrollable pill tabs */}
      <div style={{
        display: 'flex', gap: 6, overflowX: 'auto', padding: '16px 16px 0',
        scrollbarWidth: 'none',
      }}>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flexShrink: 0, padding: '7px 16px', borderRadius: 'var(--r-pill)',
              border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
              font: 'var(--type-subheadline)', fontWeight: activeTab === tab.id ? 600 : 400,
              background: activeTab === tab.id ? 'var(--accent)' : 'var(--fill-secondary)',
              color: activeTab === tab.id ? '#fff' : 'var(--label-primary)',
              transition: 'all var(--dur-fast)',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div style={{ marginTop: 16 }}>
        {activeTab === 'ett_size'  && <EttCalculator />}
        {activeTab === 'ett_depth' && <EttDepthCalculator />}
        {activeTab === 'dosis'     && <EmergencyDrugsCalculator />}
        {activeTab === 'syringe'   && <SyringePumpCalculator />}
        {activeTab === 'agd'       && <AbgInterpreter />}
      </div>
    </div>
  );
}
