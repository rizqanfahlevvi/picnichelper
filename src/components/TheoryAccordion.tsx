import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export interface TheorySection {
  title: string;
  content: string;
}

export function TheoryAccordion({ sections }: { sections: TheorySection[] }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="ios-card" style={{ overflow: 'hidden' }}>
      <div style={{ padding: '10px 14px 8px' }}>
        <p style={{ font: 'var(--type-caption-2)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--label-secondary)' }}>
          Panduan Klinis
        </p>
      </div>
      {sections.map((s, i) => (
        <div key={i} style={{ borderTop: '0.5px solid var(--separator)' }}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            style={{
              width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '11px 14px', background: 'none', border: 'none', cursor: 'pointer',
              minHeight: 'var(--hit)',
            }}
          >
            <span style={{ font: 'var(--type-subheadline)', fontWeight: 600, color: 'var(--label-primary)', textAlign: 'left' }}>
              {s.title}
            </span>
            {open === i
              ? <ChevronUp size={16} color="var(--label-tertiary)" />
              : <ChevronDown size={16} color="var(--label-tertiary)" />
            }
          </button>
          {open === i && (
            <div style={{ padding: '0 14px 14px' }}>
              <p style={{ font: 'var(--type-footnote)', color: 'var(--label-secondary)', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                {s.content}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
