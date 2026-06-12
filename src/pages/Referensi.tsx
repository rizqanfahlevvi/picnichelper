import { REFERENCES } from '../data/references';

export function Referensi() {
  const refs = Object.values(REFERENCES).sort((a, b) => a.id - b.id);
  return (
    <div className="ios-screen pb-6">
      <div style={{ padding: '24px 20px 8px' }}>
        <h1 className="ios-large-title">Referensi</h1>
      </div>

      <div className="ios-section"><span className="label">Daftar Pustaka</span></div>
      <div className="ios-list">
        {refs.map((r, i) => (
          <div
            key={r.id}
            id={`ref-${r.id}`}
            style={{
              display: 'flex', gap: 12, padding: '12px 14px',
              borderTop: i === 0 ? 'none' : '0.5px solid var(--separator)',
              background: 'var(--bg-tertiary)',
            }}
          >
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700,
              color: 'var(--accent)', flexShrink: 0, marginTop: 1,
            }}>
              [{r.id}]
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ font: 'var(--type-subheadline)', color: 'var(--label-primary)', lineHeight: 1.5 }}>
                {r.citation}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4, flexWrap: 'wrap' }}>
                {!r.verified && (
                  <span style={{
                    font: 'var(--type-caption-2)', fontWeight: 600,
                    color: 'var(--warning)',
                    background: 'color-mix(in srgb, var(--warning) 12%, transparent)',
                    padding: '2px 8px', borderRadius: 'var(--r-pill)',
                  }}>
                    perlu konfirmasi
                  </span>
                )}
                {r.url && (
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ font: 'var(--type-caption-1)', color: 'var(--accent)', textDecoration: 'none' }}
                  >
                    Buka sumber ↗
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
