// src/components/Dashboard/MinFitChatbot.jsx
// ─────────────────────────────────────────────────────────────────────────────
// MinFit — In-app floating health consultation chatbot for Fit-Smart.
// Renders a FAB at bottom-right and an expandable chat window with quick
// replies and keyword-matched responses (all Indonesian).
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Sparkles, Zap } from 'lucide-react';

// ── Knowledge base ────────────────────────────────────────────────────────────

const KNOWLEDGE = {
  defisit_kalori: {
    keywords: [
      'defisit', 'kalori', 'deficit', 'calorie', 'kurangi makan',
      'diet', 'turun berat', 'weight loss', 'cara diet',
    ],
    quickLabel: '🔥 Cara defisit kalori?',
    answer:
      '🔥 Cara Memulai Defisit Kalori\n\n' +
      'Defisit kalori = makan lebih sedikit dari yang tubuh bakar (TDEE).\n\n' +
      '1. Hitung BMR (Mifflin-St Jeor):\n' +
      '   • Pria: (10 × BB) + (6.25 × TB) − (5 × Usia) + 5\n' +
      '   • Wanita: (10 × BB) + (6.25 × TB) − (5 × Usia) − 161\n\n' +
      '2. Kalikan BMR × Activity Factor → hasilnya adalah TDEE kamu.\n\n' +
      '3. Kurangi 300–500 kkal/hari dari TDEE untuk penurunan ~0.5 kg/minggu yang aman.\n\n' +
      '4. Pantau di Dashboard Fit-Smart — batang hijau = di bawah TDEE (aman ✅)\n\n' +
      '⚠️ Jangan makan di bawah BMR, bisa bikin metabolisme drop dan yo-yo effect!',
  },
  bmr_tdee: {
    keywords: [
      'bmr', 'tdee', 'basal', 'metabolic', 'metabolisme',
      'kalori bakar', 'energy expenditure', 'kebutuhan kalori',
    ],
    quickLabel: '📐 Apa itu BMR & TDEE?',
    answer:
      '📐 BMR & TDEE — Fondasi Diet Saintifik\n\n' +
      'BMR (Basal Metabolic Rate)\n' +
      'Kalori minimum untuk bertahan hidup (bernapas, jantung, suhu tubuh) tanpa aktivitas apapun.\n\n' +
      'Faktor yang mempengaruhi: berat badan, tinggi, usia, jenis kelamin, komposisi tubuh.\n\n' +
      'TDEE (Total Daily Energy Expenditure)\n' +
      'TDEE = BMR × Faktor Aktivitas\n' +
      '   • Sedentary: × 1.2\n' +
      '   • Light Active (1-3×/minggu): × 1.375\n' +
      '   • Moderate (3-5×/minggu): × 1.55\n' +
      '   • Very Active (6-7×/minggu): × 1.725\n\n' +
      'Kontribusi: BMR ~65%, Aktivitas ~25%, TEF ~10%\n\n' +
      '🎯 Turun BB → makan di bawah TDEE\n' +
      '🎯 Naik BB → makan di atas TDEE\n' +
      '🎯 Maintain → makan sesuai TDEE\n\n' +
      'Fit-Smart menghitung ini otomatis di dashboard analitik kamu!',
  },
  superfood: {
    keywords: [
      'protein', 'superfood', 'makanan sehat', 'rekomendasi makanan',
      'tinggi protein', 'nutrisi', 'nutrient density', 'rendah kalori',
      'makanan diet', 'food', 'meal plan',
    ],
    quickLabel: '🥦 Rekomendasi Superfood',
    answer:
      '🥦 Top Superfood Tinggi Protein & Rendah Kalori\n\n' +
      'Berdasarkan Nutrient Density Score Fit-Smart:\n\n' +
      '⭐ Putih Telur (4 butir) — 14g protein, 68 kkal\n' +
      '⭐ Dada Ayam Panggang — 31g protein, 165 kkal\n' +
      '⭐ Ikan Tuna (100g) — 30g protein, 130 kkal\n' +
      '⭐ Greek Yogurt — 17g protein, 100 kkal\n' +
      '⭐ Tempe (100g) — 19g protein, 192 kkal\n' +
      '⭐ Udang Rebus (100g) — 24g protein, 99 kkal\n\n' +
      'Rumus Density Score:\n' +
      'Score = Normalized(Protein×4 / Kalori) − Penalty(Lemak×9 / Kalori)\n\n' +
      '💡 Tips Meal Plan:\n' +
      '• Pagi: Omelette putih telur + sayuran\n' +
      '• Siang: Dada ayam + nasi merah + brokoli\n' +
      '• Snack: Greek yogurt + buah berry\n' +
      '• Malam: Ikan tuna kukus + salad',
  },
};

const GREETING_RE = /\b(halo|hai|hey|hello|hi|pagi|siang|sore|malam|selamat|assalam)\b/i;

const GREETING =
  'Halo! 👋 Aku MinFit, asisten kesehatan Fit-Smart.\n\n' +
  'Aku bisa bantu kamu soal:\n' +
  '🔥 Defisit Kalori & cara diet\n' +
  '📐 BMR / TDEE & kebutuhan kalori\n' +
  '🥦 Rekomendasi Superfood\n\n' +
  'Ketik pertanyaan atau klik tombol cepat di bawah!';

const FALLBACK =
  'Hmm, aku belum punya jawaban untuk itu 🤔\n\n' +
  'Coba tanya tentang:\n' +
  '• "defisit kalori"\n' +
  '• "BMR" atau "TDEE"\n' +
  '• "protein" atau "superfood"\n\n' +
  'Atau klik salah satu tombol Konsultasi Cepat! 😊';

function findResponse(text) {
  const lower = text.toLowerCase();

  if (GREETING_RE.test(lower)) return GREETING;

  let best = null;
  let bestScore = 0;
  for (const [, topic] of Object.entries(KNOWLEDGE)) {
    const score = topic.keywords.reduce((s, kw) => (lower.includes(kw) ? s + 1 : s), 0);
    if (score > bestScore) {
      bestScore = score;
      best = topic;
    }
  }
  return best ? best.answer : FALLBACK;
}

// ── Timestamp helper ──────────────────────────────────────────────────────────

function timeNow() {
  return new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
}

// ── Chat bubble sub-component ─────────────────────────────────────────────────

function ChatBubble({ role, text, time }) {
  const isBot = role === 'bot';
  return (
    <div className={`flex gap-2.5 ${isBot ? 'justify-start' : 'justify-end'} animate-[fadeSlideUp_0.3s_ease-out]`}>
      {isBot && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shrink-0 shadow-md shadow-green-600/20">
          <Bot size={16} className="text-white" />
        </div>
      )}

      <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap
        ${isBot
          ? 'bg-(--bg-card) border border-(--border-subtle) text-(--text-main) rounded-tl-md shadow-sm'
          : 'bg-gradient-to-br from-green-600 to-emerald-600 text-white rounded-tr-md shadow-md shadow-green-700/20'
        }`}>
        {text}
        <p className={`text-[10px] mt-1.5 text-right ${isBot ? 'text-(--text-muted)' : 'text-green-200'}`}>
          {time}
        </p>
      </div>

      {!isBot && (
        <div className="w-8 h-8 rounded-full bg-(--bg-hover) border border-(--border-subtle) flex items-center justify-center shrink-0">
          <User size={16} className="text-(--text-muted)" />
        </div>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function MinFitChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      text:
        'Halo! 👋 Aku MinFit, konsultan kesehatan virtual Fit-Smart.\n\n' +
        'Silakan ketik pertanyaan atau gunakan Konsultasi Cepat di bawah untuk memulai! 🚀',
      time: timeNow(),
    },
  ]);
  const [input, setInput] = useState('');
  const scrollRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // ── Handlers ──────────────────────────────────────────────────────────────

  function pushExchange(userText) {
    const now = timeNow();
    const botReply = findResponse(userText);
    setMessages((prev) => [
      ...prev,
      { role: 'user', text: userText, time: now },
      { role: 'bot', text: botReply, time: now },
    ]);
  }

  function handleSend() {
    const trimmed = input.trim();
    if (!trimmed) return;
    pushExchange(trimmed);
    setInput('');
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleQuickReply(topicKey) {
    const topic = KNOWLEDGE[topicKey];
    const now = timeNow();
    setMessages((prev) => [
      ...prev,
      { role: 'user', text: topic.quickLabel, time: now },
      { role: 'bot', text: topic.answer, time: now },
    ]);
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      {/* ── Chat window ─────────────────────────────────────────────────── */}
      {isOpen && (
        <div
          className="fixed bottom-24 right-5 z-[9999] w-[370px] max-w-[calc(100vw-2.5rem)]
                     flex flex-col bg-(--bg-card) border border-(--border-subtle)
                     rounded-2xl shadow-2xl overflow-hidden
                     animate-[scaleIn_0.25s_ease-out]"
          style={{ height: 520 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-green-600 to-emerald-600 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                <Bot size={20} className="text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold text-sm leading-tight">MinFit 🤖</h3>
                <p className="text-green-100 text-[11px] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-300 inline-block animate-pulse" />
                  Online — Siap membantu
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors"
              aria-label="Tutup chat"
            >
              <X size={16} className="text-white" />
            </button>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-3 bg-(--bg-main)"
            style={{ scrollBehavior: 'smooth' }}
          >
            {messages.map((msg, i) => (
              <ChatBubble key={i} role={msg.role} text={msg.text} time={msg.time} />
            ))}
          </div>

          {/* Quick replies */}
          <div className="px-4 py-2.5 border-t border-(--border-subtle) bg-(--bg-card) shrink-0">
            <p className="text-[10px] font-bold text-(--accent-primary) uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <Zap size={10} /> Konsultasi Cepat
            </p>
            <div className="flex gap-1.5 flex-wrap">
              {Object.entries(KNOWLEDGE).map(([key, topic]) => (
                <button
                  key={key}
                  onClick={() => handleQuickReply(key)}
                  className="text-[11px] font-medium px-2.5 py-1.5 rounded-full
                             bg-(--bg-subtle) border border-(--border-subtle)
                             text-(--text-secondary) hover:border-green-500 hover:text-green-600
                             transition-all duration-200 hover:shadow-sm"
                >
                  {topic.quickLabel}
                </button>
              ))}
            </div>
          </div>

          {/* Input area */}
          <div className="flex items-center gap-2 px-4 py-3 border-t border-(--border-subtle) bg-(--bg-card) shrink-0">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ketik pertanyaanmu…"
              className="flex-1 text-sm bg-(--bg-subtle) text-(--text-main) placeholder:text-(--text-muted)
                         border border-(--border-subtle) rounded-xl px-3.5 py-2.5
                         focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/30
                         transition-all duration-200"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center
                         text-white shadow-md shadow-green-700/20
                         hover:shadow-lg hover:shadow-green-700/30 hover:scale-105
                         active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed
                         transition-all duration-200"
              aria-label="Kirim pesan"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}

      {/* ── Floating Action Button ──────────────────────────────────────── */}
      <button
        onClick={() => setIsOpen((o) => !o)}
        className={`fixed bottom-6 right-6 z-[9999] w-14 h-14 rounded-full
                    flex items-center justify-center
                    shadow-lg transition-all duration-300 ease-in-out
                    ${isOpen
                      ? 'bg-(--bg-card) border border-(--border-subtle) text-(--text-muted) hover:text-red-500 rotate-90 scale-95'
                      : 'bg-gradient-to-br from-green-600 to-emerald-600 text-white hover:scale-110 hover:shadow-xl hover:shadow-green-600/30'
                    }`}
        aria-label={isOpen ? 'Tutup MinFit Chat' : 'Buka MinFit Chat'}
      >
        {isOpen ? <X size={22} /> : <MessageCircle size={22} />}
      </button>

      {/* ── Keyframe animations ─────────────────────────────────────────── */}
      <style>{`
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.92) translateY(12px); }
          to   { opacity: 1; transform: scale(1)    translateY(0); }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
