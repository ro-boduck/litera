/**
 * LITERA — Database Layer
 * Uses better-sqlite3 (synchronous SQLite) for edge-compatible,
 * zero-latency access in Next.js API routes.
 *
 * Best practices applied:
 * - WAL journal mode for concurrent reads
 * - Foreign keys enabled
 * - Singleton pattern (one connection per process)
 * - Parameterised queries only (no string interpolation)
 * - Content/quiz stored as JSON text, parsed at query time
 */

import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, "..", "litera.db");

let _db = null;

function getDb() {
  if (_db) return _db;

  _db = new Database(DB_PATH);

  // Performance pragmas
  _db.pragma("journal_mode = WAL");
  _db.pragma("foreign_keys = ON");
  _db.pragma("synchronous = NORMAL");
  _db.pragma("cache_size = -32000"); // 32MB page cache

  initSchema(_db);

  return _db;
}

function initSchema(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS materials (
      id      INTEGER PRIMARY KEY AUTOINCREMENT,
      cat     TEXT    NOT NULL,
      title   TEXT    NOT NULL,
      desc    TEXT    NOT NULL DEFAULT '',
      time    TEXT    NOT NULL DEFAULT '5 mnt',
      icon    TEXT    NOT NULL DEFAULT 'book',
      level   TEXT    NOT NULL DEFAULT 'Pemula',
      content TEXT    NOT NULL DEFAULT '[]',
      quiz    TEXT    NOT NULL DEFAULT '[]',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS admins (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      username      TEXT    NOT NULL UNIQUE,
      password_hash TEXT    NOT NULL,
      created_at    TEXT    NOT NULL DEFAULT (datetime('now'))
    );
  `);

  // Seed materials if empty
  const count = db.prepare("SELECT COUNT(*) as c FROM materials").get();
  if (count.c === 0) {
    const insert = db.prepare(`
      INSERT INTO materials (cat, title, desc, time, icon, level, content, quiz)
      VALUES (@cat, @title, @desc, @time, @icon, @level, @content, @quiz)
    `);

    const seedMany = db.transaction((rows) => {
      for (const row of rows) insert.run(row);
    });

    seedMany([
      {
        cat: "Literasi Digital",
        title: "Keamanan Transaksi Digital",
        desc: "Cara melindungi data pribadi dan menghindari penipuan saat bertransaksi secara digital.",
        time: "8 mnt",
        icon: "lock",
        level: "Pemula",
        content: JSON.stringify([
          { type: "h2", text: "Pentingnya Keamanan Digital" },
          { type: "p", text: "Di era digital saat ini, transaksi keuangan semakin mudah dilakukan melalui perangkat seluler. Namun, kemudahan ini juga diikuti dengan peningkatan risiko penipuan digital seperti phishing, skimming, dan social engineering." },
          { type: "h2", text: "Modus Penipuan Umum" },
          { type: "ul", items: ["Phishing: Pelaku menyamar sebagai instansi resmi untuk mencuri kredensial.", "OTP Fraud: Pelaku meminta kode OTP yang dikirimkan ke ponsel korban.", "Malware: Aplikasi berbahaya yang mencuri data dari perangkat."] },
          { type: "h2", text: "Langkah Pencegahan" },
          { type: "ol", items: ["Jangan pernah membagikan OTP kepada siapa pun.", "Aktifkan autentikasi dua faktor (2FA).", "Selalu periksa URL situs web sebelum memasukkan data sensitif.", "Gunakan koneksi internet yang aman dan hindari Wi-Fi publik saat bertransaksi."] },
          { type: "callout", text: "OTP adalah kode rahasia yang tidak pernah diminta oleh pihak bank atau fintech resmi melalui telepon." }
        ]),
        quiz: JSON.stringify([
          { q: "Manakah praktik keamanan digital yang benar?", options: ["Membagikan OTP kepada petugas bank", "Menggunakan password yang sama untuk semua akun", "Mengaktifkan autentikasi dua faktor (2FA)", "Bertransaksi via Wi-Fi publik tanpa VPN"], answer: 2, explanation: "2FA memberikan lapisan keamanan tambahan dan sangat disarankan untuk aplikasi keuangan." }
        ]),
      },
      {
        cat: "Perencanaan Keuangan",
        title: "Perencanaan Anggaran Pribadi",
        desc: "Strategi membagi penghasilan untuk kebutuhan, tabungan, dan investasi masa depan.",
        time: "12 mnt",
        icon: "chart",
        level: "Pemula",
        content: JSON.stringify([
          { type: "h2", text: "Prinsip 50/30/20" },
          { type: "p", text: "Metode penganggaran 50/30/20 membagi pendapatan bersih menjadi tiga kategori." },
          { type: "ul", items: ["50% untuk Kebutuhan Pokok (sewa, makanan, tagihan)", "30% untuk Keinginan (hiburan, liburan)", "20% untuk Tabungan dan Investasi"] },
          { type: "h2", text: "Pencatatan Arus Kas" },
          { type: "p", text: "Langkah pertama dalam perencanaan adalah mencatat setiap pengeluaran. Gunakan aplikasi pencatat keuangan atau jurnal sederhana untuk mengidentifikasi area penghematan." },
          { type: "callout", text: "Mulai dengan mencatat pengeluaran selama 30 hari untuk mendapatkan gambaran nyata pola konsumsi Anda." }
        ]),
        quiz: JSON.stringify([
          { q: "Dalam aturan 50/30/20, 20% dialokasikan untuk?", options: ["Kebutuhan Pokok", "Keinginan dan Hiburan", "Tabungan dan Investasi", "Sedekah dan Amal"], answer: 2, explanation: "20% untuk masa depan: tabungan (dana darurat) dan investasi." }
        ]),
      },
      {
        cat: "Investasi",
        title: "Mengenal Instrumen Investasi",
        desc: "Panduan memahami profil risiko dan jenis investasi legal di Indonesia.",
        time: "10 mnt",
        icon: "trending",
        level: "Menengah",
        content: JSON.stringify([
          { type: "h2", text: "Jenis Instrumen Investasi" },
          { type: "p", text: "Indonesia memiliki beragam instrumen investasi yang diawasi oleh OJK, dari yang berisiko rendah hingga tinggi." },
          { type: "ul", items: ["Deposito: aman, bunga tetap, likuiditas rendah.", "Reksa Dana: dikelola manajer investasi, modal kecil.", "Obligasi: surat utang pemerintah/korporasi, bunga tetap.", "Saham: kepemilikan perusahaan, potensi return tinggi, risiko tinggi."] },
          { type: "callout", text: "Selalu investasi di instrumen yang terdaftar dan diawasi oleh OJK untuk menghindari investasi bodong." }
        ]),
        quiz: JSON.stringify([
          { q: "Instrumen investasi mana yang paling rendah risikonya?", options: ["Saham", "Crypto", "Deposito Bank", "Reksa Dana Saham"], answer: 2, explanation: "Deposito bank dijamin LPS hingga Rp2 miliar dan memiliki bunga tetap, sehingga paling aman." }
        ]),
      },
      {
        cat: "Perbankan",
        title: "Produk dan Layanan Perbankan",
        desc: "Jenis rekening, kartu kredit, pinjaman, dan layanan perbankan digital.",
        time: "9 mnt",
        icon: "bank",
        level: "Pemula",
        content: JSON.stringify([
          { type: "h2", text: "Rekening Tabungan vs Giro" },
          { type: "p", text: "Rekening tabungan cocok untuk individu, sementara rekening giro lebih sesuai untuk bisnis karena mendukung cek dan bilyet giro." },
          { type: "h2", text: "Layanan Digital Banking" },
          { type: "ul", items: ["Mobile banking: transaksi via aplikasi smartphone.", "Internet banking: transaksi via browser.", "QRIS: standar pembayaran QR code nasional.", "Virtual Account: nomor rekening khusus untuk pembayaran tagihan."] }
        ]),
        quiz: JSON.stringify([
          { q: "QRIS adalah singkatan dari?", options: ["Quick Response Code Indonesian Standard", "Quality Rating Indonesian System", "Quick Retail Indonesian Solution", "Queue Response Integration System"], answer: 0, explanation: "QRIS (Quick Response Code Indonesian Standard) adalah standar nasional kode QR untuk pembayaran digital di Indonesia." }
        ]),
      },
      {
        cat: "UMKM",
        title: "Pengelolaan Keuangan UMKM",
        desc: "Dasar pembukuan, arus kas, dan strategi finansial untuk pelaku usaha.",
        time: "15 mnt",
        icon: "store",
        level: "Menengah",
        content: JSON.stringify([
          { type: "h2", text: "Pisahkan Keuangan Pribadi dan Bisnis" },
          { type: "p", text: "Kesalahan paling umum UMKM adalah mencampur keuangan pribadi dengan keuangan usaha. Buka rekening terpisah untuk bisnis Anda." },
          { type: "h2", text: "Laporan Arus Kas Sederhana" },
          { type: "ul", items: ["Catat semua pemasukan harian (penjualan, piutang masuk).", "Catat semua pengeluaran (bahan baku, operasional, gaji).", "Hitung selisih (surplus/defisit) setiap akhir bulan."] },
          { type: "callout", text: "Arus kas positif bukan berarti bisnis untung. Pastikan Anda juga menghitung harga pokok produksi (HPP) dan laba bersih." }
        ]),
        quiz: JSON.stringify([
          { q: "Mengapa keuangan pribadi dan bisnis harus dipisahkan?", options: ["Agar terlihat profesional", "Supaya mudah melacak kinerja bisnis dan menghindari kebocoran dana", "Karena diwajibkan pemerintah", "Tidak perlu dipisahkan"], answer: 1, explanation: "Pemisahan rekening memudahkan analisis kinerja bisnis, menghindari penggunaan modal bisnis untuk keperluan pribadi, dan mempersiapkan laporan keuangan yang akurat." }
        ]),
      },
      {
        cat: "Literasi Digital",
        title: "Dompet Digital dan E-Money",
        desc: "Cara bijak menggunakan dompet digital, QRIS, dan uang elektronik.",
        time: "7 mnt",
        icon: "phone",
        level: "Pemula",
        content: JSON.stringify([
          { type: "h2", text: "Perbedaan Dompet Digital dan E-Money" },
          { type: "p", text: "Dompet digital (seperti GoPay, OVO, Dana) terhubung ke sistem perbankan dan memerlukan KYC. E-Money (seperti Kartu Flazz, e-Toll) adalah kartu prabayar berbasis chip." },
          { type: "callout", text: "Aktifkan notifikasi transaksi untuk mendeteksi transaksi mencurigakan lebih cepat." }
        ]),
        quiz: JSON.stringify([
          { q: "Manakah yang termasuk e-money berbasis chip?", options: ["GoPay", "OVO", "Kartu Flazz BCA", "DANA"], answer: 2, explanation: "Kartu Flazz BCA adalah e-money berbasis chip (server-based stored value), berbeda dengan dompet digital yang berbasis server/aplikasi." }
        ]),
      },
      {
        cat: "Perencanaan Keuangan",
        title: "Dana Darurat dan Asuransi",
        desc: "Pentingnya dana darurat 3-6 bulan dan memilih asuransi yang tepat.",
        time: "11 mnt",
        icon: "shield",
        level: "Menengah",
        content: JSON.stringify([
          { type: "h2", text: "Berapa Dana Darurat yang Ideal?" },
          { type: "ul", items: ["Single/tanpa tanggungan: 3 bulan pengeluaran rutin.", "Menikah/1 anak: 6 bulan pengeluaran rutin.", "Keluarga besar/wiraswasta: 9-12 bulan pengeluaran rutin."] },
          { type: "h2", text: "Simpan Dana Darurat di Mana?" },
          { type: "p", text: "Gunakan instrumen yang likuid dan aman: tabungan di bank atau reksa dana pasar uang. Hindari deposito berjangka karena ada penalti pencairan dini." },
          { type: "callout", text: "Dana darurat BUKAN untuk diinvestasikan. Aksesibilitas adalah prioritas utama." }
        ]),
        quiz: JSON.stringify([
          { q: "Berapa jumlah dana darurat ideal untuk keluarga dengan 1 anak?", options: ["1 bulan pengeluaran", "3 bulan pengeluaran", "6 bulan pengeluaran", "12 bulan pengeluaran"], answer: 2, explanation: "Untuk keluarga dengan 1 anak, dana darurat ideal adalah 6 bulan pengeluaran rutin untuk mengantisipasi berbagai risiko finansial." }
        ]),
      },
      {
        cat: "Investasi",
        title: "Reksa Dana untuk Pemula",
        desc: "Mulai investasi reksa dana dengan modal kecil dan risiko terkelola.",
        time: "13 mnt",
        icon: "money",
        level: "Pemula",
        content: JSON.stringify([
          { type: "h2", text: "Apa itu Reksa Dana?" },
          { type: "p", text: "Reksa dana adalah wadah investasi kolektif yang dikelola oleh Manajer Investasi (MI). Modal dari banyak investor dikumpulkan dan diinvestasikan ke berbagai efek." },
          { type: "h2", text: "Jenis Reksa Dana" },
          { type: "ul", items: ["Pasar Uang: risiko rendah, cocok untuk dana darurat.", "Pendapatan Tetap: risiko sedang, imbal hasil lebih tinggi dari deposito.", "Campuran: kombinasi saham dan obligasi.", "Saham: risiko tinggi, potensi return tertinggi, cocok untuk jangka panjang."] },
          { type: "callout", text: "High Risk, High Return. Sesuaikan pilihan reksa dana dengan profil risiko dan horizon investasi Anda." }
        ]),
        quiz: JSON.stringify([
          { q: "Reksa dana jenis mana yang paling sesuai untuk investasi jangka panjang (>5 tahun)?", options: ["Reksa Dana Pasar Uang", "Reksa Dana Pendapatan Tetap", "Reksa Dana Saham", "Deposito"], answer: 2, explanation: "Reksa Dana Saham memiliki volatilitas tinggi jangka pendek, tetapi secara historis memberikan imbal hasil terbaik dalam jangka panjang." }
        ]),
      },
      {
        cat: "Perbankan",
        title: "Mengenal Suku Bunga BI Rate",
        desc: "Dampak kebijakan suku bunga terhadap tabungan, pinjaman, dan ekonomi.",
        time: "8 mnt",
        icon: "percent",
        level: "Menengah",
        content: JSON.stringify([
          { type: "h2", text: "Apa itu BI Rate?" },
          { type: "p", text: "BI Rate (BI 7-Day Reverse Repo Rate) adalah suku bunga acuan Bank Indonesia yang digunakan sebagai patokan suku bunga perbankan di Indonesia." },
          { type: "h2", text: "Dampak Perubahan BI Rate" },
          { type: "ul", items: ["BI Rate naik: bunga pinjaman naik, bunga tabungan/deposito naik, inflasi cenderung turun.", "BI Rate turun: bunga pinjaman turun, kredit lebih murah, ekonomi cenderung lebih aktif."] },
          { type: "callout", text: "Ketika BI Rate naik, pertimbangkan untuk menaruh dana di deposito atau obligasi untuk mendapat bunga lebih tinggi." }
        ]),
        quiz: JSON.stringify([
          { q: "Apa dampak kenaikan BI Rate terhadap kredit perumahan (KPR)?", options: ["Cicilan KPR menjadi lebih murah", "Tidak berpengaruh pada KPR", "Cicilan KPR cenderung naik karena bunga kredit ikut naik", "Bank tidak bisa memberikan KPR baru"], answer: 2, explanation: "Kenaikan BI Rate mendorong bank menaikkan suku bunga kredit, termasuk KPR, sehingga cicilan bulanan cenderung meningkat." }
        ]),
      },
    ]);
  }
}

// ── Query helpers ──────────────────────────────────────────────

/** @returns {Array} all materials (lightweight list view) */
export function getAllMaterials() {
  const db = getDb();
  return db
    .prepare("SELECT id, cat, title, desc, time, icon, level FROM materials ORDER BY id ASC")
    .all();
}

/** @returns {Object|undefined} single material with parsed content & quiz */
export function getMaterialById(id) {
  const db = getDb();
  const row = db.prepare("SELECT * FROM materials WHERE id = ?").get(Number(id));
  if (!row) return undefined;
  return {
    ...row,
    content: JSON.parse(row.content),
    quiz: JSON.parse(row.quiz),
  };
}

/** @returns {{ id: number }} inserted row id */
export function createMaterial(data) {
  const db = getDb();
  const stmt = db.prepare(`
    INSERT INTO materials (cat, title, desc, time, icon, level, content, quiz)
    VALUES (@cat, @title, @desc, @time, @icon, @level, @content, @quiz)
  `);
  const result = stmt.run({
    cat: data.cat,
    title: data.title,
    desc: data.desc ?? "",
    time: data.time ?? "5 mnt",
    icon: data.icon ?? "book",
    level: data.level ?? "Pemula",
    content: JSON.stringify(data.content ?? []),
    quiz: JSON.stringify(data.quiz ?? []),
  });
  return { id: result.lastInsertRowid };
}

/** @returns {number} rows changed */
export function updateMaterial(id, data) {
  const db = getDb();
  const stmt = db.prepare(`
    UPDATE materials
    SET cat=@cat, title=@title, desc=@desc, time=@time, icon=@icon, level=@level,
        content=@content, quiz=@quiz, updated_at=datetime('now')
    WHERE id=@id
  `);
  const result = stmt.run({
    id: Number(id),
    cat: data.cat,
    title: data.title,
    desc: data.desc ?? "",
    time: data.time ?? "5 mnt",
    icon: data.icon ?? "book",
    level: data.level ?? "Pemula",
    content: JSON.stringify(data.content ?? []),
    quiz: JSON.stringify(data.quiz ?? []),
  });
  return result.changes;
}

/** @returns {number} rows changed */
export function deleteMaterial(id) {
  const db = getDb();
  return db.prepare("DELETE FROM materials WHERE id = ?").run(Number(id)).changes;
}

// ── Admin helpers ──────────────────────────────────────────────

export function getAdminByUsername(username) {
  const db = getDb();
  return db.prepare("SELECT * FROM admins WHERE username = ?").get(username);
}

export function createAdmin(username, passwordHash) {
  const db = getDb();
  return db
    .prepare("INSERT INTO admins (username, password_hash) VALUES (?, ?)")
    .run(username, passwordHash);
}

export function adminCount() {
  const db = getDb();
  return db.prepare("SELECT COUNT(*) as c FROM admins").get().c;
}
