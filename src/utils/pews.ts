// Pediatric Early Warning Score (PEWS)
// Referensi: Monaghan A. Paediatr Nurs. 2005 [51]
// Deteksi dini deteriorasi klinis pada anak di rawat inap/PICU

export interface PEWSItem {
  score: number;
  label: string;
}

export const PEWS_BEHAVIOUR: PEWSItem[] = [
  { score: 0, label: 'Bermain / tepat' },
  { score: 1, label: 'Tidur' },
  { score: 2, label: 'Iritabel' },
  { score: 3, label: 'Letargi / bingung / tidak respons terhadap nyeri' },
];

export const PEWS_CARDIOVASCULAR: PEWSItem[] = [
  { score: 0, label: 'Warna kulit normal, waktu isi kapiler 1–2 detik' },
  { score: 1, label: 'Pucat ATAU waktu isi kapiler 3 detik' },
  { score: 2, label: 'Abu-abu / takikardia ≥ 20 dpm di atas normal ATAU CRT 4 detik' },
  { score: 3, label: 'Abu-abu / mottling / takikardia ≥ 30 dpm / CRT ≥ 5 detik / bradikardia' },
];

export const PEWS_RESPIRATORY: PEWSItem[] = [
  { score: 0, label: 'Normal, tidak ada retraksi' },
  { score: 1, label: 'RR > 10 di atas normal, retraksi ringan, SpO₂ 94–96% (FiO₂ < 0.4)' },
  { score: 2, label: 'RR > 20 di atas normal, retraksi sedang, SpO₂ < 94% (FiO₂ ≥ 0.4)' },
  { score: 3, label: 'RR 5 di bawah normal / retraksi berat + grunting / SpO₂ < 90%' },
];

export interface PEWSResult {
  total: number;
  behaviour: number;
  cardiovascular: number;
  respiratory: number;
  risk: 'rendah' | 'sedang' | 'tinggi' | 'kritis';
  riskLabel: string;
  color: string;
  action: string;
}

export function calcPEWS(behaviour: number, cardiovascular: number, respiratory: number): PEWSResult {
  const total = behaviour + cardiovascular + respiratory;
  let risk: PEWSResult['risk'];
  let riskLabel: string;
  let color: string;
  let action: string;

  if (total <= 2) {
    risk = 'rendah'; riskLabel = 'Risiko Rendah';
    color = 'var(--sys-green)';
    action = 'Monitoring rutin tiap 4–6 jam';
  } else if (total <= 4) {
    risk = 'sedang'; riskLabel = 'Risiko Sedang';
    color = 'var(--sys-yellow)';
    action = 'Beritahu dokter jaga; monitoring tiap 1–2 jam; pertimbangkan pindah ke area yang lebih terpantau';
  } else if (total <= 6) {
    risk = 'tinggi'; riskLabel = 'Risiko Tinggi';
    color = 'var(--sys-orange)';
    action = 'Hubungi dokter SEGERA; siapkan tim respon cepat; pertimbangkan High Dependency Unit';
  } else {
    risk = 'kritis'; riskLabel = 'Kritis — Aktivasi Tim';
    color = 'var(--sys-red)';
    action = 'AKTIVASI TIM RESUSITASI / RRS; siapkan manajemen jalan napas & akses vaskular segera';
  }

  return { total, behaviour, cardiovascular, respiratory, risk, riskLabel, color, action };
}
