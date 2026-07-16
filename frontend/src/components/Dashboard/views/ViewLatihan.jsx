/* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from 'react';
import { Dumbbell, Play, RotateCcw, Info } from 'lucide-react';
import { api } from '../../../lib/api';
import jogVideo from '../../../assets/jogging.mp4';
import pushupVideo from '../../../assets/push up.mp4';
import squatVideo from '../../../assets/squat.mp4';
import plankVideo from '../../../assets/plank.mp4';
import skippingVideo from '../../../assets/skipping.mp4';

// ─────────────────────────────────────────────────────────────────────────────
// WORKOUT OPTIONS + VIDEO MAPPING
//
// To use local video files:
//   1. Place your .mp4 files inside:  frontend/src/assets/videos/
//   2. Import each file at the top, e.g.:
//        import jogVideo  from '../../../assets/videos/jogging.mp4';
//   3. Replace the URL string below with the imported variable:
//        src: jogVideo
//
// Currently using free CDN placeholder videos for immediate layout testing.
// ─────────────────────────────────────────────────────────────────────────────

const workoutOptions = [
  {
    name: 'Jogging',
    caloriesPerMin: 8,
    emoji: '🏃',
    muscle: 'Full Body, Cardio',
    tips: 'Jaga pace stabil, pendaratan di tengah telapak kaki. Lengan rileks 90°.',
    // 📁 Replace with: import jogVideo from '../../../assets/videos/jogging.mp4'
    videoSrc: jogVideo,
    videoPoster: null,
  },
  {
    name: 'Push Up',
    caloriesPerMin: 6,
    emoji: '💪',
    muscle: 'Dada, Trisep, Bahu',
    tips: 'Tubuh lurus dari kepala ke tumit. Turunkan dada hampir menyentuh lantai.',
    // 📁 Replace with: import pushupVideo from '../../../assets/videos/pushup.mp4'
    videoSrc: pushupVideo,
    videoPoster: null,
  },
  {
    name: 'Squat',
    caloriesPerMin: 6,
    emoji: '🦵',
    muscle: 'Paha, Glutes, Betis',
    tips: 'Kaki selebar bahu, lutut tidak melewati ujung jari. Punggung tegak lurus.',
    // 📁 Replace with: import squatVideo from '../../../assets/videos/squat.mp4'
    videoSrc: squatVideo,
    videoPoster: null,
  },
  {
    name: 'Plank',
    caloriesPerMin: 4,
    emoji: '🏋️',
    muscle: 'Core, Bahu, Punggung',
    tips: 'Jaga pinggul sejajar, jangan turun atau naik. Napas teratur, kontrak core.',
    // 📁 Replace with: import plankVideo from '../../../assets/videos/plank.mp4'
    videoSrc: plankVideo,
    videoPoster: null,
  },
  {
    name: 'Skipping',
    caloriesPerMin: 10,
    emoji: '⚡',
    muscle: 'Full Body, Cardio',
    tips: 'Lompat rendah, pendaratan ringan di ujung jari. Pergelangan tangan putar tali.',
    // 📁 Replace with: import skippingVideo from '../../../assets/videos/skipping.mp4'
    videoSrc: skippingVideo,
    videoPoster: null,
  },
];

// ─────────────────────────────────────────────────────────────────────────────

const today = new Date().toISOString().slice(0, 10);

const inputCls =
  'w-full px-4 py-3 rounded-xl border border-(--border-subtle) bg-(--bg-card) text-(--text-main) focus:outline-none focus:ring-2 focus:ring-green-500/30 transition';

// ── Video Demo Panel ──────────────────────────────────────────────────────────

function WorkoutVideoPanel({ workout }) {
  const videoRef = useRef(null);
  const [videoError, setVideoError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // When workout changes, reload video and reset error state
  useEffect(() => {
    setVideoError(false);
    setIsLoading(true);
    if (videoRef.current) {
      videoRef.current.load();
    }
  }, [workout.videoSrc]);

  function handleError() {
    setVideoError(true);
    setIsLoading(false);
  }

  function handleCanPlay() {
    setIsLoading(false);
  }

  function handleReload() {
    setVideoError(false);
    setIsLoading(true);
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(() => {});
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* video card */}
      <div className="relative rounded-3xl overflow-hidden bg-(--bg-subtle) border border-(--border-subtle) aspect-video">

        {/* loading overlay */}
        {isLoading && !videoError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 z-10 bg-(--bg-subtle)">
            <div className="w-10 h-10 rounded-full border-4 border-green-600/30 border-t-green-600 animate-spin" />
            <p className="text-xs text-(--text-muted)">Memuat video...</p>
          </div>
        )}

        {/* error state */}
        {videoError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10 bg-(--bg-subtle) p-6 text-center">
            <span className="text-4xl">{workout.emoji}</span>
            <p className="font-bold text-(--text-main)">{workout.name}</p>
            <p className="text-xs text-(--text-muted)">
              Video tidak tersedia. Letakkan file{' '}
              <code className="bg-(--bg-card) px-1 rounded">{workout.name.toLowerCase().replace(' ', '_')}.mp4</code>{' '}
              di <code className="bg-(--bg-card) px-1 rounded">frontend/src/assets/videos/</code>
            </p>
            <button
              onClick={handleReload}
              className="inline-flex items-center gap-1.5 text-xs text-green-700 hover:underline"
            >
              <RotateCcw size={12} /> Coba lagi
            </button>
          </div>
        )}

        {/* video element */}
        <video
          ref={videoRef}
          key={workout.videoSrc}           /* forces remount on src change */
          autoPlay
          loop
          muted
          playsInline
          poster={workout.videoPoster || undefined}
          className={`w-full h-full object-cover transition-opacity duration-300 ${videoError ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
          onError={handleError}
          onCanPlay={handleCanPlay}
        >
          <source src={workout.videoSrc} type="video/mp4" />
          Browser Anda tidak mendukung tag video HTML5.
        </video>

        {/* play badge */}
        {!videoError && !isLoading && (
          <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 bg-black/50 text-white text-[11px] font-bold px-2.5 py-1 rounded-full backdrop-blur-sm">
            <Play size={10} className="fill-white" />
            Demo Gerakan
          </div>
        )}
      </div>

      {/* exercise info card */}
      <div className="bg-(--bg-card) rounded-2xl border border-(--border-subtle) p-4 space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{workout.emoji}</span>
          <div>
            <h3 className="font-black text-(--text-main)">{workout.name}</h3>
            <p className="text-xs text-green-600 font-semibold">{workout.muscle}</p>
          </div>
          <span className="ml-auto text-xs font-bold text-orange-500 bg-orange-50 dark:bg-orange-900/20 px-2.5 py-1 rounded-full">
            {workout.caloriesPerMin} kkal/min
          </span>
        </div>

        <div className="flex gap-2 items-start bg-(--bg-subtle) rounded-xl p-3">
          <Info size={14} className="text-blue-500 shrink-0 mt-0.5" />
          <p className="text-xs text-(--text-muted) leading-relaxed">{workout.tips}</p>
        </div>
      </div>

      {/* asset placement guide */}
      <div className="rounded-2xl border border-dashed border-(--border-subtle) p-3">
        <p className="text-[11px] text-(--text-muted) font-mono leading-relaxed">
          📁 <b>Tambah video lokal:</b><br />
          Letakkan <span className="text-green-600">{workout.name.toLowerCase().replace(' ', '_')}.mp4</span><br />
          di <span className="text-blue-500">frontend/src/assets/videos/</span><br />
          lalu update <code>videoSrc</code> di <code>workoutOptions</code>
        </p>
      </div>
    </div>
  );
}

// ── Main View ────────────────────────────────────────────────────────────────

export default function ViewLatihan({ progress }) {
  const [sessions, setSessions] = useState([]);
  const [msg, setMsg]           = useState('');
  const [msgType, setMsgType]   = useState('success');

  const [ses, setSes] = useState({
    date: today,
    exerciseName: 'Jogging',
    duration: 30,
    caloriesBurned: 240,
    notes: '',
  });

  // Derived: currently selected workout object
  const selectedWorkout = workoutOptions.find((w) => w.name === ses.exerciseName) || workoutOptions[0];

  async function load() {
    try {
      const result = await api.getWorkoutSessions();
      setSessions(result.workoutSessions || []);
    } catch {
      setSessions([]);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function calculateCalories(exerciseName, duration) {
    const w = workoutOptions.find((item) => item.name === exerciseName);
    return w ? Number(w.caloriesPerMin) * Number(duration || 0) : 0;
  }

  async function addSession(e) {
    e.preventDefault();
    try {
      await api.createWorkoutSession({
        date:          ses.date,
        duration:      Number(ses.duration),
        caloriesBurned: Number(ses.caloriesBurned),
        type:          ses.exerciseName,
        notes:         ses.notes,
      });
      setMsg('Workout session berhasil dicatat! 💪');
      setMsgType('success');
      await load();
    } catch (err) {
      setMsg(err.message || 'Gagal menyimpan session.');
      setMsgType('error');
    }
  }

  const totalMinutes  = sessions.reduce((t, s) => t + Number(s.duration       || 0), 0);
  const totalCalories = sessions.reduce((t, s) => t + Number(s.caloriesBurned || 0), 0);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* status banner */}
      {msg && (
        <div className={`border rounded-2xl p-4 font-medium text-sm
          ${msgType === 'success'
            ? 'bg-green-50 text-green-700 border-green-100 dark:bg-green-900/20 dark:text-green-300'
            : 'bg-red-50   text-red-700   border-red-100   dark:bg-red-900/20   dark:text-red-300'}`}>
          {msg}
        </div>
      )}

      {/* stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-(--bg-card) p-5 rounded-2xl border border-(--border-subtle)">
          <p className="text-xs font-bold text-(--text-muted) uppercase tracking-wide">Menit Hari Ini</p>
          <h3 className="text-3xl font-black text-(--text-main)">{totalMinutes}</h3>
        </div>
        <div className="bg-(--bg-card) p-5 rounded-2xl border border-(--border-subtle)">
          <p className="text-xs font-bold text-(--text-muted) uppercase tracking-wide">Kalori Terbakar</p>
          <h3 className="text-3xl font-black text-(--text-main)">{totalCalories}</h3>
        </div>
        <div className="bg-(--bg-card) p-5 rounded-2xl border border-(--border-subtle)">
          <p className="text-xs font-bold text-(--text-muted) uppercase tracking-wide">Total Session</p>
          <h3 className="text-3xl font-black text-(--text-main)">{sessions.length}</h3>
        </div>
      </div>

      {/* ── 2-COLUMN FORM + VIDEO ── */}
      <div className="bg-(--bg-card) rounded-3xl border border-(--border-subtle) p-6">
        <h2 className="text-xl font-bold flex gap-2 items-center text-(--text-main) mb-5">
          <Dumbbell size={20} />
          Catat Workout
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">

          {/* LEFT — Input form */}
          <form onSubmit={addSession} className="space-y-4">
            {/* Date */}
            <div>
              <label className="block text-xs font-semibold text-(--text-muted) mb-1.5 uppercase tracking-wide">Tanggal</label>
              <input
                className={inputCls}
                type="date"
                value={ses.date}
                onChange={(e) => setSes({ ...ses, date: e.target.value })}
              />
            </div>

            {/* Exercise type */}
            <div>
              <label className="block text-xs font-semibold text-(--text-muted) mb-1.5 uppercase tracking-wide">
                Jenis Latihan <span className="text-green-600 normal-case">(video berubah otomatis)</span>
              </label>
              <select
                className={`${inputCls} appearance-none cursor-pointer`}
                value={ses.exerciseName}
                onChange={(e) => {
                  const calories = calculateCalories(e.target.value, ses.duration);
                  setSes({ ...ses, exerciseName: e.target.value, caloriesBurned: calories });
                }}
              >
                {workoutOptions.map((item) => (
                  <option key={item.name} value={item.name}>
                    {item.emoji}  {item.name} — {item.caloriesPerMin} kkal/min
                  </option>
                ))}
              </select>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-xs font-semibold text-(--text-muted) mb-1.5 uppercase tracking-wide">Durasi (menit)</label>
              <input
                className={inputCls}
                type="number"
                min="1"
                value={ses.duration}
                onChange={(e) => {
                  const calories = calculateCalories(ses.exerciseName, e.target.value);
                  setSes({ ...ses, duration: e.target.value, caloriesBurned: calories });
                }}
                placeholder="Durasi menit"
              />
            </div>

            {/* Calories burned (auto-calculated, editable) */}
            <div>
              <label className="block text-xs font-semibold text-(--text-muted) mb-1.5 uppercase tracking-wide">
                Kalori Terbakar <span className="text-green-600 normal-case">(otomatis dihitung)</span>
              </label>
              <input
                className={`${inputCls} bg-green-50 dark:bg-green-900/10`}
                type="number"
                min="0"
                value={ses.caloriesBurned}
                onChange={(e) => setSes({ ...ses, caloriesBurned: e.target.value })}
                placeholder="Kalori terbakar"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-semibold text-(--text-muted) mb-1.5 uppercase tracking-wide">Catatan (opsional)</label>
              <input
                className={inputCls}
                type="text"
                value={ses.notes}
                onChange={(e) => setSes({ ...ses, notes: e.target.value })}
                placeholder="Catatan tambahan..."
              />
            </div>

            <button
              type="submit"
              className="w-full bg-green-700 hover:bg-green-800 text-white rounded-xl px-5 py-3 font-bold transition flex items-center justify-center gap-2"
            >
              <Dumbbell size={16} />
              Simpan Session
            </button>
          </form>

          {/* RIGHT — Dynamic video demo */}
          <WorkoutVideoPanel workout={selectedWorkout} />
        </div>
      </div>

      {/* Workout history */}
      <div className="bg-(--bg-card) rounded-3xl border border-(--border-subtle) p-6">
        <h2 className="font-bold text-xl text-(--text-main) mb-4">Riwayat Workout</h2>
        {sessions.length === 0 ? (
          <p className="text-(--text-muted) text-sm">Belum ada session workout. Catat workout pertamamu di atas!</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-3">
            {sessions.map((session) => {
              const wo = workoutOptions.find((w) => w.name === session.type);
              return (
                <div
                  key={session.id}
                  className="p-4 bg-green-50 dark:bg-green-900/20 rounded-2xl flex items-center gap-3"
                >
                  <span className="text-2xl shrink-0">{wo?.emoji || '🏋️'}</span>
                  <div>
                    <b className="text-(--text-main) block">{session.type || 'Workout'}</b>
                    <p className="text-xs text-(--text-muted)">
                      {String(session.date).slice(0, 10)} • {session.duration} menit • {session.caloriesBurned} kkal
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
