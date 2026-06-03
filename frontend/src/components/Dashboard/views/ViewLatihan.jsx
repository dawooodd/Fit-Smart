/* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Dumbbell } from 'lucide-react';
import { api } from '../../../lib/api';

const today = new Date().toISOString().slice(0, 10);

const input =
  'w-full px-4 py-3 rounded-xl border border-(--border-subtle) bg-(--bg-card) text-(--text-main) focus:outline-none focus:ring-2 focus:ring-green-500/30';

const workoutOptions = [
  { name: 'Jogging', caloriesPerMin: 8 },
  { name: 'Push Up', caloriesPerMin: 6 },
  { name: 'Squat', caloriesPerMin: 6 },
  { name: 'Plank', caloriesPerMin: 4 },
  { name: 'Skipping', caloriesPerMin: 10 },
];

export default function ViewLatihan({ progress }) {
  const [sessions, setSessions] = useState([]);
  const [msg, setMsg] = useState('');

  const [ses, setSes] = useState({
    date: today,
    exerciseName: 'Jogging',
    duration: 30,
    caloriesBurned: 240,
    notes: '',
  });

  async function load() {
    const result = await Promise.allSettled([api.getWorkoutSessions()]);

    if (result[0].status === 'fulfilled') {
      setSessions(result[0].value.workoutSessions || []);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function calculateCalories(exerciseName, duration) {
    const selectedWorkout = workoutOptions.find(
      (item) => item.name === exerciseName
    );

    return selectedWorkout
      ? Number(selectedWorkout.caloriesPerMin) * Number(duration || 0)
      : 0;
  }

  async function addSession(e) {
    e.preventDefault();

    await api.createWorkoutSession({
      date: ses.date,
      duration: Number(ses.duration),
      caloriesBurned: Number(ses.caloriesBurned),
      type: ses.exerciseName,
      notes: ses.notes,
    });

    setMsg('Workout session berhasil dicatat.');
    await load();
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {msg && (
        <div className="bg-green-50 text-green-700 border border-green-100 rounded-2xl p-4 font-medium">
          {msg}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-(--bg-card) p-5 rounded-2xl border border-(--border-subtle)">
          <p className="text-xs font-bold text-(--text-muted) uppercase">
            Menit Hari Ini
          </p>

          <h3 className="text-3xl font-black text-(--text-main)">
            {
              sessions.reduce(
                (total, item) => total + Number(item.duration || 0),
                0
              )
            }
          </h3>
        </div>

        <div className="bg-(--bg-card) p-5 rounded-2xl border border-(--border-subtle)">
          <p className="text-xs font-bold text-(--text-muted) uppercase">
            Kalori Terbakar
          </p>

          <h3 className="text-3xl font-black text-(--text-main)">
            {
              sessions.reduce(
                (total, item) =>
                  total + Number(item.caloriesBurned || 0),
                0
              )
            }
          </h3>
        </div>

        <div className="bg-(--bg-card) p-5 rounded-2xl border border-(--border-subtle)">
          <p className="text-xs font-bold text-(--text-muted) uppercase">
            Total Session
          </p>

          <h3 className="text-3xl font-black text-(--text-main)">
            {sessions.length}
          </h3>
        </div>
      </div>

      <div className="bg-(--bg-card) rounded-3xl border border-(--border-subtle) p-6 space-y-4 max-w-2xl">
        <h2 className="text-xl font-bold flex gap-2 text-(--text-main)">
          <Dumbbell />
          Catat Workout
        </h2>

        <form onSubmit={addSession} className="space-y-4">
          <input
            className={input}
            type="date"
            value={ses.date}
            onChange={(e) =>
              setSes({
                ...ses,
                date: e.target.value,
              })
            }
          />

          <select
            className={`${input} appearance-none`}
            value={ses.exerciseName}
            onChange={(e) => {
              const calories = calculateCalories(e.target.value, ses.duration);

              setSes({
                ...ses,
                exerciseName: e.target.value,
                caloriesBurned: calories,
              });
            }}
          >
            {workoutOptions.map((item) => (
              <option key={item.name} value={item.name}>
                {item.name} - {item.caloriesPerMin} kkal/min
              </option>
            ))}
          </select>

          <input
            className={input}
            type="number"
            min="1"
            value={ses.duration}
            onChange={(e) => {
              const calories = calculateCalories(
                ses.exerciseName,
                e.target.value
              );

              setSes({
                ...ses,
                duration: e.target.value,
                caloriesBurned: calories,
              });
            }}
            placeholder="Durasi menit"
          />

          <input
            className={input}
            type="number"
            min="0"
            value={ses.caloriesBurned}
            onChange={(e) =>
              setSes({
                ...ses,
                caloriesBurned: e.target.value,
              })
            }
            placeholder="Kalori terbakar"
          />

          <button className="bg-green-700 text-white rounded-xl px-5 py-3 font-bold">
            Simpan Session
          </button>
        </form>
      </div>

      <div className="bg-(--bg-card) rounded-3xl border border-(--border-subtle) p-6">
        <h2 className="font-bold text-xl text-(--text-main) mb-4">
          Riwayat Workout
        </h2>

        {sessions.length === 0 ? (
          <p className="text-(--text-muted)">
            Belum ada session workout.
          </p>
        ) : (
          <div className="grid md:grid-cols-2 gap-3">
            {sessions.map((session) => (
              <div
                className="p-4 bg-green-50 dark:bg-green-900/20 rounded-2xl"
                key={session.id}
              >
                <b className="text-(--text-main)">
                  {session.type || 'Workout'}
                </b>

                <p className="text-xs text-(--text-muted)">
                  {String(session.date).slice(0, 10)} • {session.duration} menit
                  • {session.caloriesBurned} kkal
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}