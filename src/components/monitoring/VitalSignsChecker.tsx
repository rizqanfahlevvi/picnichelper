import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Cite } from '../Citation';
import { REFERENCES } from '../../data/references';
import {
  VITAL_RANGES,
  checkVitals,
  type AgeGroup,
  type VitalStatus,
} from '../../utils/vitalSigns';

const STATUS_COLOR: Record<VitalStatus, string> = {
  normal: 'var(--sys-green)',
  low:    'var(--sys-red)',
  high:   'var(--sys-orange)',
};

const STATUS_LABEL: Record<VitalStatus, string> = {
  normal: '✓',
  low:    '↓',
  high:   '↑',
};

const FIELD_LABELS: Record<string, string> = {
  hr: 'HR', rr: 'RR', sbp: 'Sistolik', dbp: 'Diastolik', map: 'MAP', spo2: 'SpO₂',
};

export function VitalSignsChecker() {
  const [ageGroup, setAgeGroup] = useState<AgeGroup>('infant');
  const [hr,   setHr]   = useState('');
  const [rr,   setRr]   = useState('');
  const [sbp,  setSbp]  = useState('');
  const [dbp,  setDbp]  = useState('');
  const [spo2, setSpo2] = useState('');
  const [map,  setMap]  = useState('');

  const range = VITAL_RANGES.find(r => r.ageGroup === ageGroup)!;

  const inputMap = {
    hr:   hr   !== '' ? Number(hr)   : undefined,
    rr:   rr   !== '' ? Number(rr)   : undefined,
    sbp:  sbp  !== '' ? Number(sbp)  : undefined,
    dbp:  dbp  !== '' ? Number(dbp)  : undefined,
    spo2: spo2 !== '' ? Number(spo2) : undefined,
    map:  map  !== '' ? Number(map)  : undefined,
  };
  const result = checkVitals(range, inputMap);

  const hasAbnormal = Object.values(result).some(v => v !== null && v !== 'normal');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Age group pills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, padding: '0 16px' }}>
        {VITAL_RANGES.map(r => (
          <button
            key={r.ageGroup}
            onClick={() => setAgeGroup(r.ageGroup)}
            style={{
              padding: '6px 14px', borderRadius: 'var(--r-pill)', border: 'none', cursor: 'pointer',
              font: 'var(--type-footnote)', fontWeight: ageGroup === r.ageGroup ? 600 : 400,
              background: ageGroup === r.ageGroup ? 'var(--tint-vital)' : 'var(--fill-secondary)',
              color: ageGroup === r.ageGroup ? '#fff' : 'var(--label-primary)',
              transition: 'all var(--dur-fast)',
            }}
          >
            {r.label}
          </button>
        ))}
      </div>

      {/* Normal range reference */}
      <div className="ios-card" style={{ padding: '12px 14px' }}>
        <p style={{ font: 'var(--type-caption-2)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--label-secondary)', marginBottom: 8 }}>
          Rentang Normal — {range.label} <Cite source="pals2020" />
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3px 16px' }}>
          {[
            `HR: ${range.hrMin}–${range.hrMax} bpm`,
            `RR: ${range.rrMin}–${range.rrMax} ×/mnt`,
            `Sistolik: ${range.sbpMin}–${range.sbpMax} mmHg`,
            `Diastolik: ${range.dbpMin}–${range.dbpMax} mmHg`,
            `MAP: ${range.mapMin}–${range.mapMax} mmHg`,
            'SpO₂: ≥ 95%',
          ].map((s) => (
            <span key={s} style={{ font: 'var(--type-footnote)', color: 'var(--label-secondary)' }}>{s}</span>
          ))}
        </div>
      </div>

      {/* Input grid */}
      <div className="ios-card" style={{ padding: '2px 0' }}>
        <p style={{ padding: '10px 14px 4px', font: 'var(--type-caption-1)', color: 'var(--label-tertiary)' }}>
          Kosongkan bila tidak tersedia
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
          {[
            { label: 'HR',       unit: 'bpm',   value: hr,   onChange: setHr,   key: 'hr'   },
            { label: 'RR',       unit: '×/mnt', value: rr,   onChange: setRr,   key: 'rr'   },
            { label: 'Sistolik', unit: 'mmHg',  value: sbp,  onChange: setSbp,  key: 'sbp'  },
            { label: 'Diastolik',unit: 'mmHg',  value: dbp,  onChange: setDbp,  key: 'dbp'  },
            { label: 'MAP',      unit: 'mmHg',  value: map,  onChange: setMap,  key: 'map'  },
            { label: 'SpO₂',    unit: '%',     value: spo2, onChange: setSpo2, key: 'spo2' },
          ].map(({ label, unit, value, onChange, key }) => (
            <VFField
              key={key}
              label={label} unit={unit} value={value} onChange={onChange}
              status={result[key as keyof typeof result]}
            />
          ))}
        </div>
      </div>

      {/* Abnormal summary */}
      {hasAbnormal && (
        <div className="ios-warn">
          <AlertTriangle size={15} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <span style={{ fontWeight: 600 }}>Nilai di luar rentang normal:</span>
            {(Object.entries(result) as [keyof typeof result, VitalStatus | null][])
              .filter(([, v]) => v === 'low' || v === 'high')
              .map(([key, v]) => (
                <span key={key}>
                  {FIELD_LABELS[key]}: {v === 'low' ? 'Di bawah normal' : 'Di atas normal'}
                </span>
              ))}
          </div>
        </div>
      )}

      <div className="ios-card" style={{ padding: '12px 14px' }}>
        <p style={{ font: 'var(--type-caption-2)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--label-secondary)', marginBottom: 8 }}>Referensi</p>
        <ol style={{ display: 'flex', flexDirection: 'column', gap: 6, paddingLeft: 0, listStyle: 'none', margin: 0 }}>
          {(['pals2020'] as const).map((key) => (
            <li key={key} style={{ font: 'var(--type-caption-1)', color: 'var(--label-secondary)' }}>
              <span style={{ fontWeight: 700, color: 'var(--label-primary)' }}>[{REFERENCES[key].id}]</span>{' '}
              {REFERENCES[key].citation}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

function VFField({ label, unit, value, onChange, status }: {
  label: string; unit: string; value: string;
  onChange: (v: string) => void; status: VitalStatus | null;
}) {
  const borderColor = status
    ? STATUS_COLOR[status]
    : 'var(--separator)';

  return (
    <div style={{ padding: '8px 12px', borderTop: '0.5px solid var(--separator)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
        <label style={{ font: 'var(--type-caption-1)', fontWeight: 600, color: 'var(--label-secondary)' }}>
          {label} <span style={{ color: 'var(--label-tertiary)', fontWeight: 400 }}>({unit})</span>
        </label>
        {status && (
          <span style={{ font: 'var(--type-caption-2)', fontWeight: 700, color: STATUS_COLOR[status] }}>
            {STATUS_LABEL[status]}
          </span>
        )}
      </div>
      <input
        type="number"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="—"
        style={{
          width: '100%', minHeight: 40, borderRadius: 'var(--r-sm)',
          border: `1.5px solid ${borderColor}`,
          outline: 'none',
          background: 'var(--fill-tertiary)',
          color: 'var(--label-primary)',
          font: 'var(--type-body)',
          padding: '0 10px', boxSizing: 'border-box',
          transition: 'border-color var(--dur-fast)',
        }}
      />
    </div>
  );
}
