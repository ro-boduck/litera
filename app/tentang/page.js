import Link from "next/link";

export const metadata = {
  title: "Tentang Kami — LITERA",
  description: "Pelajari tentang LITERA dan Kantor Perwakilan Bank Indonesia Provinsi Jawa Barat.",
};

const missions = [
  { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 20V10M12 20V4M6 20v-6" /></svg>, title: "Meningkatkan Literasi Keuangan", desc: "Meningkatkan pemahaman masyarakat Jawa Barat terhadap produk dan layanan keuangan yang aman dan legal." },
  { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" /><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" /></svg>, title: "Akses Edukasi Terbuka", desc: "Menyediakan platform edukasi keuangan gratis, mudah diakses, dan relevan dengan kebutuhan masyarakat digital." },
  { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M9 12l2 2 4-4" /></svg>, title: "Stabilitas Sistem Keuangan", desc: "Mendukung stabilitas keuangan regional melalui masyarakat yang cerdas dan terliterasi secara finansial." },
];

const values = [
  { icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></svg>, title: "Transparansi", desc: "Informasi keuangan yang jelas, akurat, dan dapat dipertanggungjawabkan berdasarkan data resmi Bank Indonesia." },
  { icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" /><path d="M9 12l2 2 4-4" /></svg>, title: "Profesionalisme", desc: "Materi disusun oleh tim ahli keuangan dan dikurasi sesuai standar edukasi literasi keuangan nasional." },
  { icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></svg>, title: "Inovasi", desc: "Menggunakan teknologi modern dan pendekatan interaktif untuk edukasi keuangan yang efektif." },
];

export default function TentangPage() {
  return (
    <>
      {/* ═══ HERO ═══ */}
      <section className="hero-gradient mega-mendung section-padding relative overflow-hidden">
        <div className="ornament-cloud w-[500px] h-[500px] -top-40 -right-40" />
        <div className="relative max-w-6xl mx-auto px-6 lg:px-8 text-center">
          <p className="text-overline text-blue-300 mb-4">Tentang Kami</p>
          <h1 className="text-hero-light mb-6 max-w-3xl mx-auto">
            Membangun masyarakat Jawa Barat yang
            <span className="bg-gradient-to-r from-blue-300 to-blue-100 bg-clip-text text-transparent"> cerdas finansial.</span>
          </h1>
          <p className="text-[18px] text-white/70 leading-relaxed max-w-xl mx-auto">
            LITERA adalah inisiatif edukasi digital oleh Kantor Perwakilan
            Bank Indonesia Provinsi Jawa Barat.
          </p>
        </div>
      </section>

      {/* ═══ MISSION ═══ */}
      <section className="bg-canvas section-padding">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-overline text-civic-blue mb-3">Visi & Misi</p>
            <h2 className="text-display text-text-primary mb-4">Tiga pilar utama kami.</h2>
            <p className="text-body text-text-secondary max-w-xl mx-auto">
              Mewujudkan masyarakat yang memahami keuangan, mampu mengambil keputusan bijak,
              dan terlindungi dari praktik keuangan ilegal.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {missions.map((m, i) => (
              <div key={i} className="bg-surface-card border border-border rounded-2xl p-8 hover:shadow-lg hover:border-civic-blue-subtle transition-all group">
                <div className="w-12 h-12 rounded-xl bg-civic-blue-mist flex items-center justify-center text-civic-blue mb-5 group-hover:bg-civic-blue group-hover:text-white transition-colors">
                  {m.icon}
                </div>
                <h3 className="text-subheading text-text-primary mb-3">{m.title}</h3>
                <p className="text-caption text-text-tertiary leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ INSTITUTION ═══ */}
      <section className="bg-canvas-warm section-padding mega-mendung-blue">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <p className="text-overline text-civic-blue mb-3">Tentang Institusi</p>
          <h2 className="text-display text-text-primary mb-6">
            Kantor Perwakilan Bank Indonesia Provinsi Jawa Barat.
          </h2>
          <p className="text-body text-text-secondary mb-6 max-w-2xl mx-auto">
            KPwBI Provinsi Jawa Barat adalah unit kerja Bank Indonesia yang bertugas
            melaksanakan fungsi bank sentral di wilayah Jawa Barat, dengan fokus pada
            stabilitas moneter, sistem keuangan, dan sistem pembayaran.
          </p>
          <p className="text-body text-text-secondary max-w-2xl mx-auto">
            Berlokasi di Jl. Braga No.108, Bandung, KPwBI Jawa Barat melayani
            27 kota dan kabupaten dengan berbagai program literasi dan edukasi keuangan.
          </p>
        </div>
      </section>

      {/* ═══ VALUES ═══ */}
      <section className="bg-canvas section-padding">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-overline text-civic-blue mb-3">Nilai-Nilai</p>
            <h2 className="text-display text-text-primary">Yang kami pegang teguh.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((v, i) => (
              <div key={i} className="text-center p-8">
                <div className="w-16 h-16 rounded-2xl bg-civic-blue-mist flex items-center justify-center text-civic-blue mx-auto mb-5">
                  {v.icon}
                </div>
                <h3 className="text-subheading text-text-primary mb-3">{v.title}</h3>
                <p className="text-caption text-text-tertiary leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="bg-canvas section-padding pt-0">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="hero-gradient mega-mendung rounded-3xl p-12 lg:p-16 text-center relative overflow-hidden">
            <div className="ornament-cloud w-[300px] h-[300px] -top-20 -right-20" />
            <div className="relative">
              <h2 className="text-display text-white mb-4">Mulai perjalanan Anda.</h2>
              <p className="text-body text-text-on-dark-muted max-w-md mx-auto mb-8">
                Jelajahi materi edukasi dan tingkatkan pemahaman keuangan Anda secara gratis.
              </p>
              <Link href="/materi" className="btn-primary px-10 py-4 text-[16px]">
                Jelajahi Materi
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
