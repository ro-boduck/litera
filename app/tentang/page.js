import Link from 'next/link';
import Image from 'next/image';
import RevealWrapper from '../components/RevealWrapper';

export const metadata = {
  title: 'Tentang Kami — Ruang PeKA',
  description:
    'Pelajari tentang Ruang PeKA dan Kantor Perwakilan Bank Indonesia Provinsi Jawa Barat.',
};

const missions = [
  {
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M18 20V10M12 20V4M6 20v-6" />
      </svg>
    ),
    title: 'Ekosistem Pelindungan',
    desc: 'Menciptakan ekosistem Pelindungan Konsumen yang mewujudkan kepastian hukum serta penanganan pengaduan dan penyelesaian sengketa yang efektif dan efisien',
  },
  {
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" />
        <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
      </svg>
    ),
    title: 'Tanggung Jawab Penyelenggara',
    desc: 'Menumbuhkan kesadaran Penyelenggara mengenai perilaku bisnis yang bertanggung jawab, perlakuan yang adil, memberikan pelindungan aset, privasi, dan data Konsumen, serta meningkatkan kualitas produk dan/atau layanan Penyelenggara',
  },
  {
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
    title: 'Pemberdayaan Konsumen',
    desc: 'Meningkatkan kesadaran, kemampuan, dan kemandirian Konsumen mengenai produk dan/atau layanan Penyelenggara serta meningkatkan pemberdayaan Konsumen',
  },
];


export default function TentangPage() {
  return (
    <>
      {/* ═══ HERO ═══ */}
      <RevealWrapper className="hero-gradient mega-mendung pt-[140px] md:pt-[160px] pb-20 relative overflow-hidden">
        <div className="ornament-cloud w-[500px] h-[500px] -top-40 -right-40" />
        <div className="relative max-w-6xl mx-auto px-6 lg:px-8 text-center reveal-base reveal-up delay-1">
          <p className="text-overline text-blue-300 mb-4">Tentang Kami</p>
          <h1 className="text-hero-light mb-6 max-w-5xl mx-auto px-4">
            Ruang Edukasi dan Literasi Pelindungan Konsumen untuk Mewujudkan
            Masyarakat Jawa Barat yang
            <span className="bg-gradient-to-r from-blue-300 to-blue-100 bg-clip-text text-transparent">
              {' '}
              Cerdas, Waspada dan Terlindungi.
            </span>
          </h1>
          <p className="text-[18px] text-white/70 leading-relaxed max-w-xl mx-auto reveal-base reveal-up delay-2">
            Ruang PeKA Jawa Barat adalah platform edukasi digital terkait
            Pelindungan Konsumen yang diinisiasi oleh Kantor Perwakilan Bank
            Indonesia Provinsi Jawa Barat.
          </p>
        </div>
      </RevealWrapper>

      {/* ═══ MISSION ═══ */}
      <RevealWrapper className="bg-canvas section-padding">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16 reveal-base reveal-up delay-1">
            <p className="text-overline text-civic-blue mb-3">Visi & Misi</p>
            <h2 className="text-display text-text-primary mb-4">
              Tujuan Pelindungan Konsumen BI
            </h2>
            <p className="text-body text-text-secondary max-w-xl mx-auto">
              Mewujudkan masyarakat yang memahami keuangan, mampu mengambil
              keputusan bijak, dan terlindungi dari praktik keuangan ilegal.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 reveal-base reveal-up delay-2">
            {missions.map((m, i) => (
              <div
                key={i}
                className="bg-surface-card border border-border rounded-2xl p-8 hover:shadow-lg hover:border-civic-blue-subtle transition-all group flex flex-col items-center text-center h-full"
              >
                <div className="w-14 h-14 rounded-xl bg-civic-blue-mist flex items-center justify-center text-civic-blue mb-6 group-hover:bg-civic-blue group-hover:text-white transition-colors">
                  {m.icon}
                </div>
                <h3 className="text-subheading text-text-primary mb-4">
                  {m.title}
                </h3>
                <p className="text-caption text-text-tertiary leading-relaxed">
                  {m.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </RevealWrapper>

      {/* ═══ INSTITUTION ═══ */}
      <RevealWrapper className="bg-canvas-warm section-padding mega-mendung-blue">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center reveal-base reveal-up delay-1">
          <p className="text-overline text-civic-blue mb-3">
            Tentang Institusi
          </p>
          <h2 className="text-display text-text-primary mb-6">
            Kantor Perwakilan Bank Indonesia Provinsi Jawa Barat.
          </h2>
          <p className="text-body text-text-secondary mb-6 max-w-2xl mx-auto">
            KPwBI Provinsi Jawa Barat adalah unit kerja Bank Indonesia yang
            bertugas melaksanakan fungsi bank sentral di wilayah Jawa Barat,
            dengan fokus pada stabilitas moneter, sistem keuangan, dan sistem
            pembayaran.
          </p>
          <p className="text-body text-text-secondary max-w-2xl mx-auto">
            Berlokasi di Jl. Braga No.108, Bandung, KPwBI Jawa Barat melayani 27
            kota dan kabupaten dengan berbagai program literasi dan edukasi
            keuangan.
          </p>
        </div>
      </RevealWrapper>

      {/* ── Overhauled Bento Grid Design ── */}
      <RevealWrapper className="bg-canvas section-padding">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12 reveal-base reveal-up delay-1">
            <p className="text-overline text-civic-blue mb-3">Pilar Utama</p>
            <h2 className="text-display text-text-primary mb-4">
              Nilai-Nilai Edukasi & Literasi
            </h2>
          </div>

          <div className="max-w-6xl mx-auto mb-16 reveal-base reveal-up delay-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              
              {/* 1. PeKA Intro Card (col-span-2) */}
              <div className="md:col-span-2 bg-gradient-to-br from-blue-50 via-white to-blue-50/20 border border-slate-100 rounded-[2.5rem] p-8 md:p-10 flex flex-col justify-between relative overflow-hidden shadow-xl shadow-blue-900/5 group hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-300 hover:-translate-y-1">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-[300px] h-[300px] border border-blue-200/30 rounded-full translate-x-1/3 -translate-y-1/3 border-dashed pointer-events-none" />
                <div className="absolute -bottom-10 left-10 w-[150px] h-[150px] bg-blue-100/40 rounded-full blur-3xl opacity-60 pointer-events-none" />
                
                <div className="relative z-10">
                  {/* Brand Logo Container */}
                  <div className="relative w-[180px] h-[60px] mb-6">
                    <Image src="/FullLogoPeKa.png" alt="PeKA" fill sizes="(max-width: 768px) 180px, 180px" className="object-contain object-left" priority />
                  </div>
                  <h3 className="text-xl md:text-2xl font-black text-slate-800 mb-4 tracking-tight leading-tight">
                    Cerdas, Waspada, dan Terlindungi.
                  </h3>
                  <p className="text-slate-600 text-sm md:text-base leading-relaxed max-w-xl">
                    Bikin kamu jadi lebih sadar dan paham tentang berbagai produk dan layanan keuangan. Kamu jadi konsumen cerdas yang bisa buat keputusan keuangan dengan tepat.
                  </p>
                </div>
              </div>

              {/* 2. PEDULI Pillar Card (col-span-1) */}
              <div className="md:col-span-1 bg-gradient-to-br from-blue-600 to-[#0a4d94] rounded-[2.5rem] p-8 md:p-10 flex flex-col items-start justify-between text-white shadow-xl shadow-blue-900/10 group hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-white/5 rounded-full translate-x-1/4 -translate-y-1/4 pointer-events-none" />
                
                <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-8 border border-white/20 text-white [&_svg]:stroke-[2px] [&_svg]:w-7 [&_svg]:h-7">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19.5 12.572L12 20l-7.5-7.428A5 5 0 1 1 12 6.006a5 5 0 1 1 7.5 6.572"/>
                    <path d="M12 6L8.707 9.293a1 1 0 0 0 0 1.414l.543.543c.69.69 1.81.69 2.5 0l1-1a3.18 3.18 0 0 1 4.5 0l2.25 2.25m-7 3l2 2M15 13l2 2"/>
                  </svg>
                </div>
                <div>
                  <h4 className="font-extrabold text-xl mb-3 tracking-wider text-blue-100">PEDULI</h4>
                  <p className="text-blue-50/80 text-sm leading-relaxed">
                    Peduli manfaat, risiko dan keamanan transaksi pembayaran kamu.
                  </p>
                </div>
              </div>

              {/* 3. KENALI Pillar Card (col-span-1) */}
              <div className="md:col-span-1 bg-gradient-to-br from-amber-50 to-orange-50/40 border border-amber-100/60 rounded-[2.5rem] p-8 md:p-10 flex flex-col items-start justify-between text-slate-800 shadow-xl shadow-amber-900/5 group hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-amber-500/5 rounded-full translate-x-1/4 -translate-y-1/4 pointer-events-none" />
                
                <div className="w-14 h-14 rounded-2xl bg-white border border-amber-100 shadow-sm flex items-center justify-center mb-8 text-[#0a4d94]">
                  <span className="material-symbols-outlined text-[32px]">manage_search</span>
                </div>
                <div>
                  <h4 className="font-extrabold text-xl mb-3 tracking-wider text-amber-600">KENALI</h4>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Kenali penyelenggara dan regulatornya. Pilih yang resmi dan terpercaya.
                  </p>
                </div>
              </div>

              {/* 4. ADUKAN Pillar Card (col-span-2) */}
              <div className="md:col-span-2 bg-gradient-to-br from-emerald-50 to-teal-50/40 border border-emerald-100/60 rounded-[2.5rem] p-8 md:p-10 flex flex-col md:flex-row items-start gap-6 md:gap-8 justify-between text-slate-800 shadow-xl shadow-emerald-900/5 group hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-emerald-500/5 rounded-full translate-x-1/4 -translate-y-1/4 pointer-events-none" />
                
                <div className="w-14 h-14 rounded-2xl bg-white border border-emerald-100 shadow-sm flex items-center justify-center shrink-0 text-[#0a4d94]">
                  <span className="material-symbols-outlined text-[32px]">campaign</span>
                </div>
                <div>
                  <h4 className="font-extrabold text-xl mb-3 tracking-wider text-emerald-600">ADUKAN</h4>
                  <p className="text-slate-600 text-sm md:text-base leading-relaxed max-w-xl">
                    Adukan masalah ke Bank Indonesia untuk ditindaklanjuti secara cepat, transparan, dan berkeadilan bagi seluruh konsumen jasa sistem pembayaran.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </RevealWrapper>
    </>
  );
}
