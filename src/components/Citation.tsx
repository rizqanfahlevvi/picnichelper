import { Link } from 'react-router-dom';
import { REFERENCES } from '../data/references';

/**
 * Sitasi inline gaya Vancouver [n]. Menunjuk ke entri di registry referensi
 * dan menautkan ke halaman /referensi. (CLAUDE.md: evidence-based + sitasi)
 */
export function Cite({ source }: { source: keyof typeof REFERENCES }) {
  const ref = REFERENCES[source];
  return (
    <Link to="/referensi" title={ref.citation} className="ios-cite">
      [{ref.id}]
    </Link>
  );
}
