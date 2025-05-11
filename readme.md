# 🌍 Globetrotter – The Ultimate Travel Guessing Game!

Globetrotter is a full-stack web application where users get cryptic clues about a famous destination and must guess it. It’s fun, fast, and packed with surprises — perfect to test your world knowledge!

---

## 🚀 Features

- 🔍 **AI-Enhanced Dataset**: 100+ global destinations generated via AI tools and stored in db.
- 🧠 **Clue-Based Gameplay**: 1–2 cryptic clues + 4 options per question.
- ✅ **Feedback & Fun Facts**: Instant funky feedback with confetti/sad animation + trivia.
- 🧮 **Score Tracker**: Real-time correct/total answers with percentage.
- 🔁 **Play Again**: Easily try a new destination instantly.
- 🔁 **Leaderboard**: list of user and their score.
- 🤝 **Challenge a Friend**:
  - User enters a unique username before playing.
  - Generates a challenge link with token.
  - Opens WhatsApp to share with image + link.
  - Bonus: Generates dynamic image using `html2canvas`.

---

## 🛠️ Tech Stack

### Frontend
- **React.js** with Vite
- **Tailwind CSS** + Shadcn UI
- **Lucide Icons**, `html2canvas` for screenshot capture
- Deployed via **Vercel**

### Backend
- **Express.js** with Node.js
- **prisma** 
- database **postgresql** 
- Deployed via **Railway**

---

## ⚙️ Getting Started

### Clone the repo

```bash
git clone https://github.com/your-username/globetrotter.git
cd globetrotter
```

### Frontend Setup

```bash
cd globe-client
npm i
npm run dev
```
the frontend will be on http://localhost:8080

### Backend Setup

```bash
cd globe-backend
npx prisma migrate
npm run dev
```

the Backend will be on http://localhost:4000