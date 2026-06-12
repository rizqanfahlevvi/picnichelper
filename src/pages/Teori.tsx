import { useState } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { THEORY_ENTRIES, CATEGORY_LABELS, CATEGORY_ORDER, type TheoryCategory } from '../data/theory';

export function Teori() {
  const [activeCategory, setActiveCategory] = useState<TheoryCategory | 'semua'>('semua');
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = activeCategory === 'semua'
    ? THEORY_ENTRIES
    : THEORY_ENTRIES.filter((e) => e.category === activeCategory);

  const grouped = CATEGORY_ORDER.reduce<Record<TheoryCategory, typeof THEORY_ENTRIES>>((acc, cat) => {
    acc[cat] = filtered.filter((e) => e.category === cat);
    return acc;
  }, {} as Record<TheoryCategory, typeof THEORY_ENTRIES>);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Teori & Klinis</h1>

      {/* Category filter */}
      <div className="flex gap-1 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
        <FilterChip
          label="Semua"
          active={activeCategory === 'semua'}
          onClick={() => setActiveCategory('semua')}
        />
        {CATEGORY_ORDER.map((cat) => (
          <FilterChip
            key={cat}
            label={CATEGORY_LABELS[cat]}
            active={activeCategory === cat}
            onClick={() => setActiveCategory(cat)}
          />
        ))}
      </div>

      {/* Content */}
      {CATEGORY_ORDER.map((cat) => {
        const entries = grouped[cat];
        if (!entries.length) return null;
        return (
          <section key={cat} className="space-y-2">
            {activeCategory === 'semua' && (
              <h2 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide px-1">
                {CATEGORY_LABELS[cat]}
              </h2>
            )}
            {entries.map((entry) => (
              <Card key={entry.id}>
                <button
                  className="w-full text-left"
                  onClick={() => setExpanded(expanded === entry.id ? null : entry.id)}
                >
                  <CardContent className="pt-4 pb-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-semibold text-sm">{entry.title}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {entry.subtitle}
                        </div>
                      </div>
                      <span className={`text-slate-400 dark:text-slate-500 transition-transform shrink-0 ${
                        expanded === entry.id ? 'rotate-180' : ''
                      }`}>
                        ▾
                      </span>
                    </div>
                  </CardContent>
                </button>

                {expanded === entry.id && (
                  <CardContent className="pb-4 pt-0 border-t border-slate-100 dark:border-slate-800">
                    <ul className="space-y-2 mt-3">
                      {entry.points.map((point, i) => (
                        <li key={i} className="flex gap-2 text-sm text-slate-600 dark:text-slate-300">
                          <span className="text-blue-500 shrink-0 mt-0.5">•</span>
                          <span>{point.text}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                )}
              </Card>
            ))}
          </section>
        );
      })}
    </div>
  );
}

function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
        active
          ? 'bg-blue-600 text-white'
          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
      }`}
    >
      {label}
    </button>
  );
}
