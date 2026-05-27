'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

/* --- Administrative Login Screen --- */
function LoginScreen({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Login gagal');
        return;
      }
      onLogin(data.username);
    } catch {
      setError('Tidak dapat terhubung ke server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background:
          'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 50%, #E2E8F0 100%)',
      }}
    >
      <div className="w-full max-w-md bg-white/70 backdrop-blur-2xl border border-white rounded-[2.5rem] p-8 md:p-10 shadow-2xl shadow-[#1B2D4F]/5">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center bg-blue-600/10 shadow-sm animate-pulse">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#2563EB"
              strokeWidth="2"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
          </div>
          <h1 className="text-2xl font-extrabold text-[#1B2D4F] tracking-tight mb-1">
            Ruang PeKA JABAR CMS
          </h1>
          <p className="text-sm font-medium text-slate-500">
            Admin Dashboard Portal
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="text-xs px-4 py-3 rounded-2xl font-bold bg-red-50 text-red-600 border border-red-100 flex items-center gap-2">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4M12 16h.01" />
              </svg>
              {error}
            </div>
          )}

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 ml-1">
              Username
            </label>
            <input
              id="admin-username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
              className="w-full px-4 py-3.5 rounded-2xl text-sm bg-white border border-slate-200 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition duration-200 text-[#1B2D4F] placeholder-slate-400 font-medium"
              placeholder="admin"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 ml-1">
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full px-4 py-3.5 rounded-2xl text-sm bg-white border border-slate-200 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition duration-200 text-[#1B2D4F] placeholder-slate-400 font-medium"
              placeholder="••••••••"
            />
          </div>

          <button
            id="admin-login-btn"
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl text-sm font-bold text-white transition-all bg-[#1B2D4F] hover:bg-blue-900 shadow-lg shadow-[#1B2D4F]/20 disabled:opacity-50 active:scale-95 duration-150"
          >
            {loading ? 'Memproses...' : 'Masuk'}
          </button>

          <p className="text-[11px] text-center font-bold text-slate-400">
            Login pertama otomatis membuat akun admin.
          </p>
        </form>
      </div>
    </div>
  );
}

/* --- Administrative CMS Dashboard Core Component --- */
export default function AdminCMS() {
  const router = useRouter();
  const [adminUser, setAdminUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [materials, setMaterials] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Local search filtering query state
  const [searchQuery, setSearchQuery] = useState('');

  // Telemetry to track message viewed statuses
  const [lastViewed, setLastViewed] = useState(0);
  const [hasUnread, setHasUnread] = useState(false);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Validate session state token on component initialization
  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((d) => {
        if (d.authenticated) setAdminUser(d.username);
      })
      .catch(() => {})
      .finally(() => setAuthChecked(true));
  }, []);

  const fetchMaterials = useCallback(async () => {
    try {
      const res = await fetch('/api/materi');
      if (res.ok) setMaterials(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMessages = useCallback(async () => {
    try {
      const res = await fetch('/api/messages');
      if (res.ok) setMessages(await res.json());
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    if (adminUser) {
      const initDashboard = async () => {
        await Promise.all([fetchMaterials(), fetchMessages()]);
        
        let val = localStorage.getItem('lastViewedMessagesTime');
        if (!val) {
          val = String(Date.now());
          localStorage.setItem('lastViewedMessagesTime', val);
        }
        setLastViewed(Number(val));
      };
      initDashboard();
    }
  }, [adminUser, fetchMaterials, fetchMessages]);

  // Check incoming message timestamps against local viewed coordinates
  useEffect(() => {
    if (messages.length > 0) {
      const unread = messages.some((msg) => {
        // Compare msg date timestamp with lastViewed
        const msgTime = new Date(msg.created_at).getTime();
        return isNaN(msgTime) ? false : msgTime > lastViewed;
      });
      if (hasUnread !== unread) {
        setHasUnread(unread);
      }
    } else {
      if (hasUnread !== false) {
        setHasUnread(false);
      }
    }
  }, [messages, lastViewed, hasUnread]);

  const handleMarkAsRead = () => {
    if (!hasUnread) return;
    const now = Date.now();
    localStorage.setItem('lastViewedMessagesTime', String(now));
    setLastViewed(now);
    setHasUnread(false);
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setAdminUser(null);
  };

  const handleDelete = async (id) => {
    if (!confirm('Anda yakin ingin menghapus materi ini?')) return;
    try {
      const res = await fetch(`/api/materi/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('Materi berhasil dihapus.');
        fetchMaterials();
      } else showToast('Gagal menghapus.', 'error');
    } catch {
      showToast('Gagal menghapus.', 'error');
    }
  };

  const handleDeleteMessage = async (id) => {
    if (!confirm('Anda yakin ingin menghapus pesan ini?')) return;
    try {
      const res = await fetch(`/api/messages/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('Pesan berhasil dihapus.');
        fetchMessages();
      } else showToast('Gagal menghapus pesan.', 'error');
    } catch {
      showToast('Gagal menghapus pesan.', 'error');
    }
  };

  // Security middleware routing checkpoint
  if (!authChecked)
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          background:
            'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 50%, #E2E8F0 100%)',
        }}
      >
        <div className="w-8 h-8 border-3 border-[#1B2D4F] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  if (!adminUser) return <LoginScreen onLogin={setAdminUser} />;

  // Apply search filtering on cached lists
  const filteredMaterials = materials.filter(
    (m) =>
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.cat.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      className="min-h-screen py-6 md:py-10 px-4 md:px-8"
      style={{
        background:
          'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 50%, #E2E8F0 100%)',
      }}
    >
      {/* Transient toast alerts overlay wrapper */}
      {toast && (
        <div className="fixed top-6 right-6 z-[999] animate-fade-up">
          <div
            className="px-5 py-3 rounded-2xl text-sm font-bold shadow-xl border"
            style={{
              background: toast.type === 'error' ? '#FEE2E2' : '#D1FAE5',
              color: toast.type === 'error' ? '#991B1B' : '#065F46',
              borderColor: toast.type === 'error' ? '#FECACA' : '#A7F3D0',
            }}
          >
            {toast.msg}
          </div>
        </div>
      )}

      {/* Main Dashboard wrapper container */}
      <div className="max-w-[1400px] mx-auto bg-white/75 backdrop-blur-3xl border border-white/60 rounded-[3rem] shadow-2xl shadow-[#1B2D4F]/5 overflow-hidden min-h-[calc(100vh-80px)] flex flex-col p-6 md:p-8">
        {/* Header Navigation panel */}
        <header className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-5 border-b border-slate-100/50 bg-white/40 rounded-3xl px-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center bg-[#1B2D4F] shadow-md shadow-[#1B2D4F]/20">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
              >
                <rect x="3" y="3" width="7" height="7" rx="1.5" />
                <rect x="14" y="3" width="7" height="7" rx="1.5" />
                <rect x="3" y="14" width="7" height="7" rx="1.5" />
                <rect x="14" y="14" width="7" height="7" rx="1.5" />
              </svg>
            </div>
            <div>
              <h1 className="text-base font-extrabold text-[#1B2D4F] tracking-tight">
                Ruang PeKA JABAR CMS
              </h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Portal Kelola Materi & Pesan
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-[#1B2D4F] bg-slate-100 px-3.5 py-1.5 rounded-full">
              {adminUser}
            </span>
            <button
              onClick={handleLogout}
              className="text-[11px] font-bold px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition active:scale-95 duration-100"
            >
              Keluar
            </button>
          </div>
        </header>

        {/* --- CMS Dashboard Bento Grid Workspace --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 items-start">
          {/* Card 1: Session Welcome and Metrics Overview Panel */}
          <div className="lg:col-span-2 relative bg-civic-navy rounded-3xl p-8 text-left overflow-hidden shadow-xl shadow-blue-900/10 min-h-[190px] flex flex-col justify-center">
            {/* Regional cloud motif background graphic layer */}
            <div className="absolute inset-0 z-0 pointer-events-none">
              <Image
                src="/mega_mendung.jpeg"
                alt="Motif Mega Mendung"
                fill
                sizes="(max-width: 1024px) 100vw, 900px"
                className="object-cover opacity-[0.12] mix-blend-color-dodge -scale-y-100"
              />
              <div className="absolute inset-0 bg-[#1B2D4F]/85 mix-blend-multiply" />
            </div>
            <div className="relative z-10">
              <p className="text-overline text-blue-300 mb-2">
                Selamat Datang,
              </p>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-4 tracking-tight">
                Admin Dashboard
              </h2>

              {/* Metrics data display group */}
              <div className="flex gap-8">
                <div>
                  <p className="text-[10px] font-extrabold text-blue-300 uppercase tracking-wider mb-1">
                    Materi Tersedia
                  </p>
                  <p className="text-2xl font-black text-white">
                    {materials.length}
                  </p>
                </div>
                <div className="w-px bg-white/20 h-10 mt-1" />
                <div>
                  <p className="text-[10px] font-extrabold text-blue-300 uppercase tracking-wider mb-1">
                    Pesan Pengguna
                  </p>
                  <p className="text-2xl font-black text-white flex items-center gap-2">
                    {messages.length}
                    {hasUnread && (
                      <span className="w-2.5 h-2.5 rounded-full bg-orange-500 inline-block animate-ping" />
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Quick actions and utility triggers panel */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col gap-4 justify-center min-h-[190px]">
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
              Aksi Cepat
            </p>
            <div className="grid grid-cols-1 gap-2.5">
              <Link
                href="/"
                target="_blank"
                className="w-full py-3 px-4 rounded-2xl bg-slate-50 border border-slate-200/50 hover:bg-slate-100 text-xs font-bold text-[#1B2D4F] flex items-center justify-between transition-all duration-200 group"
              >
                Lihat Website Utama
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  className="group-hover:translate-x-1 transition-transform"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
              <button
                onClick={() => router.push('/kelola-8f2k9x3m/builder/new')}
                className="w-full py-3.5 px-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-xs font-extrabold text-white flex items-center justify-between transition-all duration-200 shadow-md shadow-blue-500/20 active:scale-95 group"
              >
                Buat Materi Baru (Visual)
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  className="group-hover:rotate-90 transition-transform"
                >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Card 3: Educational course database management grid */}
          <div className="lg:col-span-2 bg-white/70 border border-slate-100 rounded-[2rem] p-6 shadow-sm flex flex-col gap-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-extrabold text-[#1B2D4F]">
                  Daftar Materi Edukasi
                </h3>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Katalog Kelas & Artikel
                </p>
              </div>

              {/* Interactive filtering input */}
              <div className="relative w-full sm:w-64">
                <svg
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  type="text"
                  placeholder="Cari judul atau kategori..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl focus:border-blue-500 outline-none w-full text-xs font-semibold text-[#1B2D4F] placeholder-slate-400 transition"
                />
              </div>
            </div>

            {/* Material query listing container */}
            <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-1 no-scrollbar">
              {loading ? (
                <div className="text-center py-12 text-xs font-bold text-slate-400">
                  Memuat materi...
                </div>
              ) : filteredMaterials.length === 0 ? (
                <div className="text-center py-12 text-xs font-bold text-slate-400 bg-slate-50/50 border border-dashed rounded-2xl">
                  Belum ada materi terdaftar.
                </div>
              ) : (
                filteredMaterials.map((m) => (
                  <div
                    key={m.id}
                    className="group flex items-center justify-between p-3.5 bg-white border border-slate-100 hover:border-blue-100 rounded-2xl shadow-sm hover:shadow transition-all duration-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50/60 border border-blue-100/50 flex items-center justify-center text-blue-600 flex-shrink-0">
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <rect x="3" y="11" width="18" height="11" rx="2" />
                          <path d="M7 11V7a5 5 0 0110 0v4" />
                        </svg>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 uppercase tracking-wider">
                            {m.cat}
                          </span>
                          <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 uppercase tracking-wider">
                            {m.level}
                          </span>
                        </div>
                        <h4 className="text-xs font-extrabold text-[#1B2D4F] leading-tight group-hover:text-blue-600 transition-colors line-clamp-1">
                          {m.title}
                        </h4>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          router.push(`/kelola-8f2k9x3m/builder/${m.id}`)
                        }
                        className="text-[10px] font-extrabold px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl transition active:scale-95 duration-100"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(m.id)}
                        className="text-[10px] font-extrabold px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-500 rounded-xl transition active:scale-95 duration-100"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Card 4: Contact submissions database records log */}
          <div
            onMouseEnter={handleMarkAsRead}
            onClick={handleMarkAsRead}
            className="bg-white/70 border border-slate-100 rounded-[2rem] p-6 shadow-sm flex flex-col gap-5 min-h-[420px]"
          >
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-base font-extrabold text-[#1B2D4F]">
                  Pesan Pengguna
                </h3>

                {/* Unread state visual indicator dot */}
                {hasUnread && (
                  <span className="flex h-3 w-3 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500 border border-white"></span>
                  </span>
                )}
              </div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Adukan & Bantuan Form
              </p>
            </div>

            {/* Submissions query listing container */}
            <div className="space-y-3 flex-1 max-h-[480px] overflow-y-auto pr-1 no-scrollbar">
              {messages.length === 0 ? (
                <div className="text-center py-20 text-xs font-bold text-slate-400 bg-slate-50/50 border border-dashed rounded-2xl">
                  Belum ada pesan masuk.
                </div>
              ) : (
                messages.map((msg) => {
                  const msgTime = new Date(msg.created_at).getTime();
                  const isMsgUnread = !isNaN(msgTime) && msgTime > lastViewed;

                  return (
                    <div
                      key={msg.id}
                      className={`p-4 rounded-2xl border transition-all duration-200 relative ${isMsgUnread ? 'bg-amber-50/30 border-amber-100 shadow-sm' : 'bg-white border-slate-100'}`}
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-7 h-7 rounded-lg font-bold text-[10px] flex items-center justify-center uppercase flex-shrink-0 ${isMsgUnread ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}
                          >
                            {msg.name.slice(0, 2)}
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-[#1B2D4F] leading-tight line-clamp-1">
                              {msg.name}
                            </h4>
                            <span className="text-[9px] font-medium text-slate-400">
                              {msg.created_at.slice(0, 10)}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteMessage(msg.id)}
                          className="text-[9px] font-bold px-2 py-1 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg"
                        >
                          Hapus
                        </button>
                      </div>
                      <p className="text-[11px] font-semibold text-slate-500 leading-relaxed mb-1 line-clamp-3">
                        {msg.message}
                      </p>
                      <span className="text-[9px] text-blue-600 font-bold block truncate">
                        {msg.email}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
