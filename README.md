# KJRI Frankfurt — Consular & Passport Community Portal 🇮🇩🇩🇪

Portal komunitas dan pelayanan paspor terpadu untuk **Konsulat Jenderal Republik Indonesia (KJRI) di Frankfurt am Main, Jerman**. 

Dirancang dengan gaya visual modern berbasis [Sunny Consent Landing](https://sunny-consent-landing.vercel.app/) (*Plus Jakarta Sans*, Deep Navy `#0B2545`, Warm Amber `#F59E0B`), mendukung antarmuka dwi-bahasa (English & Bahasa Indonesia), formulir dinamis 3 langkah, kalender janji temu (*termin*), penerbitan E-Ticket ber-QR Code, dan pelacakan status berkas secara *real-time*.

---

## 🌟 Fitur Utama

1. **Minimalist & Action-Driven Landing Page:**
   - Hero banner dengan 2 aksi utama: *Book Passport Appointment* & *Track Application*.
   - Pengumuman konsuler & pengingat wajib lapor diri *Peduli WNI*.
   - Metrik yurisdiksi 6 negara bagian Jerman (*Hessen, Baden-Württemberg, Bayern, Nordrhein-Westfalen, Rheinland-Pfalz, Saarland*).

2. **Katalog 4 Layanan Paspor Konsuler:**
   - **Passport Renewal (Expired / Expiring)** — Penggantian paspor habis masa berlaku (&lt; 6 bulan atau sudah habis).
   - **Consular Appointment (Termin Only)** — Booking jadwal kedatangan fisik / reschedule menggunakan kode registrasi.
   - **Damaged Passport Replacement** — Penggantian paspor rusak fisik dengan formulir kronologi & denda PNBP.
   - **Lost Passport Replacement (BAP / SPLP)** — Penggantian paspor hilang dengan verifikasi nomor surat kepolisian Jerman (*Verlustanzeige*).

3. **Formulir Interaktif 3-Langkah (Simple & User-Friendly Wizard):**
   - **Step 1:** Data identitas pemohon, nomor paspor/NIK, alamat domisili di Jerman, kontak WhatsApp Jerman, dan pilihan jenis paspor (*E-Paspor Chip 48 Hlm* atau *Paspor Biasa*). Tersedia tombol **⚡ Quick Demo Auto-Fill**.
   - **Step 2:** Checklist unggahan dokumen dinamis (Paspor lama, *Aufenthaltstitel*, *Meldebescheinigung*, konfirmasi lapor diri *Peduli WNI*, serta surat kehilangan *Verlustanzeige* untuk paspor hilang).
   - **Step 3:** Kalender interaktif pemilihan hari kerja konsuler (Senin–Jumat) & slot jam per 30 menit dengan pemantauan kuota *real-time*.

4. **Penerbitan E-Ticket Janji Temu Resmi (QR Code):**
   - Menghasilkan QR Code unik untuk pemindaian saat memasuki gerbang konsuler.
   - Checklist berkas fisik asli yang wajib dibawa ke kantor perwakilan.
   - Informasi pembayaran non-tunai resmi (*EC-Karte* / Transfer Giro).
   - Tombol *Print / Save as PDF*.

5. **Pelacakan Status Berkas Real-time (5-Stage Visual Stepper):**
   - Dapat dilacak langsung dari Landing Page menggunakan Kode Booking (contoh demo: `FRA-2026-8812`, `FRA-2026-7731`, `FRA-2026-9041`).
   - Linimasa 5 tahap: *Submitted ➔ Document Verified ➔ Biometrics Appointment ➔ In Production ➔ Ready for Pickup / Dispatched*.

6. **Pusat Informasi & FAQ Interaktif:**
   - Kategori terpisah: *Passport Services*, *Peduli WNI*, *Fees & Payment (EUR)*, dan *Termin & Visits*.
   - Dilengkapi *search bar* pencarian instan kata kunci.

7. **Info Konsuler & Kontak Darurat 24/7:**
   - Alamat lengkap: *Zeppelinallee 23, 60325 Frankfurt am Main*.
   - Hotline perlindungan WNI 24/7: `+49 162 412 9044`.

---

## 🚀 Cara Menjalankan Secara Lokal

```bash
# 1. Pastikan dependensi telah terinstal
npm install

# 2. Jalankan development server
npm run dev

# 3. Buka browser pada URL yang ditampilkan (default: http://localhost:5173)
```

Untuk membuat versi produksi (*production build*):
```bash
npm run build
```

---

## 🛠️ Tech Stack

- **Framework:** React 19 + TypeScript + Vite
- **Styling:** Tailwind CSS (Sunny Design Palette tokens)
- **Icons:** Lucide React
- **Micro-interactions:** Canvas Confetti
- **Typography:** Plus Jakarta Sans

---

## 🏛️ Referensi Resmi

- Portal Kementerian Luar Negeri RI: [kemlu.go.id](https://kemlu.go.id)
- KJRI Frankfurt: [kemlu.go.id/frankfurt](https://kemlu.go.id/frankfurt)
- Direktorat Jenderal Imigrasi: [imigrasi.go.id](https://www.imigrasi.go.id)
- Portal Peduli WNI: [peduliwni.kemlu.go.id](https://peduliwni.kemlu.go.id)
