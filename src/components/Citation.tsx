import { useState, useEffect, useRef } from 'react';
import { REFERENCES } from '../data/references';

export function Cite({ source }: { source: keyof typeof REFERENCES }) {
  const ref = REFERENCES[source];
  const [open, setOpen] = useState(false);
  const popRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handler(e: MouseEvent) {
      if (popRef.current && !popRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <span style={{ position: 'relative', display: 'inline-block' }}>
      <sup
        onClick={(e) => { e.stopPropagation(); setOpen((v) => !v); }}
        style={{
          cursor: 'pointer',
          fontSize: '0.65em',
          fontWeight: 600,
          color: 'var(--label-tertiary)',
          letterSpacing: 0,
          userSelect: 'none',
          padding: '0 1px',
        }}
      >
        [{ref.id}]
      </sup>
      {open && (
        <div
          ref={popRef}
          style={{
            position: 'absolute',
            bottom: 'calc(100% + 4px)',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 200,
            width: 260,
            background: 'var(--bg-elevated)',
            border: '0.5px solid var(--separator)',
            borderRadius: 'var(--r-sm)',
            boxShadow: 'var(--shadow-2)',
            padding: '10px 12px',
          }}
        >
          <p style={{ font: 'var(--type-caption-1)', color: 'var(--label-secondary)', lineHeight: 1.5, margin: 0 }}>
            <span style={{ fontWeight: 700, color: 'var(--label-primary)' }}>[{ref.id}]</span>{' '}
            {ref.citation}
          </p>
          {ref.url && (
            <a
              href={ref.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ font: 'var(--type-caption-2)', color: 'var(--accent)', marginTop: 4, display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
            >
              {ref.url}
            </a>
          )}
        </div>
      )}
    </span>
  );
}
