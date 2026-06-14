import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ReferenceDot,
} from 'recharts';
import type { CurvePoint } from '../../data/growthCurves';

interface GrowthChartProps {
  data: CurvePoint[];
  /** Patient's current measurement (x = key, y = value) */
  patientX: number;
  patientY: number;
  xLabel: string;         // "Usia (bulan)" or "Panjang/Tinggi (cm)"
  yLabel: string;         // "Berat (kg)" or "Tinggi (cm)"
  title: string;
  /** X-axis domain clamp to patient vicinity */
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

// Custom tooltip
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

export function GrowthChart({ data, patientX, patientY, xLabel, yLabel, title, xDomain }: GrowthChartProps) {
  // Clamp data to xDomain if provided
  const chartData = xDomain
    ? data.filter(d => d.key >= xDomain[0] && d.key <= xDomain[1])
    : data;

  // Y-axis range: slightly wider than sd3 extremes near patient
  const nearPatient = chartData.find(d => Math.abs(d.key - patientX) < 2) ?? chartData[0];
  const yMin = nearPatient ? Math.floor(nearPatient.sd3n * 0.95) : undefined;
  const yMax = nearPatient ? Math.ceil(nearPatient.sd3 * 1.05) : undefined;

  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{
        font: 'var(--type-caption-1)', fontWeight: 600,
        color: 'var(--label-secondary)', marginBottom: 8,
        textTransform: 'uppercase', letterSpacing: '0.04em', fontSize: 11,
      }}>
        {title}
      </div>
      <div style={{
        background: 'var(--bg-tertiary)', borderRadius: 'var(--r-card)',
        border: '0.5px solid var(--separator)', padding: '12px 4px 8px 0',
      }}>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={chartData} margin={{ top: 4, right: 16, left: -8, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--separator, #38383a)" strokeOpacity={0.5} />
            <XAxis
              dataKey="key"
              tick={{ fontSize: 10, fill: 'var(--label-tertiary, #ebebf560)' }}
              label={{ value: xLabel, position: 'insideBottom', offset: -2, fontSize: 10, fill: 'var(--label-tertiary, #ebebf560)' }}
              tickCount={7}
            />
            <YAxis
              domain={[yMin ?? 'auto', yMax ?? 'auto']}
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
            <ReferenceDot
              x={patientX}
              y={patientY}
              r={6}
              fill="var(--sys-red, #ff453a)"
              stroke="#fff"
              strokeWidth={2}
              label={{ value: '●', fill: 'var(--sys-red, #ff453a)', fontSize: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>

        {/* Legend */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 12px', padding: '4px 12px 0', justifyContent: 'center' }}>
          {SD_LINES.map(({ key, label, color }) => (
            <span key={key} style={{ display: 'flex', alignItems: 'center', gap: 4, font: 'var(--type-caption-2)', color: 'var(--label-tertiary)', fontSize: 10 }}>
              <span style={{ display: 'inline-block', width: 16, height: 2, background: color, borderRadius: 1 }} />
              {label}
            </span>
          ))}
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, font: 'var(--type-caption-2)', color: 'var(--label-tertiary)', fontSize: 10 }}>
            <span style={{ display: 'inline-block', width: 8, height: 8, background: 'var(--sys-red, #ff453a)', borderRadius: '50%', border: '1.5px solid #fff' }} />
            Pasien
          </span>
        </div>
      </div>
    </div>
  );
}
