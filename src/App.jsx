import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Navigation from './components/Navigation';
import WorkoutView from './components/WorkoutView';
import DietView from './components/DietView';
import DailyLogView from './components/DailyLogView';
import ProgressCharts from './components/ProgressCharts';
import ProfileSettings from './components/ProfileSettings';
import JsonManagerModal from './components/JsonManagerModal';
import AiExportModal from './components/AiExportModal';
import LogModal from './components/LogModal';
import { Plus } from 'lucide-react';
import {
  STORAGE_KEYS,
  DEFAULT_PROFILE,
  DEFAULT_WORKOUT_PLAN,
  DEFAULT_DIET_PLAN,
  DEFAULT_MEASUREMENT_LOGS,
  DEFAULT_WORKOUT_LOGS,
  DEFAULT_DIET_LOGS,
  loadFromStorage,
  saveToStorage
} from './utils/storage';

export default function App() {
  const [profile, setProfile] = useState(() =>
    loadFromStorage(STORAGE_KEYS.PROFILE, DEFAULT_PROFILE)
  );

  const [workoutPlan, setWorkoutPlan] = useState(() =>
    loadFromStorage(STORAGE_KEYS.WORKOUT_PLAN, DEFAULT_WORKOUT_PLAN)
  );

  const [dietPlan, setDietPlan] = useState(() =>
    loadFromStorage(STORAGE_KEYS.DIET_PLAN, DEFAULT_DIET_PLAN)
  );

  const [workoutLogs, setWorkoutLogs] = useState(() =>
    loadFromStorage(STORAGE_KEYS.WORKOUT_LOGS, DEFAULT_WORKOUT_LOGS)
  );

  const [measurementLogs, setMeasurementLogs] = useState(() =>
    loadFromStorage(STORAGE_KEYS.MEASUREMENT_LOGS, DEFAULT_MEASUREMENT_LOGS)
  );

  const [dietLogs, setDietLogs] = useState(() =>
    loadFromStorage(STORAGE_KEYS.DIET_LOGS, DEFAULT_DIET_LOGS)
  );

  const [activeTab, setActiveTab] = useState('workout');

  const [isAiExportOpen, setIsAiExportOpen] = useState(false);
  const [isJsonManagerOpen, setIsJsonManagerOpen] = useState(false);
  const [logModalState, setLogModalState] = useState({ isOpen: false, tab: 'diet' });

  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  useEffect(() => {
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstallApp = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      showToast('App installed.');
      setDeferredPrompt(null);
    }
  };

  const handleSaveProfile = (newProfile) => {
    setProfile(newProfile);
    saveToStorage(STORAGE_KEYS.PROFILE, newProfile);
  };

  const handleUpdatePlan = ({ newWorkoutPlan, newDietPlan, newProfile }) => {
    if (newWorkoutPlan) {
      setWorkoutPlan(newWorkoutPlan);
      saveToStorage(STORAGE_KEYS.WORKOUT_PLAN, newWorkoutPlan);
    }
    if (newDietPlan) {
      setDietPlan(newDietPlan);
      saveToStorage(STORAGE_KEYS.DIET_PLAN, newDietPlan);
    }
    if (newProfile) {
      setProfile((prev) => {
        const merged = { ...prev, ...newProfile };
        saveToStorage(STORAGE_KEYS.PROFILE, merged);
        return merged;
      });
    }
  };

  const handleUpdateDietPlanDirect = (newDietPlan) => {
    setDietPlan(newDietPlan);
    saveToStorage(STORAGE_KEYS.DIET_PLAN, newDietPlan);
  };

  const handleSaveWorkoutLog = (date, exerciseName, sets) => {
    const updated = {
      ...workoutLogs,
      [date]: {
        ...(workoutLogs[date] || {}),
        [exerciseName]: sets
      }
    };
    setWorkoutLogs(updated);
    saveToStorage(STORAGE_KEYS.WORKOUT_LOGS, updated);
  };

  const handleAddMeasurementLog = (entry) => {
    const filtered = measurementLogs.filter((m) => m.id !== entry.id);
    const updated = [...filtered, entry];
    setMeasurementLogs(updated);
    saveToStorage(STORAGE_KEYS.MEASUREMENT_LOGS, updated);

    const updatedProfile = {
      ...profile,
      weight: entry.weight,
      neck: entry.neck,
      waist: entry.waist
    };
    setProfile(updatedProfile);
    saveToStorage(STORAGE_KEYS.PROFILE, updatedProfile);
  };

  const handleDeleteMeasurementLog = (id) => {
    const updated = measurementLogs.filter((m) => m.id !== id);
    setMeasurementLogs(updated);
    saveToStorage(STORAGE_KEYS.MEASUREMENT_LOGS, updated);
    showToast('Measurement deleted.');
  };

  const handleAddDietLog = (entry) => {
    const updated = [entry, ...dietLogs];
    setDietLogs(updated);
    saveToStorage(STORAGE_KEYS.DIET_LOGS, updated);
  };

  const handleDeleteDietLog = (id) => {
    const updated = dietLogs.filter((d) => d.id !== id);
    setDietLogs(updated);
    saveToStorage(STORAGE_KEYS.DIET_LOGS, updated);
    showToast('Diet log deleted.');
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 flex flex-col font-sans">
      <Header
        onOpenAiExport={() => setIsAiExportOpen(true)}
        onOpenJsonManager={() => setIsJsonManagerOpen(true)}
        installPrompt={deferredPrompt}
        onInstallApp={handleInstallApp}
        currentStreak={Object.keys(workoutLogs || {}).length}
      />

      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 pt-3 pb-20 md:pb-8">
        {activeTab === 'workout' && (
          <WorkoutView
            workoutPlan={workoutPlan}
            workoutLogs={workoutLogs}
            onSaveWorkoutLog={handleSaveWorkoutLog}
            showToast={showToast}
          />
        )}

        {activeTab === 'diet' && (
          <DietView
            dietPlan={dietPlan}
            dietLogs={dietLogs}
            onUpdateDietPlan={handleUpdateDietPlanDirect}
            onOpenLogModal={(tab) => setLogModalState({ isOpen: true, tab })}
            onDeleteDietLog={handleDeleteDietLog}
            showToast={showToast}
          />
        )}

        {activeTab === 'vitals' && (
          <DailyLogView
            measurementLogs={measurementLogs}
            profile={profile}
            onAddMeasurementLog={handleAddMeasurementLog}
            onDeleteMeasurementLog={handleDeleteMeasurementLog}
            showToast={showToast}
          />
        )}

        {activeTab === 'progress' && (
          <ProgressCharts
            measurementLogs={measurementLogs}
            profile={profile}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileSettings
            profile={profile}
            onSaveProfile={handleSaveProfile}
            onRecordMeasurement={handleAddMeasurementLog}
            showToast={showToast}
          />
        )}
      </main>

      {/* Floating Log Button (+) */}
      <div className="fixed bottom-16 md:bottom-6 right-5 z-40">
        <button
          onClick={() => setLogModalState({ isOpen: true, tab: 'diet' })}
          className="flex items-center justify-center w-11 h-11 rounded-full bg-zinc-100 hover:bg-white text-zinc-950 shadow-md transition-transform active:scale-95"
          title="Log food or vitals"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Minimal Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 transition-all">
          <div className="px-3.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-200 text-xs shadow-lg font-mono">
            {toastMessage}
          </div>
        </div>
      )}

      {/* Modals */}
      <AiExportModal
        isOpen={isAiExportOpen}
        onClose={() => setIsAiExportOpen(false)}
        workoutLogs={workoutLogs}
        dietLogs={dietLogs}
        profile={profile}
        measurementLogs={measurementLogs}
        showToast={showToast}
      />

      <JsonManagerModal
        isOpen={isJsonManagerOpen}
        onClose={() => setIsJsonManagerOpen(false)}
        profile={profile}
        workoutPlan={workoutPlan}
        dietPlan={dietPlan}
        onUpdatePlan={handleUpdatePlan}
        showToast={showToast}
      />

      <LogModal
        isOpen={logModalState.isOpen}
        onClose={() => setLogModalState({ isOpen: false, tab: 'diet' })}
        initialTab={logModalState.tab}
        profile={profile}
        onAddDietLog={handleAddDietLog}
        onAddMeasurementLog={handleAddMeasurementLog}
        showToast={showToast}
      />
    </div>
  );
}
