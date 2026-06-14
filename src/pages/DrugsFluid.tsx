import { useState } from 'react';
import { PatientSummary } from '../components/PatientSummary';
import { DrugLibraryView } from '../components/drugsfluid/DrugLibraryView';
import { FluidLibraryView } from '../components/drugsfluid/FluidLibraryView';
import { FluidCalculator } from '../components/drugsfluid/FluidCalculator';

type Tab = 'obat' | 'cairan' | 'kalkulator';

const TABS: { id: Tab; label: string }[] = [
  { id: 'obat',       label: 'Obat' },
  { id: 'cairan',     label: 'Cairan' },
  { id: 'kalkulator', label: 'Kalkulator' },
];

export function DrugsFluid() {
  const [tab, setTab] = useState<Tab>('obat');

  return (
    <div className="ios-screen pb-6">
      <div style={{ padding: '24px 20px 8px' }}>
        <h1 className="ios-large-title">Drugs & Fluids</h1>
      </div>

      {/* Tab bar */}
      <div style={{ padding: '0 16px 12px' }}>
        <div style={{
          display: 'flex', background: 'var(--fill-secondary)',
          borderRadius: 'var(--r-sm)', padding: 3, gap: 2,
        }}>
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                flex: 1, padding: '7px 0', border: 'none', cursor: 'pointer',
                borderRadius: 'calc(var(--r-sm) - 2px)',
                background: tab === t.id ? 'var(--bg-secondary)' : 'transparent',
                color: tab === t.id ? 'var(--label-primary)' : 'var(--label-secondary)',
                fontSize: 'var(--type-subhead)', fontWeight: tab === t.id ? 600 : 400,
                boxShadow: tab === t.id ? '0 1px 4px rgba(0,0,0,0.12)' : 'none',
                transition: 'all 0.15s ease',
              }}
            >{t.label}</button>
          ))}
        </div>
      </div>

      {/* Patient summary (compact, always visible untuk dose calc) */}
      {(tab === 'obat' || tab === 'kalkulator') && (
        <div style={{ marginBottom: 8 }}>
          <PatientSummary />
        </div>
      )}

      {/* Tab content */}
      {tab === 'obat' && (
        <div style={{ marginTop: 8 }}>
          <DrugLibraryView />
        </div>
      )}
      {tab === 'cairan' && (
        <div style={{ marginTop: 8 }}>
          <FluidLibraryView />
        </div>
      )}
      {tab === 'kalkulator' && (
        <div style={{ marginTop: 8, padding: '0 16px' }}>
          <FluidCalculator />
        </div>
      )}
    </div>
  );
}
