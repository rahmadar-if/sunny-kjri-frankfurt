import { ApplicationRecord, FaqItem } from '../types';

export const mockApplications: ApplicationRecord[] = [
  {
    id: 'FRA-2026-8812',
    serviceId: 'passport-expired',
    serviceName: 'Passport Renewal (Expired / Expiring)',
    applicantName: 'Budi Santoso',
    nik: '3273012304910002',
    passportNumber: 'B8291048',
    email: 'budi.santoso@example.de',
    phone: '+49 176 12345678',
    germanAddress: 'Mainzer Landstraße 182, 60327 Frankfurt am Main',
    passportType: 'electronic',
    status: 'in_production',
    submissionDate: '2026-11-04',
    appointmentDate: '2026-11-08',
    appointmentTime: '10:00 - 10:30 CET',
    notes: 'Biometrics and fingerprint scan completed successfully. Passport is currently being engraved and encoded by the immigration printing unit.',
    feePaid: 65,
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=' + encodeURIComponent('https://demo-crm.sunny.co.id/service/case'),
    dhlTrackingNumber: 'JJD0003948192847DE',
    dhlStatus: 'Awaiting pickup from consular office',
    dhlEstimatedDelivery: '1 - 2 Business Days'
  },
  {
    id: 'FRA-2026-7731',
    serviceId: 'passport-lost',
    serviceName: 'Lost Passport Replacement',
    applicantName: 'Siti Rahmawati',
    nik: '3171055502930001',
    passportNumber: 'C1928471',
    email: 'siti.rahmawati@gmail.com',
    phone: '+49 152 98765432',
    germanAddress: 'Königstraße 45, 70173 Stuttgart',
    passportType: 'ordinary',
    status: 'verified',
    submissionDate: '2026-11-07',
    appointmentDate: '2026-11-14',
    appointmentTime: '11:00 - 11:30 CET',
    notes: 'Police loss report (Verlustanzeige) verified. Please arrive 15 minutes before your scheduled termin with all original hardcopies.',
    feePaid: 135,
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=' + encodeURIComponent('https://demo-crm.sunny.co.id/service/case'),
    dhlTrackingNumber: 'JJD0003957281934DE',
    dhlStatus: 'Scheduled for dispatch post-appointment',
    dhlEstimatedDelivery: '1 - 2 Business Days'
  },
  {
    id: 'FRA-2026-9041',
    serviceId: 'passport-expired',
    serviceName: 'Passport Renewal (Expired / Expiring)',
    applicantName: 'Aditya Pratama',
    nik: '3578011209880004',
    passportNumber: 'A9301928',
    email: 'aditya.p@tum.de',
    phone: '+49 170 33445566',
    germanAddress: 'Leopoldstraße 88, 80802 München',
    passportType: 'electronic',
    status: 'ready_for_pickup',
    submissionDate: '2026-10-28',
    appointmentDate: '2026-11-02',
    appointmentTime: '09:30 - 10:00 CET',
    notes: 'Your new electronic passport has been issued and dispatched via registered DHL Express delivery (Einschreiben).',
    feePaid: 65,
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=' + encodeURIComponent('https://demo-crm.sunny.co.id/service/case'),
    dhlTrackingNumber: 'JJD0003928174829DE',
    dhlStatus: 'Out for delivery with DHL courier in München',
    dhlEstimatedDelivery: 'Today by 17:00 CET'
  }
];

export const faqData: FaqItem[] = [
  {
    category: 'passport',
    questionEn: 'When can I apply for passport renewal before it expires?',
    questionId: 'Kapan saya dapat mengajukan penggantian paspor sebelum habis masa berlaku?',
    answerEn: 'You may apply for passport renewal at KJRI Frankfurt as early as 6 months before your current passport expiration date, or immediately if your passport has already expired or has no blank pages remaining.',
    answerId: 'Anda dapat mengajukan penggantian paspor di KJRI Frankfurt paling cepat 6 bulan sebelum masa berlaku paspor habis, atau segera jika paspor telah kedaluwarsa atau kehabisan halaman visa.'
  },
  {
    category: 'passport',
    questionEn: 'What is the difference between an Electronic Passport (E-Paspor) and an Ordinary Passport?',
    questionId: 'Apa perbedaan antara Paspor Elektronik (E-Paspor) dan Paspor Biasa?',
    answerEn: 'The electronic passport contains a biometric chip storing facial and fingerprint biometric data, offers stronger anti-fraud security, and qualifies for visa waiver programs in certain countries (e.g., Japan). Both passports have a 10-year validity period for adult Indonesian citizens.',
    answerId: 'E-paspor memiliki chip biometrik terintegrasi yang menyimpan data biometrik wajah dan sidik jari, memiliki tingkat keamanan lebih tinggi, serta memenuhi syarat bebas visa (visa waiver) ke negara tertentu seperti Jepang. Keduanya memiliki masa berlaku 10 tahun untuk WNI dewasa.'
  },
  {
    category: 'peduli-wni',
    questionEn: 'Is Lapor Diri on Peduli WNI mandatory before applying for a passport?',
    questionId: 'Apakah Lapor Diri di Portal Peduli WNI wajib dilakukan sebelum mengajukan paspor?',
    answerEn: 'Yes. All Indonesian citizens residing abroad are mandated by consular regulation to register and keep their residence data updated on https://peduliwni.kemlu.go.id. Proof of registration must be presented during appointment attendance.',
    answerId: 'Ya, wajib. Berdasarkan peraturan kekonsuleran, setiap WNI yang berdomisili di luar negeri diwajibkan melakukan lapor diri dan memperbarui status kependudukan di portal https://peduliwni.kemlu.go.id. Bukti konfirmasi lapor diri harus disertakan saat verifikasi berkas.'
  },
  {
    category: 'fees',
    questionEn: 'How can I pay for consular passport fees at KJRI Frankfurt?',
    questionId: 'Bagaimana metode pembayaran biaya paspor di KJRI Frankfurt?',
    answerEn: 'Fees are payable in Euro (€) strictly using German EC-Karte (Debit Card) directly at the consular counter, or via bank giro transfer to the official KJRI Frankfurt bank account prior to your appointment. Cash is strictly NOT accepted.',
    answerId: 'Pembayaran biaya kekonsuleran dalam mata uang Euro (€) hanya dilayani menggunakan kartu debit Jerman (EC-Karte) langsung di mesin EDC loket, atau transfer bank ke rekening resmi KJRI Frankfurt sebelum jadwal kedatangan. Uang tunai (cash) TIDAK diterima.'
  },
  {
    category: 'fees',
    questionEn: 'Are there fines for damaged or lost passports?',
    questionId: 'Apakah dikenakan denda beban untuk paspor rusak atau hilang?',
    answerEn: 'Yes. In accordance with Indonesian Non-Tax State Revenue (PNBP) immigration laws, an administrative fine of € 35 is applied for damaged passports, and € 70 for lost passports, in addition to the standard passport book fee.',
    answerId: 'Ya. Berdasarkan ketentuan PNBP Keimigrasian RI, dikenakan denda beban sebesar € 35 untuk paspor rusak, dan € 70 untuk paspor hilang, di luar biaya buku paspor yang diterbitkan.'
  },
  {
    category: 'appointment',
    questionEn: 'Can I reschedule my appointment (termin)?',
    questionId: 'Apakah saya bisa mengubah jadwal janji temu (reschedule termin)?',
    answerEn: 'Yes. You can select the "Consular Appointment (Termin Only)" service, enter your existing Booking Reference code, and choose any newly available open time slot on working days.',
    answerId: 'Bisa. Anda dapat memilih menu "Permohonan Termin (Janji Temu)", memasukkan Kode Booking yang telah Anda miliki, kemudian memilih slot tanggal dan jam baru yang masih tersedia.'
  },
  {
    category: 'appointment',
    questionEn: 'Can my passport be delivered by mail after biometrics?',
    questionId: 'Bisakah paspor yang sudah selesai dikirimkan melalui pos?',
    answerEn: 'Yes. If you reside far outside Frankfurt (e.g., Munich, Stuttgart, Cologne), you can bring a prepaid, self-addressed registered return envelope (Deutsche Post Einschreiben Wert or DHL Express) during your biometric appointment session.',
    answerId: 'Bisa. Bagi pemohon yang tinggal di luar kota Frankfurt (misal Munich, Stuttgart, Köln, Düsseldorf), Anda dapat membawa amplop balasan tercatat (Deutsche Post Einschreiben Wert / DHL Express) yang telah ditempeli prangko dan dituliskan alamat lengkap Anda saat hari H foto biometrik.'
  }
];

export const availableTimeSlots = [
  '09:00 - 09:30 CET',
  '09:30 - 10:00 CET',
  '10:00 - 10:30 CET',
  '10:30 - 11:00 CET',
  '11:00 - 11:30 CET',
  '11:30 - 12:00 CET',
  '13:30 - 14:00 CET',
  '14:00 - 14:30 CET',
  '14:30 - 15:00 CET',
  '15:00 - 15:30 CET'
];
