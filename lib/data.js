export const Icons = {
  shield: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  ),
  chart: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 20V10M12 20V4M6 20v-6" />
    </svg>
  ),
  trending: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  ),
  book: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" />
      <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
    </svg>
  ),
  users: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
    </svg>
  ),
  map: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
      <line x1="8" y1="2" x2="8" y2="18" />
      <line x1="16" y1="6" x2="16" y2="22" />
    </svg>
  ),
  star: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  lock: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
  ),
  wallet: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12V7H5a2 2 0 010-4h14v4" />
      <path d="M3 5v14a2 2 0 002 2h16v-5" />
      <path d="M18 12a2 2 0 100 4h4v-4h-4z" />
    </svg>
  ),
};

export const materialsData = [
  { id: 1, cat: "Literasi Digital", title: "Keamanan Transaksi Digital", desc: "Cara melindungi data pribadi dan menghindari penipuan saat bertransaksi secara digital.", time: "8 mnt", icon: "lock" },
  { id: 2, cat: "Perencanaan Keuangan", title: "Perencanaan Anggaran Pribadi", desc: "Strategi membagi penghasilan untuk kebutuhan, tabungan, dan investasi masa depan.", time: "12 mnt", icon: "chart" },
  { id: 3, cat: "Investasi", title: "Mengenal Instrumen Investasi", desc: "Panduan memahami profil risiko dan jenis investasi legal di Indonesia.", time: "10 mnt", icon: "trending" },
  { id: 4, cat: "Perbankan", title: "Produk dan Layanan Perbankan", desc: "Jenis rekening, kartu kredit, pinjaman, dan layanan perbankan digital.", time: "9 mnt", icon: "bank" },
  { id: 5, cat: "UMKM", title: "Pengelolaan Keuangan UMKM", desc: "Dasar pembukuan, arus kas, dan strategi finansial untuk pelaku usaha.", time: "15 mnt", icon: "store" },
  { id: 6, cat: "Literasi Digital", title: "Dompet Digital dan E-Money", desc: "Cara bijak menggunakan dompet digital, QRIS, dan uang elektronik.", time: "7 mnt", icon: "phone" },
  { id: 7, cat: "Perencanaan Keuangan", title: "Dana Darurat dan Asuransi", desc: "Pentingnya dana darurat 3-6 bulan dan memilih asuransi yang tepat.", time: "11 mnt", icon: "shield" },
  { id: 8, cat: "Investasi", title: "Reksa Dana untuk Pemula", desc: "Mulai investasi reksa dana dengan modal kecil dan risiko terkelola.", time: "13 mnt", icon: "money" },
  { id: 9, cat: "Perbankan", title: "Mengenal Suku Bunga BI Rate", desc: "Dampak kebijakan suku bunga terhadap tabungan, pinjaman, dan ekonomi.", time: "8 mnt", icon: "percent" },
];

export const materialDetailData = {
  1: {
    category: "Literasi Digital",
    title: "Keamanan Transaksi Digital di Era Modern",
    time: "8 menit",
    level: "Pemula",
    sections: [
      {
        title: "Pentingnya Keamanan Digital",
        content: "Di era digital saat ini, transaksi keuangan semakin mudah dilakukan melalui perangkat seluler. Namun, kemudahan ini juga diikuti dengan peningkatan risiko penipuan digital seperti phishing, skimming, dan social engineering. Melindungi data pribadi seperti PIN, OTP, dan nomor kartu adalah garis pertahanan pertama Anda."
      },
      {
        title: "Modus Penipuan Umum",
        content: "Beberapa modus penipuan yang sering terjadi meliputi:\n• Phishing: Pelaku menyamar sebagai instansi resmi untuk mencuri kredensial.\n• OTP Fraud: Pelaku meminta kode OTP yang dikirimkan ke ponsel korban.\n• Malware: Aplikasi berbahaya yang mencuri data dari perangkat."
      },
      {
        title: "Langkah Pencegahan",
        content: "Untuk menjaga keamanan transaksi:\n1. Jangan pernah membagikan OTP kepada siapa pun.\n2. Aktifkan autentikasi dua faktor (2FA).\n3. Selalu periksa URL situs web sebelum memasukkan data sensitif.\n4. Gunakan koneksi internet yang aman dan hindari Wi-Fi publik saat bertransaksi."
      }
    ],
    quiz: {
      question: "Manakah dari berikut ini yang merupakan praktik keamanan digital yang baik?",
      options: [
        "Membagikan OTP kepada petugas bank yang menelpon.",
        "Menggunakan password yang sama untuk semua akun bank.",
        "Mengaktifkan autentikasi dua faktor (2FA) pada aplikasi keuangan.",
        "Melakukan transaksi perbankan menggunakan Wi-Fi publik tanpa VPN."
      ],
      correctAnswer: 2,
      explanation: "Autentikasi dua faktor (2FA) memberikan lapisan keamanan tambahan selain password, sehingga sangat disarankan untuk aplikasi keuangan. Membagikan OTP, menggunakan password yang sama, dan menggunakan Wi-Fi publik adalah praktik yang berbahaya."
    }
  },
  2: {
    category: "Perencanaan",
    title: "Perencanaan Anggaran Pribadi",
    time: "12 menit",
    level: "Menengah",
    sections: [
      {
        title: "Prinsip 50/30/20",
        content: "Salah satu metode penganggaran yang paling populer adalah aturan 50/30/20. Aturan ini membagi pendapatan bersih Anda menjadi tiga kategori:\n• 50% untuk Kebutuhan Pokok (Sewa, Makanan, Tagihan)\n• 30% untuk Keinginan (Hiburan, Liburan)\n• 20% untuk Tabungan dan Investasi"
      },
      {
        title: "Pencatatan Arus Kas",
        content: "Langkah pertama dalam perencanaan adalah mencatat setiap pengeluaran. Dengan mengetahui ke mana uang Anda pergi, Anda dapat mengidentifikasi area di mana Anda bisa berhemat. Gunakan aplikasi pencatat keuangan atau jurnal sederhana."
      }
    ],
    quiz: {
      question: "Dalam aturan 50/30/20, persentase 20% dialokasikan untuk?",
      options: [
        "Kebutuhan Pokok",
        "Keinginan dan Hiburan",
        "Tabungan dan Investasi",
        "Sedekah dan Amal"
      ],
      correctAnswer: 2,
      explanation: "Dalam metode 50/30/20, 20% dari pendapatan dialokasikan untuk masa depan, yaitu tabungan (termasuk dana darurat) dan investasi."
    }
  }
};
