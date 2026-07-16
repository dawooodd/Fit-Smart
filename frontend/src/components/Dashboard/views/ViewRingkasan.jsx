/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import {
  Flame, Footprints, Heart, Plus,
  Watch, Activity, Droplets, Moon, CheckCircle, Loader2, RefreshCw,
} from 'lucide-react';
import { formatNumber } from '../../../lib/mappers';
import { api } from '../../../lib/api';
import DailySummaryCard from '../DailySummaryCard';

// ── Wearable stat tile ────────────────────────────────────────────────────────

function WearableStat({ icon: Icon, label, value, colour }) {
  return (
    <div className="flex items-center gap-3 bg-(--bg-subtle) rounded-2xl px-4 py-3">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center bg-current/10 ${colour}`}>
        <Icon size={18} className={colour} />
      </div>
      <div>
        <p className="text-xs text-(--text-muted) font-medium">{label}</p>
        <p className="text-base font-black text-(--text-main)">{value}</p>
      </div>
    </div>
  );
}

// ── Stat card ─────────────────────────────────────────────────────────────────

function StatCard({ icon, colour, title, label, sub, subColour }) {
  const bg = {
    green: 'bg-green-100 dark:bg-green-900/30 text-green-600',
    blue:  'bg-blue-100  dark:bg-blue-900/30  text-blue-600',
    red:   'bg-red-100   dark:bg-red-900/30   text-red-600',
    cyan:  'bg-cyan-100  dark:bg-cyan-900/30  text-cyan-600',
  };
  return (
    <div className="bg-(--bg-card) p-5 rounded-2xl border border-(--border-subtle) shadow-sm flex flex-col justify-between h-36">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${bg[colour]}`}>{icon}</div>
      <div>
        <h3 className="text-2xl font-bold text-(--text-main)">{title}</h3>
        <p className="text-xs font-semibold text-(--text-muted) uppercase tracking-wide mt-1">{label}</p>
        <p className={`text-xs mt-1 font-medium ${subColour}`}>{sub}</p>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function ViewRingkasan({ data }) {
  const { user, profile, todayProgress, isLoading, error } = data || {};

  const [sessions,    setSessions]    = useState([]);
  const [wearable,    setWearable]    = useState(null);
  const [syncLoading, setSyncLoading] = useState(false);
  const [syncMsg,     setSyncMsg]     = useState('');
  const [syncMsgType, setSyncMsgType] = useState('success');

  useEffect(() => {
    async function loadSessions() {
      try {
        const res = await api.getWorkoutSessions();
        setSessions(res.workoutSessions || []);
      } catch {
        setSessions([]);
      }
    }
    loadSessions();
  }, []);

  // ── derived metrics ──
  const totalWorkoutMinutes = sessions.reduce((t, i) => t + Number(i.duration       || 0), 0);
  const totalCaloriesBurned = sessions.reduce((t, i) => t + Number(i.caloriesBurned || 0), 0);
  const dailyTarget         = profile?.dailyCalorieTarget || 0;
  const consumed            = todayProgress?.caloriesConsumed || 0;
  const netCalories         = consumed - totalCaloriesBurned;
  const remaining           = dailyTarget ? Math.max(dailyTarget - netCalories, 0) : 0;
  const waterLiter          = todayProgress?.waterIntake ? todayProgress.waterIntake / 1000 : 0;

  const todayLabel = new Date().toLocaleDateString('id-ID', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  async function handleSyncWearable() {
    try {
      setSyncLoading(true);
      setSyncMsg('');
      const res = await api.syncWearable();
      setWearable(res.data?.wearable || res.wearable || null);
      setSyncMsg('✓ Data wearable berhasil disinkronkan dan disimpan ke database!');
      setSyncMsgType('success');
    } catch (err) {
      setSyncMsg(err.message || 'Gagal sinkronisasi wearable.');
      setSyncMsgType('error');
    } finally {
      setSyncLoading(false);
    }
  }

  if (isLoading) {
    return (
      <div className="bg-(--bg-card) p-6 rounded-2xl border border-(--border-subtle) animate-pulse">
        Memuat data dashboard...
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {error && (
        <div className="bg-amber-50 text-amber-700 border border-amber-100 rounded-2xl p-4 font-medium">
          {error}
        </div>
      )}

      {/* greeting */}
      <div>
        <p className="text-sm text-(--text-muted) font-medium mb-1">{todayLabel}</p>
        <h1 className="text-3xl font-extrabold text-(--text-main) flex items-center gap-2">
          Selamat Datang, {user?.name || 'FitSmart'}!
          <span className="text-green-600">🌿</span>
        </h1>
      </div>

      {/* ── DAILY AI INSIGHT — auto-loads on mount ── */}
      <DailySummaryCard />

      {/* ── STAT CARDS ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<Flame size={20} />} colour="green"
          title={formatNumber(netCalories, '0')} label="Kalori Bersih Hari Ini"
          sub={`Target ${formatNumber(dailyTarget)} • Sisa ${formatNumber(remaining, '0')}`}
          subColour="text-green-600" />
        <StatCard icon={<Footprints size={20} />} colour="blue"
          title={formatNumber(totalWorkoutMinutes, '0')} label="Menit Latihan"
          sub={`Kalori terbakar ${formatNumber(totalCaloriesBurned, '0')}`}
          subColour="text-blue-600" />
        <StatCard icon={<Heart size={20} />} colour="red"
          title={formatNumber(profile?.bmr)} label="BMR"
          sub="Dihitung otomatis dari profil" subColour="text-red-600" />
        <StatCard icon={<Plus size={20} />} colour="cyan"
          title={waterLiter.toLocaleString('id-ID')} label="Liter Air"
          sub="Input backend: waterIntake ml" subColour="text-cyan-600" />
      </div>

      {/* ── WEARABLE SYNC CARD ── */}
      <div className="bg-(--bg-card) rounded-3xl border border-(--border-subtle) p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-violet-100 dark:bg-violet-900/30 text-violet-600 flex items-center justify-center">
              <Watch size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-(--text-main)">Mock Smartwatch Sync</h2>
              <p className="text-sm text-(--text-muted)">Simulasi integrasi data IoT / Wearable Device</p>
            </div>
          </div>
          <button
            onClick={handleSyncWearable}
            disabled={syncLoading}
            className="bg-violet-600 hover:bg-violet-700 disabled:bg-slate-400 text-white rounded-2xl px-5 py-3 font-bold transition inline-flex items-center gap-2"
          >
            {syncLoading
              ? <><Loader2 size={16} className="animate-spin" /> Menyinkronkan...</>
              : <><RefreshCw size={16} /> Sync Smartwatch</>
            }
          </button>
        </div>

        {syncMsg && (
          <div className={`mb-4 rounded-2xl px-4 py-3 text-sm font-medium flex items-center gap-2
            ${syncMsgType === 'success'
              ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300'
              : 'bg-red-50   text-red-700   dark:bg-red-900/20   dark:text-red-300'}`}>
            {syncMsgType === 'success' && <CheckCircle size={16} />}
            {syncMsg}
          </div>
        )}

        {wearable ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              <WearableStat icon={Footprints} label="Langkah"       value={`${wearable.steps.toLocaleString('id-ID')} steps`} colour="text-blue-500" />
              <WearableStat icon={Flame}      label="Kalori Aktif"  value={`${wearable.activeCalories} kkal`}                  colour="text-orange-500" />
              <WearableStat icon={Activity}   label="Detak Jantung" value={`${wearable.avgHeartRate} bpm`}                     colour="text-red-500" />
              <WearableStat icon={Moon}       label="Tidur"         value={`${wearable.sleepHours} jam`}                       colour="text-indigo-500" />
              <WearableStat icon={Droplets}   label="Air"           value={`${(wearable.waterMl / 1000).toFixed(1)} L`}        colour="text-cyan-500" />
            </div>
            <div className="flex items-center gap-2 text-xs text-(--text-muted)">
              <CheckCircle size={13} className="text-green-500" />
              <span>Disinkronkan dari <b>{wearable.device}</b> pukul {new Date(wearable.syncedAt).toLocaleTimeString('id-ID')} — tersimpan ke database</span>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl bg-(--bg-subtle) border border-(--border-subtle) p-5 text-sm text-(--text-muted) leading-relaxed">
            <p>Klik <b>"Sync Smartwatch"</b> untuk mensimulasikan penerimaan data dari perangkat wearable.</p>
            <p className="mt-2">Data yang disinkronkan: <b>langkah harian, kalori aktif, detak jantung, durasi tidur, asupan air</b> — disimpan langsung ke database via Prisma.</p>
          </div>
        )}
      </div>
    </div>
  );
}
