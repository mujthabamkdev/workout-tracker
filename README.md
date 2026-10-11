# AegisFit 🏋️‍♂️

A fast, client-side only Progressive Web App (PWA) for fitness and diet tracking with a minimalist, non-distracting design.

All data is stored purely in the browser's `localStorage` with **zero backend**, zero telemetry, and offline-first support.

---

## Features

- **Minimalist Design:** Clean, distraction-free neutral dark theme with no flashy animations or gradients.
- **US Navy Body Fat Calculator:** Real-time formula computation based on waist, neck, and height circumferences.
- **AI Plan JSON Sync:** Paste AI-generated workout and diet plans directly without overwriting historical logs.
- **Workout Logging:** Log weights, reps, and RPE per exercise set with previous session reference and demo links.
- **Diet & Macros:** View daily targets, edit meal structures, and log ad-hoc food items with a quick action button.
- **Progress Charts:** Monochromatic charts tracking Body Fat % against your goal benchmark and body weight over time.
- **AI Feedback Loop (Export):** One-click clipboard export of formatted prompts containing your past 14 days of workout progression or 7 days of nutrition intake.
- **Installable PWA:** Full offline capability with Service Worker and Web App Manifest.

---

## AI Plan Schema

The app supports importing structured plans using this format:

```json
{
  "profile": {
    "weight": 76.5,
    "height": 178,
    "neck": 38.5,
    "waist": 83.0,
    "goalBodyFat": 12,
    "bodyType": "Mesomorph",
    "trainingDays": 4
  },
  "workoutPlan": [
    {
      "day": "Day 1",
      "focus": "Upper Clavicular & Posterior Chain",
      "exercises": [
        {
          "name": "Incline Dumbbell Press",
          "sets": 3,
          "reps": "8-10",
          "youtubeLink": "https://youtube.com/shorts/L9UKMQw1Nss"
        }
      ]
    }
  ],
  "dietPlan": {
    "dailyCalories": 2000,
    "macros": { "protein": 120, "fat": 55, "carbs": 250 },
    "meals": [
      {
        "time": "9:00 AM",
        "name": "Breakfast",
        "items": ["3 Whole Eggs", "3 Plain Idlis", "1 Banana", "Black Coffee"]
      }
    ]
  }
}
```

---

## Tech Stack

- **Framework:** React 19 + Vite
- **Styling:** Tailwind CSS v4 (Minimalist zinc palette)
- **Charts:** Chart.js + react-chartjs-2
- **Icons:** Lucide React
- **Storage:** Browser `localStorage`

---

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/mujthabamkdev/workout-tracker.git
cd workout-tracker

# Install dependencies
npm install

# Start development server
npm run dev
```

### Production Build

```bash
npm run build
npm run preview
```

---

## License

MIT
