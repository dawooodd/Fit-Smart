/* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useState } from 'react';
import { Apple, Camera, Trash2 } from 'lucide-react';
import { api } from '../../../lib/api';

const today = new Date().toISOString().slice(0, 10);

const input =
  'w-full px-4 py-3 rounded-xl border border-(--border-subtle) bg-(--bg-card) text-(--text-main) focus:outline-none focus:ring-2 focus:ring-green-500/30';

const defaultFoods = [
  { name: 'Ayam Goreng', category: 'protein', calories: 260, protein: 25, carbs: 8, fat: 16 },
  { name: 'Ikan Goreng', category: 'protein', calories: 220, protein: 24, carbs: 5, fat: 12 },
  { name: 'Mie Goreng', category: 'carbs', calories: 350, protein: 10, carbs: 50, fat: 14 },
  { name: 'alpukat', category: 'buah', calories: 160, protein: 2, carbs: 9, fat: 15 },
  { name: 'apel', category: 'buah', calories: 52, protein: 0.3, carbs: 14, fat: 0.2 },
  { name: 'bakso', category: 'protein', calories: 180, protein: 12, carbs: 10, fat: 10 },
  { name: 'bayam', category: 'sayur', calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4 },
  { name: 'bebek_betutu', category: 'protein', calories: 450, protein: 30, carbs: 8, fat: 32 },
  { name: 'gado_gado', category: 'mixed', calories: 295, protein: 10, carbs: 24, fat: 18 },
  { name: 'gudeg', category: 'mixed', calories: 320, protein: 8, carbs: 45, fat: 12 },
  { name: 'jeruk', category: 'buah', calories: 47, protein: 0.9, carbs: 12, fat: 0.1 },
  { name: 'kentang', category: 'carbs', calories: 77, protein: 2, carbs: 17, fat: 0.1 },
  { name: 'mangga', category: 'buah', calories: 60, protein: 0.8, carbs: 15, fat: 0.4 },
  { name: 'nasi_goreng', category: 'carbs', calories: 330, protein: 12, carbs: 45, fat: 12 },
  { name: 'pempek', category: 'protein', calories: 280, protein: 11, carbs: 32, fat: 10 },
  { name: 'pisang', category: 'buah', calories: 89, protein: 1.1, carbs: 23, fat: 0.3 },
  { name: 'rawon', category: 'protein', calories: 288, protein: 20, carbs: 12, fat: 18 },
  { name: 'rendang', category: 'protein', calories: 468, protein: 26, carbs: 10, fat: 35 },
  { name: 'sate', category: 'protein', calories: 340, protein: 24, carbs: 10, fat: 22 },
  { name: 'semangka', category: 'buah', calories: 30, protein: 0.6, carbs: 8, fat: 0.2 },
  { name: 'soto', category: 'protein', calories: 180, protein: 15, carbs: 8, fat: 10 },
  { name: 'tomat', category: 'sayur', calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2 },
  { name: 'ubi', category: 'carbs', calories: 86, protein: 1.6, carbs: 20, fat: 0.1 },
  { name: 'wortel', category: 'sayur', calories: 41, protein: 0.9, carbs: 10, fat: 0.2 },
];

function normalize(value) {
  return String(value || '').toLowerCase().replace(/\s+/g, '_');
}

function findFoodByName(name, foods) {
  return foods.find((item) => normalize(item.name) === normalize(name));
}

function safeConfidence(value) {
  if (typeof value === 'object') {
    return Number(value?.value || value?.confidence || 0);
  }

  return Number(value || 0);
}

export default function ViewRencanaMakan({ profile }) {
  const [foods] = useState(defaultFoods);
  const [meals, setMeals] = useState([]);
  const [msg, setMsg] = useState('');

  const [mealForm, setMealForm] = useState({
    date: today,
    mealType: 'lunch',
    foodName: defaultFoods[0].name,
    quantity: 1,
    notes: '',
  });

  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [isDetecting, setIsDetecting] = useState(false);

  async function loadMeals() {
    try {
      const mealRes = await api.getMeals();
      setMeals(mealRes.meals || []);
    } catch {
      setMeals([]);
    }
  }

  useEffect(() => {
    loadMeals();
  }, []);

  const selectedFood = useMemo(
    () => findFoodByName(mealForm.foodName, foods),
    [mealForm.foodName, foods]
  );

  const mealNutrition = useMemo(() => {
    const qty = Number(mealForm.quantity || 1);

    return {
      calories: Number(selectedFood?.calories || 0) * qty,
      protein: Number(selectedFood?.protein || 0) * qty,
      carbs: Number(selectedFood?.carbs || 0) * qty,
      fat: Number(selectedFood?.fat || 0) * qty,
    };
  }, [selectedFood, mealForm.quantity]);

  const todayMeals = meals.filter(
    (item) => String(item.date).slice(0, 10) === today
  );

  const consumedToday = todayMeals.reduce(
    (total, item) => total + Number(item.calories || item.totalCalories || 0),
    0
  );

  const targetCalories = profile?.dailyCalorieTarget || 0;
  const remainingCalories = Math.max(targetCalories - consumedToday, 0);

  async function addMeal(e) {
    e.preventDefault();
    setMsg('');

    if (!selectedFood) {
      setMsg('Pilih makanan terlebih dahulu.');
      return;
    }

    const localMeal = {
      id: `local-${Date.now()}`,
      date: mealForm.date,
      mealType: mealForm.mealType,
      foodName: selectedFood.name,
      quantity: mealForm.quantity,
      calories: mealNutrition.calories,
      protein: mealNutrition.protein,
      carbs: mealNutrition.carbs,
      fat: mealNutrition.fat,
      notes: mealForm.notes,
    };

    try {
      await api.createMeal({
        date: mealForm.date,
        mealType: mealForm.mealType,
        notes: mealForm.notes,
        calories: mealNutrition.calories,
        protein: mealNutrition.protein,
        carbs: mealNutrition.carbs,
        fat: mealNutrition.fat,
        foodName: selectedFood.name,
        foods: [],
      });

      setMeals((value) => [localMeal, ...value]);
      setMsg('Meal berhasil dicatat.');
    } catch {
      setMeals((value) => [localMeal, ...value]);
      setMsg('Meal dicatat di frontend. Backend belum menerima format nutrisi.');
    }
  }

  async function detectFood(e) {
    e.preventDefault();
    setMsg('');

    if (!photo) {
      setMsg('Pilih foto makanan dulu.');
      return;
    }

    try {
      setIsDetecting(true);

      const fd = new FormData();
      fd.append('image', photo);

      const res = await api.uploadPhoto(fd);
      console.log('AI RESPONSE:', res);

      const result = res?.analysis || res?.photo || res || {};

      const rawPrediction =
        result?.predicted_class ||
        result?.predictedClass ||
        result?.label ||
        result?.detectedFoods?.[0] ||
        result?.top_predictions?.[0] ||
        'Unknown';

      const predictedName =
        typeof rawPrediction === 'object'
          ? rawPrediction.label || rawPrediction.name || 'Unknown'
          : rawPrediction;

      const confidenceRaw =
        result?.confidence_percent ??
        result?.confidencePercent ??
        result?.confidence ??
        rawPrediction?.confidence ??
        0;

      const confidenceValue = safeConfidence(confidenceRaw);
      const confidence =
        confidenceValue <= 1
          ? Math.round(confidenceValue * 100)
          : Math.round(confidenceValue);

      const topPredictions = Array.isArray(result?.top_predictions)
        ? result.top_predictions.map((item) => ({
            label: String(item?.label || item?.name || 'Unknown'),
            confidence: safeConfidence(item?.confidence),
            nutrition:
              typeof item?.nutrition === 'object' && item?.nutrition !== null
                ? item.nutrition
                : {},
          }))
        : [];

      const detectedFood = findFoodByName(predictedName, foods);

      if (detectedFood) {
        setMealForm((value) => ({
          ...value,
          foodName: detectedFood.name,
          notes: `Terdeteksi AI: ${detectedFood.name} (${confidence}%)`,
        }));
      }

      setAnalysis({
        predicted_class: String(predictedName || 'Unknown'),
        confidence_percent: confidence,
        top_predictions: topPredictions,
      });

      setMsg(
        detectedFood
          ? `AI mendeteksi ${detectedFood.name}.`
          : `AI mendeteksi ${String(predictedName)}, tapi belum ada di database lokal.`
      );
    } catch (err) {
      console.error('AI DETECT ERROR:', err);
      setMsg('Gagal menganalisis foto. Cek Console browser dan terminal backend.');
    } finally {
      setIsDetecting(false);
    }
  }

  function removeMeal(id) {
    setMeals((value) => value.filter((item) => item.id !== id));
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
            Target Kalori
          </p>
          <h3 className="text-3xl font-black text-(--text-main)">
            {targetCalories.toLocaleString('id-ID')}
          </h3>
        </div>

        <div className="bg-(--bg-card) p-5 rounded-2xl border border-(--border-subtle)">
          <p className="text-xs font-bold text-(--text-muted) uppercase">
            Dikonsumsi Hari Ini
          </p>
          <h3 className="text-3xl font-black text-(--text-main)">
            {consumedToday.toLocaleString('id-ID')}
          </h3>
          <p className="text-xs text-green-600 font-bold">
            Sisa {remainingCalories.toLocaleString('id-ID')} kkal
          </p>
        </div>

        <div className="bg-(--bg-card) p-5 rounded-2xl border border-(--border-subtle)">
          <p className="text-xs font-bold text-(--text-muted) uppercase">
            Food Database
          </p>
          <h3 className="text-3xl font-black text-(--text-main)">
            {foods.length}
          </h3>
          <p className="text-xs text-green-600 font-bold">
            Database nutrisi lokal + AI
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <form
          onSubmit={addMeal}
          className="bg-(--bg-card) rounded-3xl border border-(--border-subtle) p-6 space-y-4 shadow-sm"
        >
          <h2 className="text-xl font-bold text-(--text-main) flex gap-2 items-center">
            <Apple size={20} />
            Catat Makanan yang Dimakan
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              className={input}
              type="date"
              value={mealForm.date}
              onChange={(e) =>
                setMealForm({
                  ...mealForm,
                  date: e.target.value,
                })
              }
            />

            <select
              className={input}
              value={mealForm.mealType}
              onChange={(e) =>
                setMealForm({
                  ...mealForm,
                  mealType: e.target.value,
                })
              }
            >
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
              <option value="snack">Snack</option>
            </select>

            <select
              className={`${input} md:col-span-2`}
              value={mealForm.foodName}
              onChange={(e) =>
                setMealForm({
                  ...mealForm,
                  foodName: e.target.value,
                })
              }
            >
              {foods.map((food) => (
                <option key={food.name} value={food.name}>
                  {food.name} - {food.calories} kkal
                </option>
              ))}
            </select>

            <input
              className={input}
              type="number"
              min="1"
              value={mealForm.quantity}
              onChange={(e) =>
                setMealForm({
                  ...mealForm,
                  quantity: e.target.value,
                })
              }
              placeholder="Porsi"
            />

            <input
              className={input}
              placeholder="Catatan"
              value={mealForm.notes}
              onChange={(e) =>
                setMealForm({
                  ...mealForm,
                  notes: e.target.value,
                })
              }
            />
          </div>

          <div className="rounded-2xl bg-(--bg-subtle) p-4 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div>
              <p className="text-(--text-muted)">Kalori</p>
              <b className="text-(--text-main)">
                {mealNutrition.calories} kkal
              </b>
            </div>

            <div>
              <p className="text-(--text-muted)">Protein</p>
              <b className="text-(--text-main)">
                {mealNutrition.protein} g
              </b>
            </div>

            <div>
              <p className="text-(--text-muted)">Carbs</p>
              <b className="text-(--text-main)">
                {mealNutrition.carbs} g
              </b>
            </div>

            <div>
              <p className="text-(--text-muted)">Fat</p>
              <b className="text-(--text-main)">
                {mealNutrition.fat} g
              </b>
            </div>
          </div>

          <button className="bg-green-700 text-white rounded-xl px-5 py-3 font-bold">
            Simpan Meal
          </button>
        </form>

        <form
          onSubmit={detectFood}
          className="bg-(--bg-card) rounded-3xl border border-(--border-subtle) p-6 space-y-4 shadow-sm"
        >
          <h2 className="text-xl font-bold text-(--text-main) flex gap-2 items-center">
            <Camera size={20} />
            Deteksi Foto Makanan AI
          </h2>

          <label className="block rounded-3xl border-2 border-dashed border-(--border-subtle) p-6 text-center cursor-pointer bg-(--bg-subtle)">
            {preview ? (
              <img
                src={preview}
                className="max-h-56 mx-auto rounded-2xl object-cover"
                alt="Preview makanan"
              />
            ) : (
              <span className="text-(--text-muted)">
                Klik untuk upload foto makanan
              </span>
            )}

            <input
              className="hidden"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                setPhoto(file || null);
                setPreview(file ? URL.createObjectURL(file) : '');
                setAnalysis(null);
              }}
            />
          </label>

          <button
            disabled={isDetecting}
            className="bg-green-700 disabled:bg-slate-500 text-white rounded-xl px-5 py-3 font-bold"
          >
            {isDetecting ? 'Mendeteksi...' : 'Detect Food'}
          </button>

          {analysis && (
            <div className="rounded-2xl bg-(--bg-subtle) p-4 text-sm text-(--text-main) space-y-3">
              <div>
                <p className="text-(--text-muted)">Hasil AI</p>
                <b className="text-lg">
                  {String(analysis.predicted_class || 'Unknown')}
                </b>
                <p className="text-green-500 font-medium">
                  Confidence {analysis.confidence_percent || 0}%
                </p>
              </div>

              {Array.isArray(analysis.top_predictions) &&
                analysis.top_predictions.map((item, index) => {
                  const confidenceValue = safeConfidence(item.confidence);

                  return (
                    <div
                      key={`${item.label}-${index}`}
                      className="rounded-xl border border-(--border-subtle) p-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">
                          {String(item.label || 'Unknown')}
                        </span>

                        <span className="text-green-500 font-bold">
                          {Math.round(confidenceValue * 100)}%
                        </span>
                      </div>

                      {item.nutrition && (
                        <div className="grid grid-cols-2 gap-2 mt-2 text-xs text-(--text-muted)">
                          <div>Kalori: {item.nutrition.calories || 0}</div>
                          <div>Protein: {item.nutrition.protein || 0}g</div>
                          <div>Carbs: {item.nutrition.carbs || 0}g</div>
                          <div>Fat: {item.nutrition.fat || 0}g</div>
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          )}
        </form>
      </div>

      <div className="bg-(--bg-card) rounded-3xl border border-(--border-subtle) p-6 shadow-sm">
        <h2 className="text-xl font-bold text-(--text-main) mb-4">
          Food & Meal Logs
        </h2>

        <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
          {meals.length === 0 ? (
            <p className="text-(--text-muted)">Belum ada meal log.</p>
          ) : (
            meals.map((meal) => (
              <div
                key={meal.id}
                className="flex items-center justify-between p-3 rounded-2xl bg-green-50 dark:bg-green-900/20"
              >
                <div>
                  <b className="text-(--text-main)">
                    {meal.foodName || meal.mealType}
                  </b>

                  <p className="text-xs text-(--text-muted)">
                    {String(meal.date).slice(0, 10)} • {meal.mealType} •{' '}
                    {meal.calories || 0} kkal • P{meal.protein || 0} C
                    {meal.carbs || 0} F{meal.fat || 0}
                  </p>

                  {meal.notes && (
                    <p className="text-xs text-green-500 mt-1">
                      {meal.notes}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => removeMeal(meal.id)}
                  className="text-rose-500"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}