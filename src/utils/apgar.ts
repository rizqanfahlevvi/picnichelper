// Apgar Score — evaluasi kondisi bayi baru lahir
// Referensi: Apgar V. 1953 [52]; AAP/ACOG 2015 [53]

export interface ApgarItem {
  score: number;
  label: string;
}

export const APGAR_APPEARANCE: ApgarItem[] = [
  { score: 0, label: 'Biru / pucat seluruh tubuh' },
  { score: 1, label: 'Tubuh merah muda, ekstremitas biru (akrosianosis)' },
  { score: 2, label: 'Merah muda seluruh tubuh' },
];

export const APGAR_PULSE: ApgarItem[] = [
  { score: 0, label: 'Tidak terdeteksi' },
  { score: 1, label: '< 100 ×/mnt' },
  { score: 2, label: '≥ 100 ×/mnt' },
];

export const APGAR_GRIMACE: ApgarItem[] = [
  { score: 0, label: 'Tidak ada respons' },
  { score: 1, label: 'Meringis / gerakan minimal' },
  { score: 2, label: 'Batuk / bersin / menangis kuat' },
];

export const APGAR_ACTIVITY: ApgarItem[] = [
  { score: 0, label: 'Tonus otot tidak ada (flaksid)' },
  { score: 1, label: 'Tonus minimal, fleksi sebagian' },
  { score: 2, label: 'Gerakan aktif, fleksi penuh' },
];

export const APGAR_RESPIRATION: ApgarItem[] = [
  { score: 0, label: 'Tidak ada napas' },
  { score: 1, label: 'Napas lemah / tidak teratur / merintih' },
  { score: 2, label: 'Napas kuat, menangis kuat' },
];

export interface ApgarResult {
  total: number;
  appearance: number;
  pulse: number;
  grimace: number;
  activity: number;
  respiration: number;
  interpretation: 'normal' | 'perlu_stimulasi' | 'distres' | 'kritis';
  label: string;
  color: string;
  action: string;
}

export function calcApgar(
  appearance: number,
  pulse: number,
  grimace: number,
  activity: number,
  respiration: number,
): ApgarResult {
  const total = appearance + pulse + grimace + activity + respiration;
  let interpretation: ApgarResult['interpretation'];
  let label: string;
  let color: string;
  let action: string;

  if (total >= 7) {
    interpretation = 'normal'; label = 'Normal';
    color = 'var(--sys-green)';
    action = 'Perawatan rutin; rawat gabung; inisiasi IMD bila stabil';
  } else if (total >= 4) {
    interpretation = 'perlu_stimulasi'; label = 'Perlu Stimulasi';
    color = 'var(--sys-yellow)';
    action = 'Stimulasi taktil; oksigen aliran bebas; nilai ulang pada 5 menit [53]';
  } else if (total >= 1) {
    interpretation = 'distres'; label = 'Distres Neonatus';
    color = 'var(--sys-orange)';
    action = 'Mulai VTP (ventilasi tekanan positif); panggil tim NICU; siapkan intubasi bila perlu [53]';
  } else {
    interpretation = 'kritis'; label = 'Asfiksia Berat';
    color = 'var(--sys-red)';
    action = 'Resusitasi lengkap: VTP + kompresi dada + epinefrin bila HR < 60 setelah 30 detik VTP [53]';
  }

  return { total, appearance, pulse, grimace, activity, respiration, interpretation, label, color, action };
}
