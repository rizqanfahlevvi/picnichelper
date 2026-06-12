import { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Disclaimer } from '../Disclaimer';
import { WEANING_CRITERIA, type WeaningCriterion } from '../../utils/vitalSigns';

const CATEGORY_LABELS: Record<WeaningCriterion['category'], string> = {
  klinis:     'Klinis',
  oksigenasi: 'Oksigenasi',
  ventilasi:  'Ventilasi',
  neurologi:  'Neurologi',
};

const CATEGORY_ORDER: WeaningCriterion['category'][] = ['klinis', 'oksigenasi', 'ventilasi', 'neurologi'];

export function WeaningChecklist() {
  const [checked, setChecked] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(WEANING_CRITERIA.map(c => [c.id, false]))
  );
  const [expanded, setExpanded] = useState<string | null>(null);

  function toggle(id: string) {
    setChecked(prev => ({ ...prev, [id]: !prev[id] }));
  }

  const total   = WEANING_CRITERIA.length;
  const ticked  = Object.values(checked).filter(Boolean).length;
  const percent = Math.round((ticked / total) * 100);
  const ready   = ticked === total;

  const grouped = CATEGORY_ORDER.reduce<Record<WeaningCriterion['category'], WeaningCriterion[]>>(
    (acc, cat) => {
      acc[cat] = WEANING_CRITERIA.filter(c => c.category === cat);
      return acc;
    },
    {} as Record<WeaningCriterion['category'], WeaningCriterion[]>,
  );

  return (
    <div className="space-y-4">
      {/* Progress */}
      <div className={`rounded-2xl border p-5 space-y-3 ${
        ready
          ? 'border-green-400 dark:border-green-700 bg-green-50 dark:bg-green-950/20'
          : 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/20'
      }`}>
        <div className="flex items-center justify-between">
          <span className={`text-lg font-bold ${ready ? 'text-green-500' : 'text-blue-600 dark:text-blue-400'}`}>
            {ticked}/{total} kriteria terpenuhi
          </span>
          <Badge variant={ready ? 'default' : 'secondary'}>
            {ready ? 'Siap weaning' : `${percent}%`}
          </Badge>
        </div>
        <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${ready ? 'bg-green-500' : 'bg-blue-500'}`}
            style={{ width: `${percent}%` }}
          />
        </div>
        {ready && (
          <p className="text-sm text-green-500 font-medium">
            Semua kriteria terpenuhi — pertimbangkan SBT (Spontaneous Breathing Trial).
          </p>
        )}
      </div>

      {/* Checklist per kategori */}
      {CATEGORY_ORDER.map(cat => (
        <section key={cat} className="space-y-2">
          <h3 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide px-1">
            {CATEGORY_LABELS[cat]}
          </h3>
          {grouped[cat].map(criterion => (
            <Card key={criterion.id}
              className={checked[criterion.id] ? 'border-green-300 dark:border-green-800' : ''}>
              <CardContent className="pt-0 pb-0">
                {/* Main row */}
                <div className="flex items-center gap-3 py-3">
                  <button
                    onClick={() => toggle(criterion.id)}
                    className={`shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                      checked[criterion.id]
                        ? 'bg-green-500 border-green-500 text-white'
                        : 'border-slate-300 dark:border-slate-600'
                    }`}
                  >
                    {checked[criterion.id] && <span className="text-xs leading-none">✓</span>}
                  </button>
                  <button
                    onClick={() => setExpanded(expanded === criterion.id ? null : criterion.id)}
                    className="flex-1 text-left"
                  >
                    <span className={`text-sm ${checked[criterion.id] ? 'text-slate-400 line-through dark:text-slate-600' : 'text-slate-700 dark:text-slate-200'}`}>
                      {criterion.text}
                    </span>
                  </button>
                  <button
                    onClick={() => setExpanded(expanded === criterion.id ? null : criterion.id)}
                    className="shrink-0 text-slate-400 text-xs"
                  >
                    {expanded === criterion.id ? '▴' : '▾'}
                  </button>
                </div>

                {/* Detail */}
                {expanded === criterion.id && (
                  <div className="pb-3 pl-9 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-2">
                    {criterion.detail}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </section>
      ))}

      {/* SBT protocol */}
      <Card>
        <CardContent className="pt-4 space-y-2">
          <p className="text-sm font-semibold">Protokol SBT</p>
          {[
            'Set mode CPAP 5 cmH₂O atau T-piece.',
            'Observasi 30–120 menit.',
            'Gagal bila: RR > 35×/mnt, SpO₂ < 90%, HR ↑/↓ > 20%, retraksi berat, atau agitasi.',
            'Ekstubasi bila SBT berhasil dan proteksi jalan napas adekuat.',
          ].map((step, i) => (
            <div key={i} className="flex gap-2 text-sm text-slate-600 dark:text-slate-300">
              <span className="shrink-0 font-bold text-blue-500">{i + 1}.</span>
              <span>{step}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      <Disclaimer />
    </div>
  );
}
