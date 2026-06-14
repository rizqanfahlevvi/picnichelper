import { useState, useRef, useEffect } from 'react';
import { ChevronRight, X } from 'lucide-react';
import { THEORY_ENTRIES, CATEGORY_LABELS, CATEGORY_ORDER, type TheoryCategory } from '../data/theory';
import { REFERENCES } from '../data/references';

/* ── Citation popup state ───────────────────────────────────────────────── */
interface PopupState {
  refKey: string;
  anchorRect: DOMRect;
}

export function Teori() {
  const [activeCategory, setActiveCategory] = useState<TheoryCategory | 'semua'>('semua');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [popup, setPopup] = useState<PopupState | null>(null);

  const filtered = activeCategory === 'semua'
    ? THEORY_ENTRIES
    : THEORY_ENTRIES.filter((e) => e.category === activeCategory);

  const grouped = CATEGORY_ORDER.reduce<Record<TheoryCategory, typeof THEORY_ENTRIES>>((acc, cat) => {
    acc[cat] = filtered.filter((e) => e.category === cat);
    return acc;
  }, {} as Record<TheoryCategory, typeof THEORY_ENTRIES>);

  function handleCiteClick(e: React.MouseEvent<HTMLButtonElement>, refKey: string) {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setPopup((prev) => (prev?.refKey === refKey ? null : { refKey, anchorRect: rect }));
  }

  return (
    <div className="ios-screen pb-6" onClick={() => setPopup(null)}>
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
                    onClick={() => {
                      setExpanded(expanded === entry.id ? null : entry.id);
                      setPopup(null);
                    }}
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
                    <div
                      style={{
                        padding: '12px 14px 16px',
                        borderTop: '0.5px solid var(--separator)',
                        background: 'var(--fill-tertiary)',
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* Bullet points */}
                      <ul style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                        {entry.points.map((point, i) => (
                          <li key={i} style={{ display: 'flex', gap: 8 }}>
                            <span style={{ color: 'var(--accent)', flexShrink: 0, marginTop: 1 }}>•</span>
                            <span style={{ font: 'var(--type-subheadline)', color: 'var(--label-secondary)' }}>
                              {point.text}
                            </span>
                          </li>
                        ))}
                      </ul>

                      {/* Reference badge row */}
                      {entry.references.length > 0 && (
                        <div style={{
                          borderTop: '0.5px solid var(--separator)',
                          paddingTop: 10,
                        }}>
                          <div style={{
                            font: 'var(--type-caption-2)',
                            color: 'var(--label-tertiary)',
                            marginBottom: 6,
                            textTransform: 'uppercase',
                            letterSpacing: '0.04em',
                          }}>
                            Referensi
                          </div>
                          {/* Inline citation badges */}
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
                            {entry.references.map((refKey) => {
                              const ref = REFERENCES[refKey];
                              if (!ref) return null;
                              return (
                                <button
                                  key={refKey}
                                  onClick={(e) => handleCiteClick(e, refKey)}
                                  style={{
                                    padding: '3px 8px',
                                    borderRadius: 6,
                                    border: '1px solid var(--accent)',
                                    background: popup?.refKey === refKey
                                      ? 'var(--accent)'
                                      : 'transparent',
                                    color: popup?.refKey === refKey
                                      ? '#fff'
                                      : 'var(--accent)',
                                    font: 'var(--type-caption-1)',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    transition: 'all var(--dur-fast)',
                                  }}
                                >
                                  [{ref.id}]
                                </button>
                              );
                            })}
                          </div>

                          {/* Compact reference list */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            {entry.references.map((refKey) => {
                              const ref = REFERENCES[refKey];
                              if (!ref) return null;
                              return (
                                <p
                                  key={refKey}
                                  style={{
                                    font: 'var(--type-caption-1)',
                                    color: 'var(--label-secondary)',
                                    lineHeight: 1.4,
                                  }}
                                >
                                  <span style={{ color: 'var(--accent)', fontWeight: 600 }}>
                                    [{ref.id}]
                                  </span>{' '}
                                  {ref.citation}
                                </p>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        );
      })}

      {/* Citation popup */}
      {popup && (
        <CitationPopup
          refKey={popup.refKey}
          anchorRect={popup.anchorRect}
          onClose={() => setPopup(null)}
        />
      )}
    </div>
  );
}

/* ── Citation popup ─────────────────────────────────────────────────────── */
function CitationPopup({
  refKey,
  anchorRect,
  onClose,
}: {
  refKey: string;
  anchorRect: DOMRect;
  onClose: () => void;
}) {
  const ref = REFERENCES[refKey];
  const popupRef = useRef<HTMLDivElement>(null);

  /* Position popup above/below the badge */
  useEffect(() => {
    const el = popupRef.current;
    if (!el) return;
    const gap = 8;
    const spaceAbove = anchorRect.top;
    const spaceBelow = window.innerHeight - anchorRect.bottom;
    if (spaceBelow >= 160 || spaceBelow >= spaceAbove) {
      el.style.top = `${anchorRect.bottom + gap + window.scrollY}px`;
    } else {
      el.style.top = `${anchorRect.top - el.offsetHeight - gap + window.scrollY}px`;
    }
    const left = Math.min(
      Math.max(12, anchorRect.left),
      window.innerWidth - el.offsetWidth - 12,
    );
    el.style.left = `${left}px`;
  }, [anchorRect]);

  if (!ref) return null;

  return (
    <div
      ref={popupRef}
      onClick={(e) => e.stopPropagation()}
      style={{
        position: 'fixed',
        zIndex: 200,
        maxWidth: 320,
        background: 'var(--bg-elevated)',
        borderRadius: 'var(--r-sheet)',
        boxShadow: 'var(--shadow-3, 0 8px 24px rgba(0,0,0,0.25))',
        border: '0.5px solid var(--separator)',
        padding: '12px 14px',
        top: 0, left: 0,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 8 }}>
        <span style={{
          font: 'var(--type-caption-2)',
          fontWeight: 700,
          color: 'var(--accent)',
          letterSpacing: '0.04em',
        }}>
          [{ref.id}]
        </span>
        <button
          onClick={onClose}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--label-tertiary)', padding: 0, flexShrink: 0,
          }}
        >
          <X size={14} strokeWidth={2} />
        </button>
      </div>
      <p style={{
        font: 'var(--type-caption-1)',
        color: 'var(--label-primary)',
        lineHeight: 1.5,
      }}>
        {ref.citation}
      </p>
      {ref.url && (
        <p style={{
          font: 'var(--type-caption-2)',
          color: 'var(--accent)',
          marginTop: 6,
          wordBreak: 'break-all',
        }}>
          {ref.url}
        </p>
      )}
    </div>
  );
}

/* ── Filter pill ────────────────────────────────────────────────────────── */
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
