import { useState } from 'react';
import { PatientSummary } from '../components/PatientSummary';
import { PrepIntubasi }      from '../components/ventilasi/PrepIntubasi';
import { SettingVentilator } from '../components/ventilasi/SettingVentilator';
import { MonitoringVentilasi } from '../components/ventilasi/MonitoringVentilasi';
import { WeaningEkstubasi }  from '../components/ventilasi/WeaningEkstubasi';

type VentilasiTab = 'prep' | 'setting' | 'monitoring' | 'weaning';

const TABS: { id: VentilasiTab; label: string }[] = [
  { id: 'prep',       label: 'Persiapan'  },
  { id: 'setting',    label: 'Setting'    },
  { id: 'monitoring', label: 'Monitoring' },
  { id: 'weaning',    label: 'Weaning'    },
];

export function Monitoring() {
  const [activeTab, setActiveTab] = useState<VentilasiTab>('prep');

  return (
    <div className="ios-screen pb-6">
      <div style={{ padding: '24px 20px 8px' }}>
        <h1 className="ios-large-title">Ventilasi</h1>
      </div>

      <PatientSummary />

      {/* Tab bar — horizontally scrollable for 4 tabs */}
      <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', padding: '8px 16px 0' }}>
        <div className="ios-segmented" style={{ display: 'inline-flex', minWidth: '100%', whiteSpace: 'nowrap' }}>
          {TABS.map((tab) => (
            <button
              key={tab.id}
              aria-selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{ flex: '1 0 auto' }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
        {activeTab === 'prep'       && <PrepIntubasi />}
        {activeTab === 'setting'    && <SettingVentilator />}
        {activeTab === 'monitoring' && <MonitoringVentilasi />}
        {activeTab === 'weaning'    && <WeaningEkstubasi />}
      </div>
    </div>
  );
}
