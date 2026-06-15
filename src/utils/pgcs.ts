// Pediatric Glasgow Coma Scale (pGCS)
// Modifikasi verbal untuk bayi & anak kecil yang belum bisa bicara
// Referensi: Teasdale & Jennett 1974 [49]; Reilly et al. 1988 [50]

export interface GCSItem {
  score: number;
  label: string;
  detail: string;
}

export const EYE_ITEMS: GCSItem[] = [
  { score: 4, label: 'Spontan',                  detail: 'Mata terbuka spontan tanpa stimulus' },
  { score: 3, label: 'Terhadap suara',            detail: 'Mata terbuka saat dipanggil/bicara' },
  { score: 2, label: 'Terhadap nyeri',            detail: 'Mata terbuka hanya saat nyeri' },
  { score: 1, label: 'Tidak ada respons',         detail: 'Tidak membuka mata sama sekali' },
];

// Verbal — versi dewasa/anak > 5 tahun
export const VERBAL_ITEMS_ADULT: GCSItem[] = [
  { score: 5, label: 'Orientasi penuh',           detail: 'Menyebut nama, tempat, waktu dengan benar' },
  { score: 4, label: 'Bingung / disorientasi',    detail: 'Percakapan ada tapi disorientasi' },
  { score: 3, label: 'Kata tidak tepat',          detail: 'Bicara kata-kata tapi tidak membentuk kalimat bermakna' },
  { score: 2, label: 'Suara tidak jelas',         detail: 'Hanya mengeluarkan suara (erangan, rintihan)' },
  { score: 1, label: 'Tidak ada suara',           detail: 'Tidak ada respons verbal sama sekali' },
];

// Verbal — modifikasi pediatri (bayi & anak < 2 tahun) [50]
export const VERBAL_ITEMS_PEDS: GCSItem[] = [
  { score: 5, label: 'Mengoceh / kata-kata sesuai usia', detail: 'Bayi: mengoceh. Anak: kata tepat sesuai usia' },
  { score: 4, label: 'Menangis tapi dapat ditenangkan',  detail: 'Menangis tapi respons terhadap konsolasi' },
  { score: 3, label: 'Menangis tidak dapat ditenangkan', detail: 'Iritabel, tidak bisa ditenangkan' },
  { score: 2, label: 'Merintih / gelisah',               detail: 'Suara tidak jelas, tidak membentuk kata' },
  { score: 1, label: 'Tidak ada suara',                  detail: 'Tidak ada respons verbal' },
];

export const MOTOR_ITEMS: GCSItem[] = [
  { score: 6, label: 'Mengikuti perintah',        detail: 'Bergerak sesuai instruksi verbal (anak > 2 thn)' },
  { score: 5, label: 'Melokalisasi nyeri',         detail: 'Tangan bergerak menuju titik nyeri' },
  { score: 4, label: 'Fleksi normal / withdrawal', detail: 'Menarik anggota dari stimulus nyeri' },
  { score: 3, label: 'Fleksi abnormal (Dekortikasi)', detail: 'Fleksi pergelangan + adduksi bahu (postur dekortikasi)' },
  { score: 2, label: 'Ekstensi abnormal (Deserebrasi)', detail: 'Ekstensi + pronasi + fleksi pergelangan (postur deserebrasi)' },
  { score: 1, label: 'Tidak ada respons',         detail: 'Tidak ada gerakan terhadap stimulus nyeri' },
];

export interface PGCSResult {
  total: number;       // 3–15
  eye: number;
  verbal: number;
  motor: number;
  severity: 'berat' | 'sedang' | 'ringan' | 'normal';
  severityLabel: string;
  color: string;
  detail: string;
}

export function calcPGCS(eye: number, verbal: number, motor: number): PGCSResult {
  const total = eye + verbal + motor;
  let severity: PGCSResult['severity'];
  let severityLabel: string;
  let color: string;
  let detail: string;

  if (total <= 8) {
    severity = 'berat'; severityLabel = 'Cedera Kepala Berat';
    color = 'var(--sys-red)';
    detail = 'GCS ≤ 8: pertimbangkan intubasi untuk proteksi jalan napas [49]';
  } else if (total <= 12) {
    severity = 'sedang'; severityLabel = 'Cedera Kepala Sedang';
    color = 'var(--sys-yellow)';
    detail = 'GCS 9–12: monitor ketat, evaluasi ulang tiap 30 menit [49]';
  } else if (total <= 14) {
    severity = 'ringan'; severityLabel = 'Cedera Kepala Ringan';
    color = 'var(--sys-orange)';
    detail = 'GCS 13–14: observasi, evaluasi CT-scan sesuai indikasi [49]';
  } else {
    severity = 'normal'; severityLabel = 'Kesadaran Normal';
    color = 'var(--sys-green)';
    detail = 'GCS 15: kesadaran penuh';
  }

  return { total, eye, verbal, motor, severity, severityLabel, color, detail };
}
