import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
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
    <div className="ios-screen pb-6">
      <div style={{ padding: '24px 20px 8px' }}>
        <h1 className="ios-large-title">Teori & Klinis</h1>
      </div>

      {/* Category filter pills */}
      <div style={{
        display: 'flex', gap: 6, overflowX: 'auto', padding: '8px 16px',
        scrollbarWidth: 'none',
      }}>
        <FilterPill label="Semua" active={activeCategory === 'semua'} onClick={() => setActiveCategory('semua')} />
        {CATEGORY_ORDER.map((cat) => (
          <FilterPill
            key={cat}
            label={CATEGORY_LABELS[cat]}
            active={activeCategory === cat}
            onClick={() => setActiveCategory(cat)}
          />
        ))}
      </div>

      {CATEGORY_ORDER.map((cat) => {
        const entries = grouped[cat];
        if (!entries.length) return null;
        return (
          <section key={cat}>
            {activeCategory === 'semua' && (
              <div className="ios-section">
                <span className="label">{CATEGORY_LABELS[cat]}</span>
              </div>
            )}
            <div className="ios-list" style={{ margin: activeCategory === 'semua' ? undefined : '8px 16px 0' }}>
              {entries.map((entry) => (
                <div key={entry.id}>
                  <button
                    onClick={() => setExpanded(expanded === entry.id ? null : entry.id)}
                    style={{
                      width: '100%', textAlign: 'left',
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '10px 14px', minHeight: 'var(--hit)',
                      background: 'transparent', border: 'none', cursor: 'pointer',
                      borderTop: '0.5px solid var(--separator)',
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="ios-row-label">{entry.title}</div>
                      <div className="ios-row-sub">{entry.subtitle}</div>
                    </div>
                    <ChevronRight
                      size={16}
                      className="ios-chevron"
                      style={{
                        transform: expanded === entry.id ? 'rotate(90deg)' : 'none',
                        transition: 'transform var(--dur-fast)',
                      }}
                    />
                  </button>

                  {expanded === entry.id && (
                    <div style={{
                      padding: '10px 14px 14px 14px',
                      borderTop: '0.5px solid var(--separator)',
                      background: 'var(--fill-tertiary)',
                    }}>
                      <ul style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {entry.points.map((point, i) => (
                          <li key={i} style={{ display: 'flex', gap: 8 }}>
                            <span style={{ color: 'var(--accent)', flexShrink: 0, marginTop: 1 }}>•</span>
                            <span style={{ font: 'var(--type-subheadline)', color: 'var(--label-secondary)' }}>
                              {point.text}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

function FilterPill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        flexShrink: 0, padding: '7px 16px', borderRadius: 'var(--r-pill)',
        border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
        font: 'var(--type-subheadline)', fontWeight: active ? 600 : 400,
        background: active ? 'var(--tint-theory)' : 'var(--fill-secondary)',
        color: active ? '#fff' : 'var(--label-primary)',
        transition: 'all var(--dur-fast)',
      }}
    >
      {label}
    </button>
  );
}
