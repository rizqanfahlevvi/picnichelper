import { useState } from 'react';
import { Maximize2, X } from 'lucide-react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ReferenceDot, ReferenceLine,
} from 'recharts';
import type { CurvePoint } from '../../data/growthCurves';

interface GrowthChartProps {
  data: CurvePoint[];
  /** Full-range data (no xDomain crop) for sheet view */
  fullData?: CurvePoint[];
  patientX: number;
  patientY: number;
  xLabel: string;
  yLabel: string;
  title: string;
  xDomain?: [number, number];
}

const SD_LINES = [
  { key: 'sd3',  label: '+3 SD', color: '#ef4444', dash: '4 2' },
  { key: 'sd2',  label: '+2 SD', color: '#f97316', dash: '4 2' },
  { key: 'sd1',  label: '+1 SD', color: '#22c55e', dash: '2 2' },
  { key: 'sd0',  label: 'Median', color: '#3b82f6', dash: undefined },
  { key: 'sd1n', label: '-1 SD', color: '#22c55e', dash: '2 2' },
  { key: 'sd2n', label: '-2 SD', color: '#f97316', dash: '4 2' },
  { key: 'sd3n', label: '-3 SD', color: '#ef4444', dash: '4 2' },
] as const;

function ChartTooltip({ active, payload, label, xLabel }: {
  active?: boolean; payload?: { name: string; value: number; color: string }[];
  label?: number; xLabel: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'var(--bg-elevated, #1c1c1e)', border: '0.5px solid var(--separator, #38383a)',
      borderRadius: 10, padding: '8px 12px', fontSize: 11,
    }}>
      <p style={{ color: 'var(--label-secondary, #ebebf599)', marginBottom: 4 }}>
        {xLabel}: <strong style={{ color: '#fff' }}>{label}</strong>
      </p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name}: {p.value?.toFixed(1)}
        </p>
      ))}
    </div>
  );
}

interface ChartBodyProps {
  chartData: CurvePoint[];
  patientX: number;
  patientY: number;
  xLabel: string;
  yLabel: string;
  height: number;
  fullRange: boolean;
}

function ChartBody({ chartData, patientX, patientY, xLabel, yLabel, height, fullRange }: ChartBodyProps) {
  // Compute Y domain from all SD3 extremes in visible data
  const allSd3 = chartData.map(d => d.sd3);
  const allSd3n = chartData.map(d => d.sd3n);
  const rawMax = Math.max(...allSd3, patientY);
  const rawMin = Math.min(...allSd3n, patientY);
  const yMax = Math.ceil(rawMax * 1.04);
  const yMin = Math.max(0, Math.floor(rawMin * 0.96));

  // Clamp patient dot to domain boundaries (so it always shows)
  const clampedY = Math.min(Math.max(patientY, yMin), yMax);
  const isOutside = patientY < yMin || patientY > yMax;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={chartData} margin={{ top: 8, right: 16, left: -8, bottom: 16 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--separator, #38383a)" strokeOpacity={0.5} />
        <XAxis
          dataKey="key"
          tick={{ fontSize: 10, fill: 'var(--label-tertiary, #ebebf560)' }}
          label={{ value: xLabel, position: 'insideBottom', offset: -8, fontSize: 10, fill: 'var(--label-tertiary, #ebebf560)' }}
          tickCount={fullRange ? 10 : 7}
          domain={['dataMin', 'dataMax']}
        />
        <YAxis
          domain={[yMin, yMax]}
          tick={{ fontSize: 10, fill: 'var(--label-tertiary, #ebebf560)' }}
          label={{ value: yLabel, angle: -90, position: 'insideLeft', offset: 12, fontSize: 10, fill: 'var(--label-tertiary, #ebebf560)' }}
          width={36}
        />
        <Tooltip content={<ChartTooltip xLabel={xLabel} />} />
        {SD_LINES.map(({ key, label, color, dash }) => (
          <Line
            key={key}
            type="monotone"
            dataKey={key}
            name={label}
            stroke={color}
            strokeWidth={key === 'sd0' ? 2 : 1}
            strokeDasharray={dash}
            dot={false}
            activeDot={{ r: 3 }}
          />
        ))}
        {/* Vertical reference line at patient x in full view */}
        {fullRange && (
          <ReferenceLine
            x={patientX}
            stroke="var(--sys-red, #ff453a)"
            strokeDasharray="3 3"
            strokeOpacity={0.6}
          />
        )}
        {/* Patient dot — clamped to domain so always visible */}
        <ReferenceDot
          x={patientX}
          y={clampedY}
          r={6}
          fill={isOutside ? 'var(--sys-orange, #ff9f0a)' : 'var(--sys-red, #ff453a)'}
          stroke="#fff"
          strokeWidth={2}
        />
        {/* Arrow label if clamped */}
        {isOutside && (
          <ReferenceDot
            x={patientX}
            y={clampedY}
            r={0}
            label={{
              value: patientY > yMax ? '▲' : '▼',
              position: patientY > yMax ? 'top' : 'bottom',
              fill: 'var(--sys-orange, #ff9f0a)',
              fontSize: 12,
            }}
          />
        )}
      </LineChart>
    </ResponsiveContainer>
  );
}

function Legend() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 12px', padding: '4px 12px 0', justifyContent: 'center' }}>
      {SD_LINES.map(({ key, label, color }) => (
        <span key={key} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: 'var(--label-tertiary)' }}>
          <span style={{ display: 'inline-block', width: 16, height: 2, background: color, borderRadius: 1 }} />
          {label}
        </span>
      ))}
      <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: 'var(--label-tertiary)' }}>
        <span style={{ display: 'inline-block', width: 8, height: 8, background: 'var(--sys-red, #ff453a)', borderRadius: '50%', border: '1.5px solid #fff' }} />
        Pasien
      </span>
    </div>
  );
}

export function GrowthChart({ data, fullData, patientX, patientY, xLabel, yLabel, title, xDomain }: GrowthChartProps) {
  const [sheetOpen, setSheetOpen] = useState(false);

  const chartData = xDomain
    ? data.filter(d => d.key >= xDomain[0] && d.key <= xDomain[1])
    : data;
  const allData = fullData ?? data;

  return (
    <div style={{ marginBottom: 16 }}>
      {/* Title row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <div style={{
          font: 'var(--type-caption-1)', fontWeight: 600,
          color: 'var(--label-secondary)',
          textTransform: 'uppercase', letterSpacing: '0.04em', fontSize: 11,
        }}>
          {title}
        </div>
        <button
          onClick={() => setSheetOpen(true)}
          title="Lihat kurva lengkap"
          style={{
            display: 'flex', alignItems: 'center', gap: 4,
            background: 'var(--fill-secondary)', border: 'none', borderRadius: 6,
            padding: '4px 8px', cursor: 'pointer',
            font: 'var(--type-caption-2)', color: 'var(--accent)', fontSize: 10,
          }}
        >
          <Maximize2 size={11} />
          Lengkap
        </button>
      </div>

      {/* Zoomed chart card */}
      <div style={{
        background: 'var(--bg-tertiary)', borderRadius: 'var(--r-card)',
        border: '0.5px solid var(--separator)', padding: '12px 4px 8px 0',
      }}>
        <ChartBody
          chartData={chartData}
          patientX={patientX}
          patientY={patientY}
          xLabel={xLabel}
          yLabel={yLabel}
          height={220}
          fullRange={false}
        />
        <Legend />
      </div>

      {/* Full-range sheet */}
      {sheetOpen && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setSheetOpen(false)}
            style={{
              position: 'fixed', inset: 0, zIndex: 300,
              background: 'rgba(0,0,0,0.5)',
            }}
          />
          {/* Sheet */}
          <div style={{
            position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 301,
            background: 'var(--bg-secondary)',
            borderRadius: 'var(--r-sheet) var(--r-sheet) 0 0',
            padding: '16px 0 32px',
            maxHeight: '85dvh',
            overflowY: 'auto',
          }}>
            {/* Handle */}
            <div style={{ width: 36, height: 4, background: 'var(--fill-tertiary)', borderRadius: 2, margin: '0 auto 16px' }} />

            {/* Sheet header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 16px 12px' }}>
              <div>
                <div style={{ font: 'var(--type-headline)', fontWeight: 700, color: 'var(--label-primary)' }}>
                  {title}
                </div>
                <div style={{ font: 'var(--type-caption-1)', color: 'var(--label-tertiary)', marginTop: 2 }}>
                  Kurva lengkap — garis merah putus-putus = posisi pasien
                </div>
              </div>
              <button
                onClick={() => setSheetOpen(false)}
                style={{ background: 'var(--fill-secondary)', border: 'none', borderRadius: '50%', width: 28, height: 28, display: 'grid', placeItems: 'center', cursor: 'pointer', color: 'var(--label-secondary)', flexShrink: 0 }}
              >
                <X size={14} />
              </button>
            </div>

            {/* Full chart */}
            <div style={{ padding: '0 4px 0 0' }}>
              <ChartBody
                chartData={allData}
                patientX={patientX}
                patientY={patientY}
                xLabel={xLabel}
                yLabel={yLabel}
                height={320}
                fullRange
              />
            </div>
            <div style={{ padding: '0 0 8px' }}>
              <Legend />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
