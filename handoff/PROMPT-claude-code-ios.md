# Prompt Handoff — Terapkan iOS Design Language ke PICNIC Helper

> Salin seluruh isi blok di bawah ini sebagai **pesan pertama** Anda ke Claude Code,
> setelah menaruh file `ios-theme.css` ke dalam repo. Prompt ini sengaja menyuruh
> Claude **berdiskusi & menjelaskan rencana dulu** sebelum menulis kode (sesuai CLAUDE.md).

---

## 📋 Langkah persiapan (lakukan sendiri, sekali saja)

1. Salin `handoff/ios-theme.css` → ke repo di **`src/styles/ios-theme.css`**.
2. Di `index.html`, tambah font Inter (fallback non-Apple):
   ```html
   <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
   ```
3. Pastikan `CLAUDE.md` sudah ada di akar proyek (aturan main).
4. Buka Claude Code, tempel prompt di bawah.

---

## 🤖 PROMPT (salin mulai dari sini)

```
Baca CLAUDE.md dan src/styles/ios-theme.css dulu. Jangan menulis kode apa pun
sampai saya menyetujui rencanamu.

KONTEKS
Kita akan mengubah TAMPILAN PICNIC Helper menjadi bahasa desain Apple iOS 17/18
(grouped-inset list, chrome translucent, bottom tab bar, dark mode), TANPA
mengubah logika medis apa pun. File src/styles/ios-theme.css adalah sumber
kebenaran visual: berisi token (warna, tipografi, radius, spacing) dan kelas
komponen .ios-* (.ios-nav, .ios-list, .ios-row, .ios-section, .ios-card,
.ios-result, .ios-segmented, .ios-warn, .ios-cite, .ios-disclaimer, .ios-tabbar).

ATURAN KERAS (tidak bisa ditawar)
1. JANGAN menyentuh apa pun di src/utils/** — semua rumus (ett.ts, ettDepth.ts,
   dst) dan tesnya tetap utuh. Ini hanya pekerjaan kulit/UI.
2. JANGAN mengubah angka, rumus, atau ambang validasi. Kalau butuh nilai medis
   baru, berhenti dan tanya saya — jangan menebak.
3. PERTAHANKAN guardrail: sitasi inline [1][2][3] (pakai .ios-cite), disclaimer
   "Untuk panduan klinis · bukan pengganti penilaian klinis" (pakai .ios-disclaimer)
   di setiap halaman kalkulator, dan banner validasi (pakai .ios-warn /
   .ios-warn--danger).
4. Single source of truth pasien tetap di /store — jangan pindahkan.
5. Dark mode mengikuti konvensi shadcn (class .dark di <html>). Sediakan toggle
   bila belum ada; default mengikuti OS, bisa di-override.

TARGET TAMPILAN PER HALAMAN
- Navigasi (AppLayout/Sidebar/BottomBar):
    • Desktop (≥ md): sidebar 7 menu tetap — boleh tetap, tapi warna/teks pakai
      token iOS (--bg-secondary, --label-*, --accent).
    • Mobile (< md): bottom tab bar pakai .ios-tabbar + .ios-tab, isi 4 item
      (Home, Kalkulator, Drugs & Fluids, Menu). Tombol Menu membuka Sheet shadcn
      berisi sisa rute (Teori, Skoring, Monitoring & Weaning, Referensi).
    • Top bar pakai .ios-nav (+ .ios-nav--plain saat di puncak large-title).
- Home:
    • Large title "PICNIC Helper" (.ios-large-title) + subjudul.
    • Kartu "Pasien Aktif" = wujud single source of truth: Usia · Berat · Tinggi
      (3 kolom, angka mono besar), tap → buka editor (Sheet) yang menulis ke /store.
    • Section "Akses Cepat" (.ios-section + .ios-list) berisi baris .ios-row:
      Kalkulator ETT (tint-resp), Cairan Rumatan (tint-fluid), Obat Emergensi (tint-drug).
    • Section "Modul" berisi sisa rute. Setiap baris pakai .ios-row-icon dengan
      kelas tint kategori (.tint-resp/.tint-fluid/.tint-drug/.tint-score/.tint-theory…).
    • .ios-disclaimer di bawah.
- Kalkulator ETT (komponen kalkulator utama):
    • Judul + ikon kategori (tint-resp / teal).
    • Strip "Data Pasien" membaca dari /store (read-only, tap untuk ubah).
    • Segmented (.ios-segmented) untuk mode: "Anak (≥1 th)" / "Neonatus (<1 th)".
    • Hasil pakai .ios-card + .ios-result-grid + .ios-result (angka .ios-result-value
      mono, warna tint). Tampilkan rumus kecil sbg .ios-result-note (mis. "usia/4 + 4").
    • Sitasi .ios-cite di judul section hasil; daftar pustaka ringkas di bawah,
      tertaut ke /referensi.
    • Validasi: usia <1 th di mode Anak → .ios-warn--danger; berat di luar rentang
      neonatus → .ios-warn--danger; input kosong → .ios-warn. (Ambil ambang dari
      kode yang sudah ada — jangan ganti.)
    • Pertahankan catatan "Tabel NRP perlu konfirmasi" bila ada di sumbernya.

IKON
Pakai gaya SF Symbols (line, stroke ~1.75). Boleh pakai lucide-react (sudah umum
di stack shadcn) sebagai padanan open-source. Ikon baris diletakkan dalam squircle
.ios-row-icon berwarna tint kategori, glyph putih.

INTEGRASI shadcn (opsional tapi disarankan)
Lihat blok "SHADCN BRIDGE" di ios-theme.css. Petakan token shadcn (--background,
--card, --foreground, --primary, --border, --ring, --radius) di src/index.css ke
nilai iOS agar Card/Button/Badge ikut berubah otomatis. Konversi hex → format
channel HSL milik shadcn.

YANG SAYA MINTA SEKARANG (JANGAN langsung ngoding)
Balas dengan RENCANA dalam poin-poin:
  a) Daftar file yang akan kamu ubah/buat (path tepat) + alasan singkat.
  b) Bagaimana kamu memetakan setiap halaman ke kelas .ios-* di atas.
  c) Rencana navigasi hibrida (sidebar desktop vs tab bar + Sheet mobile).
  d) Rencana dark-mode (toggle + .dark).
  e) Konfirmasi tertulis: "Tidak menyentuh /utils, tidak mengubah angka/rumus,
     mempertahankan sitasi + disclaimer + validasi."
  f) Risiko/keraguan yang ingin kamu tanyakan ke saya.
Setelah saya setujui, kerjakan SATU halaman dulu (mulai dari Home), tunjukkan
hasilnya, baru lanjut ke ETT. Satu langkah per giliran.
```

---

## ✅ Checklist verifikasi (untuk Anda, setelah Claude selesai per halaman)

- [ ] Tidak ada perubahan di `src/utils/**` (cek `git diff src/utils` — harus kosong).
- [ ] Semua tes `/utils` masih hijau (`npm test`).
- [ ] Disclaimer muncul di tiap halaman kalkulator.
- [ ] Sitasi `[1][2][3]` masih tampil & tertaut ke `/referensi`.
- [ ] Validasi: coba isi berat `50` di mode Neonatus → harus muncul peringatan.
- [ ] Data pasien diinput sekali, terbaca di ETT (single source of truth).
- [ ] Tab bar mobile = Home · Kalkulator · Drugs & Fluids · Menu (Menu → Sheet).
- [ ] Dark mode jalan & kontras tinggi (uji simulasi sif malam).
- [ ] Target sentuh ≥ 44px (var `--hit`).

---

### Tips alur kerja
- **Satu halaman per giliran.** Jangan biarkan Claude mengerjakan semua sekaligus —
  itu sumber inkonsistensi & bug yang sulit dilacak.
- Kalau hasilnya melenceng dari mockup, kirim **screenshot mockup** + kalimat:
  *"Samakan dengan ini; pakai kelas .ios-* dari ios-theme.css, jangan bikin gaya sendiri."*
- Untuk second opinion ke Gemini: tempel `ios-theme.css` + rencana Claude, tanya
  *"apa risiko & penyederhanaan yang kamu lihat?"*
