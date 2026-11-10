import { ServiceItem } from '../types';

export const servicesData: ServiceItem[] = [
  // Top Row: Passport Services
  {
    id: 'passport-expired',
    titleEn: 'Passport Renewal (Expired / Expiring)',
    titleId: 'Penggantian Paspor Habis Masa Berlaku',
    tagEn: 'Standard Passport',
    tagId: 'Paspor Reguler',
    descriptionEn: 'For Indonesian citizens whose passport validity is under 6 months or has already expired while residing in Germany.',
    descriptionId: 'Bagi WNI yang masa berlaku paspornya tersisa kurang dari 6 bulan atau telah habis masa berlakunya di Jerman.',
    feeEur: 65,
    durationEn: '3 – 4 Working Days after Biometrics',
    durationId: '3 – 4 Hari Kerja setelah Foto Biometrik',
    iconName: 'BookOpenCheck',
    requiredDocsEn: [
      'Current / Old Indonesian Passport',
      'Valid German Residence Title (Aufenthaltstitel / Visa)',
      'Proof of German Residence (Meldebescheinigung)',
      'Peduli WNI Lapor Diri Registration Confirmation'
    ],
    requiredDocsId: [
      'Paspor Lama / Asli yang akan diganti',
      'Izin Tinggal Jerman yang masih berlaku (Aufenthaltstitel / Visa)',
      'Surat Keterangan Domisili Jerman (Meldebescheinigung)',
      'Bukti Konfirmasi Lapor Diri di Portal Peduli WNI'
    ]
  },
  {
    id: 'passport-damaged',
    titleEn: 'Damaged Passport Replacement',
    titleId: 'Penggantian Paspor Rusak',
    tagEn: 'Special Procedure',
    tagId: 'Prosedur Khusus',
    descriptionEn: 'For passports with torn, water-damaged, burnt, or unreadable biometrics/information pages.',
    descriptionId: 'Bagi paspor yang sobek, terkena air, terbakar, halaman data tidak terbaca, atau rusak fisik lainnya.',
    feeEur: 100, // Includes fee + damage fine
    durationEn: '4 – 5 Working Days (Includes BAP Examination)',
    durationId: '4 – 5 Hari Kerja (Termasuk Pemeriksaan BAP)',
    iconName: 'FileWarning',
    requiredDocsEn: [
      'Physical damaged passport (must be presented at counter)',
      'Written chronology statement explaining the damage',
      'Valid German Residence Permit (Aufenthaltstitel)',
      'Proof of German Residence (Meldebescheinigung)'
    ],
    requiredDocsId: [
      'Fisik paspor yang rusak (wajib dibawa saat kehadiran loket)',
      'Surat pernyataan kronologi penyebab kerusakan',
      'Izin Tinggal Jerman yang sah (Aufenthaltstitel)',
      'Bukti Domisili Jerman (Meldebescheinigung)'
    ]
  },
  {
    id: 'passport-lost',
    titleEn: 'Lost Passport Replacement',
    titleId: 'Penggantian Paspor Hilang',
    tagEn: 'Special Procedure',
    tagId: 'Prosedur Khusus',
    descriptionEn: 'For lost or stolen passports in Germany. Requires an official German Police loss report (Verlustanzeige).',
    descriptionId: 'Bagi paspor yang hilang atau dicuri di wilayah Jerman. Memerlukan surat laporan kehilangan dari kepolisian Jerman.',
    feeEur: 135, // Includes fee + lost passport fine
    durationEn: '5 – 7 Working Days (Requires BAP Investigation)',
    durationId: '5 – 7 Hari Kerja (Memerlukan Pemeriksaan BAP)',
    iconName: 'AlertTriangle',
    requiredDocsEn: [
      'German Police Loss Report (Polizeiliche Verlustanzeige)',
      'Copy of lost passport identity page (if available)',
      'Valid German Residence Permit (Aufenthaltstitel)',
      'Proof of German Residence (Meldebescheinigung)'
    ],
    requiredDocsId: [
      'Surat Keterangan Kehilangan Kepolisian Jerman (Verlustanzeige)',
      'Fotokopi paspor yang hilang (jika ada)',
      'Izin Tinggal Jerman aktif (Aufenthaltstitel)',
      'Surat Domisili Jerman (Meldebescheinigung)'
    ]
  },

  // Bottom Row: Consular Appointment & Other Services
  {
    id: 'passport-appointment-only',
    titleEn: 'Consular Appointment (Termin Only)',
    titleId: 'Permohonan Termin (Janji Temu)',
    tagEn: 'Calendar Booking',
    tagId: 'Reservasi Jadwal',
    descriptionEn: 'Directly schedule or reschedule your physical visit to the consular counter using an existing application code.',
    descriptionId: 'Pemesanan atau penjadwalan ulang jadwal kehadiran fisik di loket konsuler bagi yang telah memiliki kode permohonan.',
    feeEur: 0,
    durationEn: 'Instant E-Ticket confirmation',
    durationId: 'Konfirmasi E-Ticket instan',
    iconName: 'CalendarCheck2',
    requiredDocsEn: [
      'Active Application Registration Code (if already applied)',
      'Passport Number or NIK',
      'Email for E-Ticket confirmation'
    ],
    requiredDocsId: [
      'Kode Registrasi Permohonan Berkas (jika sudah mengisi form)',
      'Nomor Paspor atau NIK',
      'Email aktif untuk konfirmasi E-Ticket'
    ]
  },
  {
    id: 'other-consular-services',
    titleEn: 'Other Consular Services',
    titleId: 'Layanan Lainnya',
    tagEn: 'General Consular Affairs',
    tagId: 'Kekonsuleran & Legalisasi',
    descriptionEn: 'Appointment booking for document legalizations, civil registrations (birth/marriage), attestations, or custom consular needs.',
    descriptionId: 'Pemesanan janji temu untuk legalisasi dokumen, pencatatan sipil (kelahiran/pernikahan), surat keterangan, dan urusan konsuler lainnya.',
    feeEur: 0,
    durationEn: 'Scheduled by Termin',
    durationId: 'Sesuai Jadwal Termin',
    iconName: 'FileSpreadsheet',
    requiredDocsEn: [
      'Original documents to be legalized or registered',
      'Valid Indonesian Passport or KTP',
      'Valid German Residence Title (Aufenthaltstitel)',
      'Peduli WNI Lapor Diri Confirmation'
    ],
    requiredDocsId: [
      'Dokumen asli yang akan dilegalisasi atau dicatatkan',
      'Paspor Indonesia asli atau KTP yang sah',
      'Izin Tinggal Jerman (Aufenthaltstitel)',
      'Bukti Lapor Diri di Portal Peduli WNI'
    ]
  }
];
