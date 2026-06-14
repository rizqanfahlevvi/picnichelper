# CLAUDE.md — Aturan Main PICNIC Helper
> Baca file ini di awal SETIAP sesi sebelum melakukan apa pun. Patuhi tanpa kecuali.
> Jika sebuah instruksi pengguna bertentangan dengan aturan keselamatan klinis di bawah, berhenti dan minta klarifikasi.

## Tentang Proyek
PICNIC Helper (*Pediatric ER & Intensive Care Companion*) adalah clinical bedside
companion berbentuk PWA, untuk dokter umum, dokter anak, dan tenaga medis di
IGD / ICU / PICU / NICU. Fungsinya: perhitungan klinis cepat, panduan teori, dan
dukungan keputusan algoritmik.

Aplikasi ini **alat bantu (panduan/kalkulator), BUKAN pengganti penilaian klinis
profesional.** Konteks pemakaian: gawat darurat, pengguna lelah (sif malam),
satu tangan di smartphone, di samping pasien. Maka: kontras tinggi, target sentuh
besar (min 44px), dark mode, navigasi ergonomis.

Bahasa UI: **Indonesia**. Istilah & akronim medis tetap Inggris (ETT, PALS, NRP,
P/F ratio) dan tidak diterjemahkan.

---

## Tech Stack — Jangan Diganti Tanpa Izin Eksplisit
- React + Vite (HMR cepat)
- TypeScript — **strict mode aktif**
- Tailwind CSS
- shadcn/ui — disalin ke dalam proyek (bukan dependensi tertutup)
- react-router-dom (SPA)

### Gaya Visual — iOS HIG
Seluruh UI mengikuti **iOS Human Interface Guidelines (HIG)**:
- Warna sistem Apple: `--sys-teal`, `--sys-blue`, `--sys-red`, `--sys-orange`, dll.
- Token tipografi: `--type-largetitle`, `--type-title-1`, `--type-headline`, `--type-subheadline`, `--type-body`, `--type-callout`, `--type-footnote`, `--type-caption-1`, `--type-caption-2`
- Token spacing & radius: `--r-card` (12px), `--r-sheet` (16px), `--hit` (44px min touch target)
- Komponen mengikuti pola iOS: grouped list (`ios-list`), navigation bar (`ios-nav`), tab bar (`ios-tabbar`), sheet, card
- Dark mode menggunakan variabel CSS (`--bg-primary`, `--bg-secondary`, `--label-primary`, `--label-secondary`, `--separator`, dll.)
- **DILARANG** menggunakan class Tailwind arbitrary values jika sudah ada token CSS yang sesuai

---

## Arsitektur — Wajib (Clean Architecture)
- ✓ Semua rumus & algoritma medis = **fungsi murni di `/utils`**. TANPA kode React.
      Input sama → output sama. Tanpa efek samping.
- ✓ Data dasar pasien (berat, usia, tinggi) hidup di **SATU tempat: `/store/patientStore.ts`**
      (Zustand + persist ke localStorage `'picnic-patient'`). Diinput sekali, dibaca semua kalkulator.
      → Single Source of Truth (DRY).
- ✓ Komponen UI kecil, satu tugas masing-masing.
      `/components/ui` = elemen shadcn standar; `/components` = gabungan (form, kartu).
- ✓ Konversi input ke `number` secara **eksplisit** sebelum masuk ke `/utils`.
- ✗ JANGAN menaruh angka/rumus medis di luar `/utils`.
- ✗ JANGAN mengetik/menyimpan berat·usia pasien di luar `/store`.

---

## Keselamatan Klinis — TIDAK BISA DITAWAR
- ✗ **DILARANG menebak** rumus, dosis, atau angka medis. Jika ragu: kosongkan,
      beri `// TODO: konfirmasi sumber`, dan katakan "saya tidak tahu / perlu
      konfirmasi". **Lebih baik kosong daripada salah.** (Zero Hallucination)
- ✓ Setiap rumus, teori, dan sistem skoring **wajib berbasis bukti** dan menyebut
      sumber: pedoman internasional (AHA PALS, NRP, AAP) dan/atau lokal Indonesia
      (IDAI, Kemenkes).
- ✓ **Sitasi inline** gaya Vancouver `[1]` di sebelah teks/hasil, dengan daftar
      pustaka singkat di bawah komponen, terhubung ke halaman `/referensi`.
- ✓ **Semua halaman** (kalkulator, teori, skoring, drugs & fluids, monitoring)
      wajib menyertakan **blok referensi** di bagian bawah halaman yang tertaut ke `/referensi`.
- ✓ Setiap halaman kalkulator memuat **disclaimer** yang terlihat namun tak
      mengganggu: "Untuk panduan klinis · bukan pengganti penilaian klinis".

---

## Edge Cases & Validasi Input
- ✓ Beri batasan (boundaries) rasional pada tiap input. Contoh: berat neonatus
      diisi "50" kg → blokir kalkulasi ATAU munculkan peringatan berwarna
      (merah/kuning) yang meminta konfirmasi.
- ✓ Pastikan tak ada string yang lolos sebagai number ke `/utils`.
- ✓ Field input yang kosong ditangani secara eksplisit — jangan tampilkan NaN atau hasil kosong tanpa keterangan.

---

## Navigasi (Hybrid, Responsif)
Menu utama: Home · Kalkulator · Drugs & Fluids · Skoring · Teori · Monitoring & Weaning · Referensi.

### Desktop (≥ 768px) — Sidebar kiri
- Sidebar statis lebar **60px (collapsed) ↔ 220px (expanded)**, persistent via button toggle
- Semua 7 menu tampil sebagai `SidebarItem` (ikon + label saat expanded)
- Tombol toggle collapse: ChevronRight/ChevronLeft di header sidebar
- Theme toggle di bagian bawah sidebar

### Mobile (< 768px) — Bottom Tab Bar + Slide-up Panel
- **Bottom tab bar** (`ios-tabbar`): 4 tab primer + tombol "Menu"
  - Tab primer: Home, Kalkulator, Drugs & Fluids, Skoring (field `primaryMobile: true` di `navItems.ts`)
  - Tombol "Menu": ikon MoreHorizontal, berputar 90° saat panel terbuka
- **Slide-up panel** ("More"): muncul dari bawah saat tombol Menu ditekan
  - Grid 2×2 berisi tab sekunder: Teori, Monitoring, Referensi (dari `SHEET_ITEMS`)
  - Backdrop semi-transparan di belakang panel; klik tutup panel
  - Panel menutup otomatis saat navigasi ke halaman lain
- **Top navigation bar** (`ios-nav`): judul halaman + tombol reset data pasien (muncul jika ada data) + ThemeToggle

---

## Sitasi & Referensi — WAJIB di Setiap Halaman Klinis
- ✓ **Sitasi inline** gaya Vancouver `[n]` langsung di sebelah teks/nilai/rumus yang dirujuk.
- ✓ **Blok referensi** di bagian bawah setiap komponen kalkulator/teori/skoring/drugs,
      format: `[n] Penulis. Judul. Jurnal/Pedoman. Tahun.`
- ✓ Referensi terhubung ke halaman `/referensi` (menggunakan ID dari `src/data/references.ts`).
- ✓ Konten klinis baru harus bersumber dari referensi terbaru yang andal:
      jurnal/guideline internasional (AHA, AAP, WHO, IDSA, ESPEN, dll.),
      lokal Indonesia (IDAI, Kemenkes, PERDATIN), atau repository referensi
      yang sudah disetujui pengguna (mis. file di folder `references/`).
- ✗ JANGAN tambah fitur/konten klinis tanpa sitasi yang valid dan terverifikasi.
- ✗ JANGAN gunakan sitasi dari memori — gunakan referensi yang sudah ada di
      `src/data/references.ts` atau minta pengguna konfirmasi sumber baru.

---

## Data Pasien — State & UX
### Store (`src/store/patientStore.ts`)
Field yang tersimpan di Zustand + localStorage (`'picnic-patient'`):
- `category`: `'neonatus' | 'anak'`
- `nama`: string
- `gender`: `'' | 'L' | 'P'`
- `ageUnit`: `'tahun' | 'bulan' | 'tgl-lahir'`
- `ageInput`: string mentah (angka atau ISO date)
- `ageYears`: string usia dalam tahun (untuk kalkulator)
- `ageMonths`: string usia dalam bulan (untuk kalkulator yang butuh presisi)
- `agePrecise`: label tampilan, mis. `"2 th 3 bln"` atau `"18 bln"`
- `weightKg`, `heightCm`: string

### Aturan UX
- Label section data pasien: **"Data Pasien"** (bukan "Pasien Aktif").
- `PatientSummary`: kartu compact nama/gender + grid usia·berat·tinggi.
  - Dari tanggal lahir → tampilkan usia spesifik: **"2 th 3 bln"** (via `agePrecise`)
  - Dari input bulan → tampilkan: **"18 bln"**
- Form edit `PatientInput`: **hanya tampil di dalam Sheet (modal)**, tidak inline.
- `PatientSummary` dipakai di SEMUA halaman yang menggunakan data pasien (Kalkulator, Drugs & Fluids, dll.).
- Tombol reset data pasien muncul di top nav bar hanya jika ada data pasien.

---

## Aturan Kerja Claude
1. **Jelaskan rencana dulu** (folder, file, rumus + sumbernya) dalam poin-poin. **Tunggu persetujuan** sebelum menulis kode.
2. **Satu tugas per sesi.** Selesaikan & uji sebelum lanjut fitur lain.
3. **Tulis tes otomatis** untuk setiap fungsi baru di `/utils`.
4. Saat melaporkan type error / bug, jelaskan dalam **bahasa awam** dulu.
5. Ragu soal medis atau desain? **TANYA** — jangan berasumsi.

---

## Status Proyek (diperbarui Juni 2026)
Aplikasi sudah fungsional melampaui MVP awal. Fitur yang sudah ada:

- ✅ Navigasi hybrid (sidebar desktop + bottom tab + slide-up More panel mobile)
- ✅ Global state data pasien (Zustand + persist localStorage)
- ✅ Kalkulator: ETT (ukuran + kedalaman), AGD, elektrolit, syringe pump, tekanan darah, renal (eGFR Schwartz)
- ✅ Skoring: PELOD-2, pSOFA, Downes Score, CRIB II
- ✅ Drug Library: 121 obat terverifikasi dari IDAI Formularium 2013 + guidelines internasional
- ✅ Fluid Library & kalkulator cairan
- ✅ Monitoring & Weaning: vital signs checker, weaning checklist
- ✅ Halaman Referensi (terhubung ke `src/data/references.ts`)
- ✅ Dark mode (iOS HIG token system)
- ✅ PWA-ready

### Prioritas Pengembangan Berikutnya (tentative)
- Tes otomatis untuk fungsi `/utils` (belum ada)
- Validasi input dengan pesan error yang informatif di semua kalkulator
- Konten Teori klinis (halaman Teori masih kosong/placeholder)
- Tambah kalkulator: nutrisi parenteral, sepsis scoring, dll.
