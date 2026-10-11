// Storage keys
export const STORAGE_KEYS = {
  PROFILE: 'aegisfit_profile',
  WORKOUT_PLAN: 'aegisfit_workout_plan',
  DIET_PLAN: 'aegisfit_diet_plan',
  WORKOUT_LOGS: 'aegisfit_workout_logs',
  MEASUREMENT_LOGS: 'aegisfit_measurement_logs',
  DIET_LOGS: 'aegisfit_diet_logs',
};

// Initial default blank profile (no personal data)
export const DEFAULT_PROFILE = {
  weight: '',
  height: '',
  neck: '',
  waist: '',
  goalBodyFat: '',
  bodyType: 'Mesomorph',
  trainingDays: 4,
};

// Initial workout plan template matching required JSON structure
export const DEFAULT_WORKOUT_PLAN = [
  {
    day: "Day 1",
    focus: "Upper Clavicular & Posterior Chain",
    exercises: [
      {
        name: "Incline Dumbbell Press",
        sets: 3,
        reps: "8-10",
        youtubeLink: "https://youtube.com/shorts/L9UKMQw1Nss?si=nNqGHraxdi2A4IIk"
      },
      {
        name: "Chest-Supported Row",
        sets: 3,
        reps: "10-12",
        youtubeLink: "https://www.youtube.com/watch?v=0UBRfiO4zDs"
      },
      {
        name: "Overhead Cable Triceps Extension",
        sets: 3,
        reps: "12-15",
        youtubeLink: "https://www.youtube.com/watch?v=1u18yJQL_c8"
      },
      {
        name: "Incline Dumbbell Bicep Curl",
        sets: 3,
        reps: "10-12",
        youtubeLink: "https://www.youtube.com/watch?v=soxrZlIl35U"
      }
    ]
  },
  {
    day: "Day 2",
    focus: "Lower Anterior & Core Stability",
    exercises: [
      {
        name: "Barbell Romanian Deadlift",
        sets: 4,
        reps: "8-10",
        youtubeLink: "https://www.youtube.com/watch?v=JCXUYuzwNrM"
      },
      {
        name: "Bulgarian Split Squat",
        sets: 3,
        reps: "10-12",
        youtubeLink: "https://www.youtube.com/watch?v=2C-uNgKwPLE"
      },
      {
        name: "Standing Calf Raise",
        sets: 4,
        reps: "12-15",
        youtubeLink: "https://www.youtube.com/watch?v=YMmgqO8Jo-k"
      },
      {
        name: "Hanging Leg Raise",
        sets: 3,
        reps: "12-15",
        youtubeLink: "https://www.youtube.com/watch?v=hdng3Nm1x_E"
      }
    ]
  }
];

// Initial diet plan template matching required JSON structure
export const DEFAULT_DIET_PLAN = {
  dailyCalories: 2000,
  macros: { protein: 120, fat: 55, carbs: 250 },
  meals: [
    {
      time: "9:00 AM",
      name: "Breakfast",
      items: ["3 Whole Eggs", "3 Plain Idlis", "1 Medium Banana", "Black Coffee"]
    },
    {
      time: "1:30 PM",
      name: "Lunch",
      items: ["150g Grilled Chicken Breast", "1.5 Cup Steamed Basmati Rice", "Mixed Green Salad"]
    }
  ]
};

// Initial logs: empty by default with zero personal data
export const DEFAULT_MEASUREMENT_LOGS = [];
export const DEFAULT_WORKOUT_LOGS = {};
export const DEFAULT_DIET_LOGS = [];

// Helper: Calculate Body Fat % using US Navy formula (men)
// %BF = 495 / (1.0324 - 0.19077 * log10(waist - neck) + 0.15456 * log10(height)) - 450
export function calculateBodyFat(waist, neck, height) {
  const w = parseFloat(waist);
  const n = parseFloat(neck);
  const h = parseFloat(height);

  if (isNaN(w) || isNaN(n) || isNaN(h)) return null;
  if (w <= n || h <= 0) return null;

  try {
    const waistMinusNeck = w - n;
    const logWaistNeck = Math.log10(waistMinusNeck);
    const logHeight = Math.log10(h);

    const denominator = 1.0324 - 0.19077 * logWaistNeck + 0.15456 * logHeight;
    if (denominator <= 0) return null;

    const bf = 495 / denominator - 450;
    if (isNaN(bf) || bf < 3 || bf > 60) return null;
    return parseFloat(bf.toFixed(1));
  } catch {
    return null;
  }
}

// LocalStorage helpers with automatic JSON parsing
export function loadFromStorage(key, defaultValue) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(defaultValue));
      return defaultValue;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Error loading ${key} from storage:`, err);
    return defaultValue;
  }
}

export function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Error saving ${key} to storage:`, err);
  }
}

// Convert any YouTube link (shorts, watch, youtu.be) to embed format
export function getYouTubeEmbedUrl(url) {
  if (!url) return null;
  try {
    const shortsMatch = url.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/);
    if (shortsMatch && shortsMatch[1]) {
      return `https://www.youtube.com/embed/${shortsMatch[1]}`;
    }

    const watchMatch = url.match(/[?&]v=([a-zA-Z0-9_-]+)/);
    if (watchMatch && watchMatch[1]) {
      return `https://www.youtube.com/embed/${watchMatch[1]}`;
    }

    const beMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
    if (beMatch && beMatch[1]) {
      return `https://www.youtube.com/embed/${beMatch[1]}`;
    }

    return null;
  } catch {
    return null;
  }
}

// Export AI Prompt 1: Workout Progression
export function generateWorkoutAIExportPrompt(workoutLogs, profile, measurementLogs) {
  const today = new Date();
  const twoWeeksAgo = new Date();
  twoWeeksAgo.setDate(today.getDate() - 14);
  const cutoffDate = twoWeeksAgo.toISOString().split('T')[0];

  const recentWorkoutEntries = Object.entries(workoutLogs || {})
    .filter(([date]) => date >= cutoffDate)
    .sort(([a], [b]) => a.localeCompare(b));

  let workoutDump = "";
  if (recentWorkoutEntries.length === 0) {
    const allEntries = Object.entries(workoutLogs || {}).sort(([a], [b]) => a.localeCompare(b));
    if (allEntries.length === 0) {
      workoutDump = "No workout logs recorded yet.";
    } else {
      workoutDump = JSON.stringify(allEntries, null, 2);
    }
  } else {
    workoutDump = recentWorkoutEntries.map(([date, exercises]) => {
      const exerciseDetails = Object.entries(exercises).map(([exName, sets]) => {
        const setsText = sets.map(s => `Set ${s.set}: ${s.weight}kg x ${s.reps} reps (RPE ${s.rpe || 'N/A'})`).join(', ');
        return `  • ${exName}: ${setsText}`;
      }).join('\n');
      return `[Date: ${date}]\n${exerciseDetails}`;
    }).join('\n\n');
  }

  let currentWeight = profile?.weight || "N/A";
  let currentBF = calculateBodyFat(profile?.waist, profile?.neck, profile?.height);

  if (!currentBF && measurementLogs && measurementLogs.length > 0) {
    const latestMeasurement = measurementLogs[measurementLogs.length - 1];
    currentBF = latestMeasurement.bodyFat;
    if (!currentWeight || currentWeight === "N/A") {
      currentWeight = latestMeasurement.weight;
    }
  }

  const weightStr = currentWeight && currentWeight !== "N/A" ? `${currentWeight} kg` : "[Weight not set]";
  const bfStr = currentBF ? `${currentBF}` : "[Body Fat % not calculated]";

  return `Act as my fitness coach. Here is my workout log for the past 2 weeks:\n\n${workoutDump}\n\nMy current weight is ${weightStr} and body fat is ${bfStr}%. Provide feedback on my progressive overload and generate a NEW updated JSON for the next 4 weeks using the exact schema I provided previously.`;
}

// Export AI Prompt 2: Diet Log
export function generateDietAIExportPrompt(dietLogs, profile, measurementLogs) {
  const today = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(today.getDate() - 7);
  const cutoffDate = sevenDaysAgo.toISOString().split('T')[0];

  const recentDietLogs = (dietLogs || [])
    .filter(log => log.date >= cutoffDate)
    .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));

  let dietDump = "";
  if (recentDietLogs.length === 0) {
    const allLogs = (dietLogs || []).slice(-15);
    if (allLogs.length === 0) {
      dietDump = "No diet logs recorded in the past 7 days.";
    } else {
      dietDump = allLogs.map(l => `[${l.date} ${l.time}] ${l.foodName} (${l.quantity})`).join('\n');
    }
  } else {
    const grouped = {};
    recentDietLogs.forEach(item => {
      if (!grouped[item.date]) grouped[item.date] = [];
      grouped[item.date].push(item);
    });

    dietDump = Object.entries(grouped).map(([date, items]) => {
      const itemsList = items.map(i => `  • [${i.time}] ${i.foodName} - ${i.quantity}`).join('\n');
      return `[Date: ${date}]\n${itemsList}`;
    }).join('\n\n');
  }

  let weightA = "N/A";
  let weightB = profile?.weight ? `${profile.weight} kg` : "N/A";

  if (measurementLogs && measurementLogs.length > 0) {
    const sorted = [...measurementLogs].sort((a, b) => a.date.localeCompare(b.date));
    const latest = sorted[sorted.length - 1];
    weightB = `${latest.weight} kg`;

    if (sorted.length > 1) {
      const older = sorted.find(m => m.date >= cutoffDate) || sorted[0];
      weightA = `${older.weight} kg`;
    } else {
      weightA = `${latest.weight} kg`;
    }
  }

  return `Act as my nutrition coach. Here is exactly what I ate over the last 7 days:\n\n${dietDump}\n\nMy weight changed from ${weightA} to ${weightB}. Suggest adjustments to my macros and provide a NEW updated diet JSON using the exact schema.`;
}
