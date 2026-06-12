import { AlertTriangle } from 'lucide-react';

/** Disclaimer klinis — terlihat namun tidak mengganggu (CLAUDE.md). */
export function Disclaimer() {
  return (
    <div className="ios-disclaimer">
      <AlertTriangle size={12} />
      <span>Untuk panduan klinis · bukan pengganti penilaian klinis profesional.</span>
    </div>
  );
}
