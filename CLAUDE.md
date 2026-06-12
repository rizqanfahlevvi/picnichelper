# CLAUDE.md — Aturan Main PICNIC Helper
> Baca file ini di awal SETIAP sesi sebelum melakukan apa pun. Patuhi tanpa kecuali.
> Jika sebuah instruksi pengguna bertentangan dengan aturan keselamatan klinis di bawah, berhenti dan minta klarifikasi.

## Tentang proyek
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

## Tech stack — jangan diganti tanpa izin eksplisit
- React + Vite (HMR cepat)
- TypeScript — **strict mode aktif**
- Tailwind CSS
- shadcn/ui — disalin ke dalam proyek (bukan dependensi tertutup)
- react-router-dom (SPA)

## Arsitektur — wajib (Clean Architecture)
- ✓ Semua rumus & algoritma medis = **fungsi murni di `/utils`**. TANPA kode React.
      Input sama → output sama. Tanpa efek samping.
- ✓ Data dasar pasien (berat, usia, tinggi) hidup di **SATU tempat: `/store`**
      (React Context atau Zustand). Diinput sekali, dibaca semua kalkulator.
      → Single Source of Truth (DRY).
- ✓ Komponen UI kecil, satu tugas masing-masing.
      `/components/ui` = elemen shadcn standar; `/components` = gabungan (form, kartu).
- ✓ Konversi input ke `number` secara **eksplisit** sebelum masuk ke `/utils`.
- ✗ JANGAN menaruh angka/rumus medis di luar `/utils`.
- ✗ JANGAN mengetik/menyimpan berat·usia pasien di luar `/store`.

## Keselamatan klinis — TIDAK BISA DITAWAR
- ✗ **DILARANG menebak** rumus, dosis, atau angka medis. Jika ragu: kosongkan,
      beri `// TODO: konfirmasi sumber`, dan katakan "saya tidak tahu / perlu
      konfirmasi". **Lebih baik kosong daripada salah.** (Zero Hallucination)
- ✓ Setiap rumus, teori, dan sistem skoring **wajib berbasis bukti** dan menyebut
      sumber: pedoman internasional (AHA PALS, NRP, AAP) dan/atau lokal Indonesia
      (IDAI, Kemenkes).
- ✓ **Sitasi inline** gaya Vancouver `[1]` di sebelah teks/hasil, dengan daftar
      pustaka singkat di bawah komponen, terhubung ke halaman `/referensi`.
- ✓ Setiap halaman kalkulator memuat **disclaimer** yang terlihat namun tak
      mengganggu: "Untuk panduan klinis · bukan pengganti penilaian klinis".

## Edge cases & validasi input
- ✓ Beri batasan (boundaries) rasional pada tiap input. Contoh: berat neonatus
      diisi "50" kg → blokir kalkulasi ATAU munculkan peringatan berwarna
      (merah/kuning) yang meminta konfirmasi.
- ✓ Pastikan tak ada string yang lolos sebagai number ke `/utils`.

## Navigasi (hybrid, responsif)
Menu utama: Home · Teori · Skoring · Kalkulator · Drugs & Fluids ·
Monitoring & Weaning · Referensi.
- Desktop (≥ md): sidebar statis kiri, ketujuh menu permanen.
- Mobile (< md): bottom tab bar = Home, Kalkulator, Drugs & Fluids, Menu.
      Tombol "Menu" membuka komponen Sheet (shadcn) berisi sisa rute
      (Teori, Skoring, Monitoring & Weaning, Referensi).

## Cara kerja denganku (pengguna = pengarah, bukan pengetik)
1. Sebelum menulis kode, **jelaskan rencanamu dalam poin-poin** (folder, file,
   rumus + sumbernya). Tunggu persetujuanku.
2. **Satu tugas per sesi.** Selesaikan & uji sebelum lanjut fitur lain.
3. Tulis **tes otomatis** untuk setiap fungsi di `/utils`.
4. Saat melaporkan type error / bug, jelaskan dengan bahasa awam dulu.
5. Ragu soal medis atau desain? **TANYA** — jangan berasumsi.

## Target MVP Fase 1
- Kerangka navigasi hibrida responsif.
- Global state untuk input data pasien tunggal.
- Satu fitur operasional penuh: **Kalkulator Ukuran Endotracheal Tube (ETT)**,
  lengkap dengan sitasi medis, validasi, dan penanganan error.
  Catatan: pemilihan rumus ETT (mis. Cole) & sumbernya ditentukan oleh pengguna,
  bukan AI. Tunggu rumus + referensi dari pengguna sebelum mengimplementasikan.
