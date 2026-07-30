"""
MinFit — Chatbot Konsultasi Kesehatan Fit-Smart
================================================
Chatbot interaktif berbasis Streamlit yang bertindak sebagai admin/konsultan
kesehatan ramah untuk aplikasi Fit-Smart.

Fitur:
  • Chat UI native Streamlit (st.chat_message, st.chat_input)
  • Quick Reply buttons ("Konsultasi Cepat")
  • Keyword matching untuk respons otomatis
  • Chat history via st.session_state
  • Respons ilmiah dalam Bahasa Indonesia

Jalankan:
    streamlit run minfit_chat.py

Author : FitSmart Team
Date   : 2026
"""

import streamlit as st
import re
from datetime import datetime

# ============================================================================
# 1. PAGE CONFIGURATION
# ============================================================================

st.set_page_config(
    page_title="MinFit — Konsultan Kesehatan Fit-Smart",
    page_icon="🤖",
    layout="centered",
    initial_sidebar_state="collapsed",
)

# ============================================================================
# 2. CUSTOM CSS — Premium dark-mode chat UI
# ============================================================================

st.markdown("""
<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

/* ---------- Root variables ---------- */
:root {
    --bg-primary: #0f1117;
    --bg-secondary: #1a1c26;
    --bg-card: #22252f;
    --accent-gradient: linear-gradient(135deg, #00c9a7, #00b4d8);
    --accent-solid: #00c9a7;
    --accent-secondary: #00b4d8;
    --text-primary: #e8eaed;
    --text-secondary: #9aa0a6;
    --text-muted: #6b7280;
    --border-subtle: rgba(255,255,255,0.06);
    --shadow-glow: 0 0 20px rgba(0,201,167,0.12);
}

/* ---------- Global body & fonts ---------- */
html, body, [class*="css"] {
    font-family: 'Inter', sans-serif !important;
}

/* ---------- Header banner ---------- */
.minfit-header {
    background: linear-gradient(135deg, #0d9373 0%, #0891b2 50%, #6366f1 100%);
    border-radius: 16px;
    padding: 2rem 2.4rem;
    margin-bottom: 1.6rem;
    position: relative;
    overflow: hidden;
    box-shadow: 0 8px 32px rgba(0,201,167,0.18);
}
.minfit-header::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%);
    animation: shimmer 6s ease-in-out infinite;
}
@keyframes shimmer {
    0%, 100% { transform: translateX(-30%) translateY(-30%); }
    50%      { transform: translateX(30%) translateY(30%); }
}
.minfit-header h1 {
    color: #fff;
    font-size: 1.9rem;
    font-weight: 800;
    margin: 0;
    position: relative;
    z-index: 1;
    letter-spacing: -0.02em;
}
.minfit-header p {
    color: rgba(255,255,255,0.85);
    font-size: 0.95rem;
    margin: 0.4rem 0 0;
    position: relative;
    z-index: 1;
    font-weight: 400;
}

/* ---------- Quick-reply section ---------- */
.quick-section-label {
    color: var(--accent-solid);
    font-weight: 700;
    font-size: 0.82rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    margin-bottom: 0.4rem;
}

div.stButton > button {
    background: var(--bg-card) !important;
    color: var(--text-primary) !important;
    border: 1px solid var(--border-subtle) !important;
    border-radius: 12px !important;
    padding: 0.65rem 1.1rem !important;
    font-size: 0.85rem !important;
    font-weight: 500 !important;
    transition: all 0.25s cubic-bezier(.4,0,.2,1) !important;
    width: 100% !important;
    text-align: left !important;
}
div.stButton > button:hover {
    background: linear-gradient(135deg, rgba(0,201,167,0.12), rgba(0,180,216,0.12)) !important;
    border-color: var(--accent-solid) !important;
    box-shadow: var(--shadow-glow) !important;
    transform: translateY(-1px) !important;
}

/* ---------- Chat message bubbles ---------- */
[data-testid="stChatMessage"] {
    border-radius: 14px !important;
    padding: 1rem 1.2rem !important;
    margin-bottom: 0.6rem !important;
    border: 1px solid var(--border-subtle) !important;
    animation: fadeSlideIn 0.35s ease-out both;
}
@keyframes fadeSlideIn {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
}

/* ---------- Chat input ---------- */
[data-testid="stChatInput"] textarea {
    border-radius: 14px !important;
    border: 1px solid var(--border-subtle) !important;
    font-family: 'Inter', sans-serif !important;
}

/* ---------- Divider ---------- */
.subtle-divider {
    border: none;
    border-top: 1px solid var(--border-subtle);
    margin: 1.2rem 0;
}

/* ---------- Footer ---------- */
.minfit-footer {
    text-align: center;
    color: var(--text-muted);
    font-size: 0.72rem;
    padding: 1.4rem 0 0.6rem;
}
</style>
""", unsafe_allow_html=True)

# ============================================================================
# 3. KNOWLEDGE BASE — detailed Indonesian-language answers
# ============================================================================

KNOWLEDGE_BASE: dict[str, dict] = {
    "defisit_kalori": {
        "keywords": [
            "defisit", "kalori", "deficit", "calorie", "kurangi makan",
            "diet", "turun berat", "weight loss", "cara diet",
        ],
        "button_label": "🔥 Bagaimana cara memulai defisit kalori?",
        "answer": (
            "## 🔥 Cara Memulai Defisit Kalori yang Aman & Efektif\n\n"
            "Defisit kalori adalah kondisi di mana **kalori yang kamu konsumsi lebih sedikit "
            "daripada kalori yang tubuhmu bakar (TDEE)**. Ini adalah prinsip fundamental dari "
            "penurunan berat badan.\n\n"
            "### Langkah-langkah Fit-Smart:\n\n"
            "1. **Hitung BMR (Basal Metabolic Rate)** — kalori yang tubuhmu butuhkan saat "
            "istirahat total. Fit-Smart menggunakan rumus *Mifflin-St Jeor*:\n"
            "   - 🧑 Pria: `BMR = (10 × BB kg) + (6.25 × TB cm) − (5 × Usia) + 5`\n"
            "   - 👩 Wanita: `BMR = (10 × BB kg) + (6.25 × TB cm) − (5 × Usia) − 161`\n\n"
            "2. **Kalikan dengan Activity Multiplier** untuk mendapatkan TDEE:\n"
            "   | Level Aktivitas | Multiplier |\n"
            "   |---|---|\n"
            "   | Sedentary (jarang olahraga) | × 1.2 |\n"
            "   | Light Active (1-3×/minggu) | × 1.375 |\n"
            "   | Moderate (3-5×/minggu) | × 1.55 |\n"
            "   | Very Active (6-7×/minggu) | × 1.725 |\n\n"
            "3. **Kurangi 300–500 kkal/hari** dari TDEE-mu — ini menghasilkan penurunan "
            "**±0.5 kg/minggu** yang sehat dan *sustainable*.\n\n"
            "4. **Pantau dengan Fit-Smart Dashboard** — lihat grafik harian untuk memastikan "
            "kamu tetap di bawah garis TDEE (batang hijau = aman ✅).\n\n"
            "> ⚠️ **Penting:** Jangan potong kalori terlalu drastis (< BMR). Hal ini bisa "
            "menurunkan metabolisme dan menyebabkan *yo-yo effect*.\n\n"
            "---\n"
            "*Mau MinFit bantu hitung TDEE kamu? Ketik berat, tinggi, usia, dan gender kamu!* 💪"
        ),
    },
    "bmr_tdee": {
        "keywords": [
            "bmr", "tdee", "basal", "metabolic", "metabolisme",
            "kalori bakar", "energy expenditure", "kebutuhan kalori",
        ],
        "button_label": "📐 Apa itu BMR dan TDEE?",
        "answer": (
            "## 📐 Memahami BMR & TDEE — Fondasi Ilmu Gizi Modern\n\n"
            "### 🔬 BMR (Basal Metabolic Rate)\n"
            "BMR adalah **jumlah minimum kalori** yang tubuhmu butuhkan hanya untuk bertahan "
            "hidup (bernapas, memompa darah, menjaga suhu tubuh) selama 24 jam "
            "**tanpa aktivitas fisik apapun**.\n\n"
            "Faktor yang mempengaruhi BMR:\n"
            "- **Berat badan** — semakin berat, semakin tinggi BMR\n"
            "- **Tinggi badan** — tubuh lebih besar butuh energi lebih\n"
            "- **Usia** — BMR menurun ±2% per dekade setelah usia 20\n"
            "- **Jenis kelamin** — pria umumnya BMR lebih tinggi (massa otot)\n"
            "- **Komposisi tubuh** — otot membakar lebih banyak kalori daripada lemak\n\n"
            "### ⚡ TDEE (Total Daily Energy Expenditure)\n"
            "TDEE = **BMR × Activity Multiplier**. Ini adalah total kalori yang kamu bakar "
            "per hari termasuk semua aktivitas.\n\n"
            "```\n"
            "TDEE = BMR × Faktor Aktivitas\n"
            "```\n\n"
            "| Komponen | Kontribusi |\n"
            "|---|---|\n"
            "| BMR | ~60-75% dari TDEE |\n"
            "| Aktivitas Fisik | ~15-30% |\n"
            "| Thermic Effect of Food (TEF) | ~10% |\n\n"
            "### 🎯 Kenapa Ini Penting di Fit-Smart?\n"
            "- **Mau turun BB?** → Makan **di bawah** TDEE (defisit)\n"
            "- **Mau naik BB?** → Makan **di atas** TDEE (surplus)\n"
            "- **Mau maintain?** → Makan **sesuai** TDEE\n\n"
            "Fit-Smart menghitung ini secara otomatis dan menampilkannya di dashboard "
            "analitik, sehingga kamu bisa melihat apakah asupan harianmu sudah sesuai "
            "target. 📊\n\n"
            "---\n"
            "*Ketik \"defisit kalori\" kalau kamu ingin tahu cara menerapkan prinsip ini!*"
        ),
    },
    "superfood": {
        "keywords": [
            "protein", "superfood", "makanan sehat", "rekomendasi makanan",
            "tinggi protein", "nutrisi", "nutrient density", "rendah kalori",
            "makanan diet", "food recommendation", "meal plan",
        ],
        "button_label": "🥦 Rekomendasi makanan tinggi protein (Superfood)",
        "answer": (
            "## 🥦 Rekomendasi Superfood Tinggi Protein & Rendah Kalori\n\n"
            "Berdasarkan analisis **Nutrient Density Score** di database Fit-Smart, "
            "berikut adalah makanan-makanan dengan skor tertinggi — artinya mereka memberikan "
            "**protein paling banyak per kalori yang dikonsumsi**.\n\n"
            "### 🏆 Top Superfood Fit-Smart\n\n"
            "| Makanan | Protein | Kalori | Density Score |\n"
            "|---|---|---|---|\n"
            "| 🥚 Putih Telur (4 butir) | ~14g | ~68 kkal | ⭐⭐⭐⭐⭐ |\n"
            "| 🍗 Dada Ayam Panggang | ~31g | ~165 kkal | ⭐⭐⭐⭐⭐ |\n"
            "| 🐟 Ikan Tuna (100g) | ~30g | ~130 kkal | ⭐⭐⭐⭐⭐ |\n"
            "| 🥛 Greek Yogurt (non-fat) | ~17g | ~100 kkal | ⭐⭐⭐⭐ |\n"
            "| 🫘 Tempe (100g) | ~19g | ~192 kkal | ⭐⭐⭐⭐ |\n"
            "| 🥩 Daging Sapi Tanpa Lemak | ~26g | ~150 kkal | ⭐⭐⭐⭐ |\n"
            "| 🌿 Tahu Sutra (150g) | ~12g | ~80 kkal | ⭐⭐⭐⭐ |\n"
            "| 🦐 Udang Rebus (100g) | ~24g | ~99 kkal | ⭐⭐⭐⭐ |\n\n"
            "### 📊 Cara Fit-Smart Menghitung Density Score\n\n"
            "```\n"
            "Protein_Cal_Ratio  = (Protein × 4) / Total Kalori\n"
            "Fat_Cal_Ratio      = (Lemak × 9) / Total Kalori\n"
            "Density Score      = Normalized(Protein_Cal_Ratio) − Penalty(Fat_Cal_Ratio)\n"
            "```\n\n"
            "Semakin **tinggi skor**, semakin bagus makanan tersebut untuk program diet "
            "karena memberikan rasa kenyang lebih lama tanpa kalori berlebih.\n\n"
            "### 💡 Tips Meal Plan Harian\n"
            "- **Sarapan:** Omelette putih telur + sayuran\n"
            "- **Makan Siang:** Dada ayam panggang + nasi merah + brokoli\n"
            "- **Camilan:** Greek yogurt + buah berry\n"
            "- **Makan Malam:** Ikan tuna kukus + salad\n\n"
            "---\n"
            "*Kamu bisa lihat scatter plot Superfood lengkap di FitSmart Analytics Dashboard!* 📈"
        ),
    },
}

# ============================================================================
# 4. HELPER FUNCTIONS
# ============================================================================

GREETING_PATTERNS = re.compile(
    r"\b(halo|hai|hey|hello|hi|p|pagi|siang|sore|malam|selamat|assalam|good\s?morning|"
    r"good\s?evening|good\s?afternoon|hola|yo|sup)\b",
    re.IGNORECASE,
)

GREETING_RESPONSE = (
    "Halo! 👋 Selamat datang di **Fit-Smart**!\n\n"
    "Aku **MinFit**, asisten kesehatan pribadimu. "
    "Aku siap membantu kamu dengan pertanyaan seputar:\n\n"
    "- 🔥 **Defisit Kalori** & cara diet sehat\n"
    "- 📐 **BMR / TDEE** & kebutuhan kalorimu\n"
    "- 🥦 **Rekomendasi Superfood** tinggi protein\n"
    "- 📊 Data & insight dari dashboard analitik\n\n"
    "Kamu bisa langsung **ketik pertanyaan** atau gunakan tombol "
    "**Konsultasi Cepat** di atas. Yuk mulai! 💪"
)

FALLBACK_RESPONSE = (
    "Hmm, aku belum punya jawaban spesifik untuk pertanyaan itu 🤔\n\n"
    "Tapi jangan khawatir! Berikut beberapa topik yang bisa aku bantu:\n\n"
    "1. **Defisit Kalori** — ketik *\"defisit kalori\"*\n"
    "2. **BMR & TDEE** — ketik *\"BMR\"* atau *\"TDEE\"*\n"
    "3. **Superfood / Makanan Protein** — ketik *\"protein\"* atau *\"superfood\"*\n\n"
    "Atau klik salah satu tombol **Konsultasi Cepat** di atas! 😊"
)


def find_best_response(user_input: str) -> str:
    """Match user input against knowledge base keywords."""
    text = user_input.lower().strip()

    # Check greeting first
    if GREETING_PATTERNS.search(text):
        return GREETING_RESPONSE

    # Score each topic by how many keywords match
    best_topic = None
    best_score = 0

    for topic_key, topic_data in KNOWLEDGE_BASE.items():
        score = sum(1 for kw in topic_data["keywords"] if kw in text)
        if score > best_score:
            best_score = score
            best_topic = topic_key

    if best_topic and best_score > 0:
        return KNOWLEDGE_BASE[best_topic]["answer"]

    return FALLBACK_RESPONSE


def get_timestamp() -> str:
    """Return a short timestamp string."""
    return datetime.now().strftime("%H:%M")


# ============================================================================
# 5. SESSION STATE INITIALIZATION
# ============================================================================

if "messages" not in st.session_state:
    st.session_state.messages = [
        {
            "role": "assistant",
            "content": (
                "Halo! 👋 Aku **MinFit**, konsultan kesehatan virtual dari **Fit-Smart**.\n\n"
                "Aku di sini untuk membantumu memahami cara kerja tubuhmu, "
                "menghitung kebutuhan kalori, dan merekomendasikan makanan terbaik "
                "untuk tujuan kesehatanmu.\n\n"
                "Silakan **ketik pertanyaan** atau pilih salah satu topik "
                "**Konsultasi Cepat** di bawah ini untuk memulai! 🚀"
            ),
            "time": get_timestamp(),
        }
    ]

if "pending_quick_reply" not in st.session_state:
    st.session_state.pending_quick_reply = None

# ============================================================================
# 6. UI — HEADER
# ============================================================================

st.markdown(
    """
    <div class="minfit-header">
        <h1>🤖 MinFit — Health Consultant</h1>
        <p>Asisten kesehatan cerdas dari Fit-Smart &bull; Personalized &bull; Science-based</p>
    </div>
    """,
    unsafe_allow_html=True,
)

# ============================================================================
# 7. UI — QUICK REPLY BUTTONS ("Konsultasi Cepat")
# ============================================================================

st.markdown('<p class="quick-section-label">⚡ Konsultasi Cepat</p>', unsafe_allow_html=True)

qr_cols = st.columns(3)

for idx, (topic_key, topic_data) in enumerate(KNOWLEDGE_BASE.items()):
    with qr_cols[idx]:
        if st.button(topic_data["button_label"], key=f"qr_{topic_key}", use_container_width=True):
            st.session_state.pending_quick_reply = topic_key

st.markdown('<hr class="subtle-divider">', unsafe_allow_html=True)

# ============================================================================
# 8. PROCESS PENDING QUICK REPLY (before rendering history)
# ============================================================================

if st.session_state.pending_quick_reply:
    topic_key = st.session_state.pending_quick_reply
    topic_data = KNOWLEDGE_BASE[topic_key]

    # Add user "message" for the button click
    st.session_state.messages.append(
        {
            "role": "user",
            "content": topic_data["button_label"],
            "time": get_timestamp(),
        }
    )

    # Add MinFit response
    st.session_state.messages.append(
        {
            "role": "assistant",
            "content": topic_data["answer"],
            "time": get_timestamp(),
        }
    )

    st.session_state.pending_quick_reply = None

# ============================================================================
# 9. RENDER CHAT HISTORY
# ============================================================================

for msg in st.session_state.messages:
    avatar = "🤖" if msg["role"] == "assistant" else "🧑"
    name = "MinFit" if msg["role"] == "assistant" else "Kamu"
    with st.chat_message(msg["role"], avatar=avatar):
        st.markdown(f"**{name}** · `{msg.get('time', '')}`")
        st.markdown(msg["content"])

# ============================================================================
# 10. CHAT INPUT HANDLING
# ============================================================================

user_input = st.chat_input("Ketik pertanyaanmu di sini... 💬")

if user_input:
    # Display & store user message
    with st.chat_message("user", avatar="🧑"):
        st.markdown(f"**Kamu** · `{get_timestamp()}`")
        st.markdown(user_input)

    st.session_state.messages.append(
        {"role": "user", "content": user_input, "time": get_timestamp()}
    )

    # Generate & display assistant response
    response = find_best_response(user_input)

    with st.chat_message("assistant", avatar="🤖"):
        st.markdown(f"**MinFit** · `{get_timestamp()}`")
        st.markdown(response)

    st.session_state.messages.append(
        {"role": "assistant", "content": response, "time": get_timestamp()}
    )

# ============================================================================
# 11. FOOTER
# ============================================================================

st.markdown(
    '<div class="minfit-footer">'
    "MinFit v1.0 · Fit-Smart Health Consultant · Powered by Streamlit<br>"
    "⚠️ Informasi ini bersifat edukatif. Konsultasikan dengan dokter untuk saran medis profesional."
    "</div>",
    unsafe_allow_html=True,
)
