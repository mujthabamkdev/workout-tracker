import React, { useState } from 'react';
import { Play, Plus, Trash2, Check, History, Calendar, Flame, Activity } from 'lucide-react';
import YouTubeModal from './YouTubeModal';

export default function WorkoutView({
  workoutPlan = [],
  workoutLogs = {},
  onSaveWorkoutLog,
  showToast
}) {
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [selectedDate, setSelectedDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [videoModal, setVideoModal] = useState({ isOpen: false, name: '', url: '' });

  // Interactive tracking of completed warmup & cooldown checklist items
  const [completedWarmups, setCompletedWarmups] = useState({});
  const [completedCooldowns, setCompletedCooldowns] = useState({});

  const currentDay = workoutPlan && workoutPlan.length > 0 ? workoutPlan[selectedDayIndex] : null;

  // Extract warmup & cooldown lists with fallback support
  const rawWarmup = currentDay?.warmup || currentDay?.preWorkout || currentDay?.warmUp || currentDay?.dynamicWarmup || [];
  const warmupList = Array.isArray(rawWarmup) ? rawWarmup : (typeof rawWarmup === 'string' ? [rawWarmup] : []);

  const rawCooldown = currentDay?.cooldown || currentDay?.postWorkout || currentDay?.coolDown || currentDay?.stretching || [];
  const cooldownList = Array.isArray(rawCooldown) ? rawCooldown : (typeof rawCooldown === 'string' ? [rawCooldown] : []);

  const toggleWarmupItem = (index) => {
    const key = `${selectedDate}_${selectedDayIndex}_${index}`;
    setCompletedWarmups(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleCooldownItem = (index) => {
    const key = `${selectedDate}_${selectedDayIndex}_${index}`;
    setCompletedCooldowns(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const getPreviousLogForExercise = (exerciseName) => {
    const dates = Object.keys(workoutLogs || {})
      .filter((d) => d < selectedDate && workoutLogs[d][exerciseName])
      .sort((a, b) => b.localeCompare(a));

    if (dates.length > 0) {
      const prevDate = dates[0];
      return {
        date: prevDate,
        sets: workoutLogs[prevDate][exerciseName]
      };
    }
    return null;
  };

  const getActiveSets = (exerciseName, targetSetsCount) => {
    const dateLogs = workoutLogs[selectedDate] || {};
    if (dateLogs[exerciseName] && Array.isArray(dateLogs[exerciseName])) {
      return dateLogs[exerciseName];
    }

    const count = parseInt(targetSetsCount) || 3;
    return Array.from({ length: count }, (_, idx) => ({
      set: idx + 1,
      weight: '',
      reps: '',
      rpe: '',
      completed: false
    }));
  };

  const handleUpdateSet = (exerciseName, setIndex, field, value, totalSetsCount) => {
    const currentSets = [...getActiveSets(exerciseName, totalSetsCount)];
    currentSets[setIndex] = {
      ...currentSets[setIndex],
      [field]: value
    };
    onSaveWorkoutLog(selectedDate, exerciseName, currentSets);
  };

  const handleAddSet = (exerciseName, totalSetsCount) => {
    const currentSets = [...getActiveSets(exerciseName, totalSetsCount)];
    const lastSet = currentSets[currentSets.length - 1] || {};
    currentSets.push({
      set: currentSets.length + 1,
      weight: lastSet.weight || '',
      reps: lastSet.reps || '',
      rpe: lastSet.rpe || '',
      completed: false
    });
    onSaveWorkoutLog(selectedDate, exerciseName, currentSets);
  };

  const handleRemoveSet = (exerciseName, setIndex, totalSetsCount) => {
    const currentSets = getActiveSets(exerciseName, totalSetsCount).filter((_, idx) => idx !== setIndex);
    const renumbered = currentSets.map((s, idx) => ({ ...s, set: idx + 1 }));
    onSaveWorkoutLog(selectedDate, exerciseName, renumbered);
  };

  const handleToggleComplete = (exerciseName, setIndex, totalSetsCount) => {
    const currentSets = [...getActiveSets(exerciseName, totalSetsCount)];
    const isCompleted = !currentSets[setIndex]?.completed;
    currentSets[setIndex] = {
      ...currentSets[setIndex],
      completed: isCompleted
    };
    onSaveWorkoutLog(selectedDate, exerciseName, currentSets);
  };

  if (!workoutPlan || workoutPlan.length === 0) {
    return (
      <div className="max-w-2xl mx-auto p-8 text-center border border-zinc-900 rounded-xl my-6">
        <p className="text-sm text-zinc-400">No workout plan found. Paste your AI plan JSON to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-24 md:pb-12 max-w-6xl mx-auto">
      {/* Top Controls: Day selector & Date picker */}
      <div className="border border-zinc-200 dark:border-zinc-900 bg-white dark:bg-zinc-900/30 rounded-xl p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200 dark:border-zinc-900">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Workout Session
            </span>
            <h2 className="text-lg sm:text-xl font-semibold text-zinc-900 dark:text-zinc-100">
              {currentDay?.day || `Day ${selectedDayIndex + 1}`}: {currentDay?.focus || 'Routine'}
            </h2>
          </div>

          {/* Session Date */}
          <div className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-900/80 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-xs self-start sm:self-auto">
            <span className="text-zinc-500">Date:</span>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent text-zinc-800 dark:text-zinc-200 outline-none cursor-pointer"
            />
          </div>
        </div>

        {/* Day selection tabs */}
        <div className="flex gap-2 overflow-x-auto pt-3 pb-0.5 scrollbar-none">
          {workoutPlan.map((day, idx) => {
            const isSelected = selectedDayIndex === idx;
            return (
              <button
                key={idx}
                onClick={() => setSelectedDayIndex(idx)}
                className={`flex-shrink-0 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  isSelected
                    ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                    : 'bg-zinc-100 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200 dark:hover:bg-zinc-800'
                }`}
              >
                {day.day || `Day ${idx + 1}`}
              </button>
            );
          })}
        </div>
      </div>

      {/* Pre-Workout Warm-up & Dynamic Stretching */}
      {warmupList.length > 0 && (
        <div className="border border-zinc-200 dark:border-zinc-900 bg-white dark:bg-zinc-900/30 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-200 dark:border-zinc-900">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
              <div>
                <h3 className="text-xs sm:text-sm font-semibold text-zinc-900 dark:text-zinc-200">
                  Pre-Workout Warm-up & Dynamic Stretching
                </h3>
                <p className="text-[11px] text-zinc-500">
                  Elevate heart rate, lubricate joints & prep movement patterns
                </p>
              </div>
            </div>
            <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500">
              {warmupList.filter((_, idx) => completedWarmups[`${selectedDate}_${selectedDayIndex}_${idx}`]).length}/{warmupList.length} Done
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            {warmupList.map((item, idx) => {
              const isDone = !!completedWarmups[`${selectedDate}_${selectedDayIndex}_${idx}`];
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => toggleWarmupItem(idx)}
                  className={`flex items-start gap-2.5 p-2.5 rounded-lg border text-left transition-colors text-xs ${
                    isDone
                      ? 'bg-zinc-100 dark:bg-zinc-900/60 border-zinc-200 dark:border-zinc-800 text-zinc-400 dark:text-zinc-500 line-through'
                      : 'bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-900/20 border-zinc-200 dark:border-zinc-900 dark:hover:border-zinc-800 text-zinc-800 dark:text-zinc-300'
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center shrink-0 border transition-colors ${
                      isDone
                        ? 'bg-zinc-900 border-zinc-900 text-white dark:bg-zinc-100 dark:border-zinc-100 dark:text-zinc-950'
                        : 'border-zinc-300 dark:border-zinc-800 text-transparent'
                    }`}
                  >
                    <Check className="w-3 h-3" />
                  </span>
                  <span className="leading-snug">{item}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Exercises List */}
      <div className="space-y-4">
        {currentDay?.exercises?.map((exercise, exIdx) => {
          const sets = getActiveSets(exercise.name, exercise.sets);
          const prevLog = getPreviousLogForExercise(exercise.name);

          return (
            <div
              key={exIdx}
              className="border border-zinc-200 dark:border-zinc-900 bg-white dark:bg-zinc-900/20 rounded-xl overflow-hidden shadow-xs"
            >
              {/* Exercise Header */}
              <div className="p-4 border-b border-zinc-200 dark:border-zinc-900 flex flex-wrap items-center justify-between gap-3 bg-zinc-50/70 dark:bg-zinc-900/40">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-zinc-400 dark:text-zinc-500">0{exIdx + 1}</span>
                    <h3 className="font-semibold text-sm sm:text-base text-zinc-900 dark:text-zinc-100">
                      {exercise.name}
                    </h3>
                  </div>

                  {/* Below workout name: Form execution cue */}
                  {exercise.form && (
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 pl-6 leading-relaxed">
                      <span className="text-zinc-400 dark:text-zinc-500 font-mono text-[10px] uppercase tracking-wider mr-1.5">Form:</span>
                      {exercise.form}
                    </p>
                  )}

                  {/* Right to reps: Sets, Reps, and Tempo / Pause speed */}
                  <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 pl-6 pt-0.5">
                    <span>{exercise.sets} Sets</span>
                    <span>•</span>
                    <span>{exercise.reps} Reps</span>
                    {(exercise.tempo || exercise.pause || exercise.speed) && (
                      <>
                        <span>•</span>
                        <span className="font-mono text-[11px] text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-900/90 px-1.5 py-0.5 rounded border border-zinc-200 dark:border-zinc-800">
                          {exercise.tempo ? `Tempo: ${exercise.tempo}` : ''}
                          {exercise.speed && !exercise.tempo ? `Speed: ${exercise.speed}` : ''}
                          {exercise.pause ? ` | Pause: ${exercise.pause}` : ''}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Video Demo Button */}
                {exercise.youtubeLink && (
                  <button
                    onClick={() =>
                      setVideoModal({
                        isOpen: true,
                        name: exercise.name,
                        url: exercise.youtubeLink
                      })
                    }
                    className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-lg transition"
                  >
                    <Play className="w-3 h-3 text-zinc-500 dark:text-zinc-400" />
                    <span>Demo</span>
                  </button>
                )}
              </div>

              {/* Exercise Warm-up Protocol */}
              {(exercise.warmupSets || exercise.warmup) && (
                <div className="px-4 py-2 bg-zinc-50/50 dark:bg-zinc-950/70 border-b border-zinc-200 dark:border-zinc-900 flex items-start gap-2 text-xs text-zinc-600 dark:text-zinc-400">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 dark:text-zinc-500 shrink-0 mt-0.5">
                    Warm-up:
                  </span>
                  <span className="leading-relaxed text-zinc-800 dark:text-zinc-300 font-mono text-[11px]">
                    {exercise.warmupSets || exercise.warmup}
                  </span>
                </div>
              )}

              {/* Previous session stats banner */}
              {prevLog && (
                <div className="px-4 py-2 bg-zinc-50/30 dark:bg-zinc-950/60 border-b border-zinc-200 dark:border-zinc-900 flex items-center gap-2 text-xs text-zinc-500 font-mono">
                  <History className="w-3 h-3 text-zinc-400 dark:text-zinc-500 shrink-0" />
                  <span>
                    Last ({prevLog.date}):{' '}
                    {prevLog.sets.map((s) => `${s.weight || 0}kg×${s.reps || 0}`).join('  ')}
                  </span>
                </div>
              )}

              {/* Logging Table */}
              <div className="p-3 sm:p-4 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="text-zinc-400 dark:text-zinc-500 border-b border-zinc-200 dark:border-zinc-900 text-[10px] uppercase font-mono tracking-wider">
                      <th className="py-2 px-2 text-center w-10">Set</th>
                      <th className="py-2 px-2 text-center w-28">Weight (kg)</th>
                      <th className="py-2 px-2 text-center w-24">Reps</th>
                      <th className="py-2 px-2 text-center w-20">RPE</th>
                      <th className="py-2 px-2 text-center w-14">Done</th>
                      <th className="py-2 px-1 text-center w-8"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-900/60">
                    {sets.map((setObj, setIdx) => (
                      <tr
                        key={setIdx}
                        className={setObj.completed ? 'bg-zinc-100/50 dark:bg-zinc-900/30' : ''}
                      >
                        <td className="py-2 px-2 text-center text-zinc-400 dark:text-zinc-500 font-mono text-xs">
                          {setObj.set || setIdx + 1}
                        </td>

                        <td className="py-2 px-2 text-center">
                          <input
                            type="number"
                            step="0.5"
                            placeholder="kg"
                            value={setObj.weight ?? ''}
                            onChange={(e) =>
                              handleUpdateSet(exercise.name, setIdx, 'weight', e.target.value, exercise.sets)
                            }
                            className="w-full max-w-[100px] bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-md px-2.5 py-1.5 text-center text-zinc-900 dark:text-zinc-100 text-xs outline-none focus:border-zinc-400 dark:focus:border-zinc-500"
                          />
                        </td>

                        <td className="py-2 px-2 text-center">
                          <input
                            type="number"
                            placeholder={exercise.reps || 'reps'}
                            value={setObj.reps ?? ''}
                            onChange={(e) =>
                              handleUpdateSet(exercise.name, setIdx, 'reps', e.target.value, exercise.sets)
                            }
                            className="w-full max-w-[80px] bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-md px-2.5 py-1.5 text-center text-zinc-900 dark:text-zinc-100 text-xs outline-none focus:border-zinc-400 dark:focus:border-zinc-500"
                          />
                        </td>

                        <td className="py-2 px-2 text-center">
                          <input
                            type="number"
                            step="0.5"
                            min="1"
                            max="10"
                            placeholder="1-10"
                            value={setObj.rpe ?? ''}
                            onChange={(e) =>
                              handleUpdateSet(exercise.name, setIdx, 'rpe', e.target.value, exercise.sets)
                            }
                            className="w-full max-w-[65px] bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-md px-2 py-1.5 text-center text-zinc-900 dark:text-zinc-100 text-xs outline-none focus:border-zinc-400 dark:focus:border-zinc-500"
                          />
                        </td>

                        <td className="py-2 px-2 text-center">
                          <button
                            type="button"
                            onClick={() => handleToggleComplete(exercise.name, setIdx, exercise.sets)}
                            className={`w-7 h-7 inline-flex items-center justify-center rounded-md border transition-colors ${
                              setObj.completed
                                ? 'bg-zinc-900 text-white border-zinc-900 dark:bg-zinc-100 dark:text-zinc-950 dark:border-zinc-100'
                                : 'bg-zinc-100 border-zinc-200 text-zinc-400 hover:text-zinc-700 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-600 dark:hover:text-zinc-300'
                            }`}
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        </td>

                        <td className="py-2 px-1 text-center">
                          {sets.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveSet(exercise.name, setIdx, exercise.sets)}
                              className="p-1 text-zinc-400 hover:text-zinc-700 dark:text-zinc-600 dark:hover:text-zinc-300 transition"
                              title="Delete set"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Add Set */}
                <div className="pt-3 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => handleAddSet(exercise.name, exercise.sets)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 rounded-md text-xs transition"
                  >
                    <Plus className="w-3 h-3 text-zinc-500 dark:text-zinc-400" />
                    <span>Add Set</span>
                  </button>

                  <span className="text-[11px] text-zinc-400 dark:text-zinc-600 font-mono">
                    auto-saved
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Post-Workout Cool-Down & Static Stretching */}
      {cooldownList.length > 0 && (
        <div className="border border-zinc-200 dark:border-zinc-900 bg-white dark:bg-zinc-900/30 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-200 dark:border-zinc-900">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
              <div>
                <h3 className="text-xs sm:text-sm font-semibold text-zinc-900 dark:text-zinc-200">
                  Post-Workout Cool-Down & Static Stretching
                </h3>
                <p className="text-[11px] text-zinc-500">
                  Down-regulate nervous system, release tightness & aid muscle recovery
                </p>
              </div>
            </div>
            <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500">
              {cooldownList.filter((_, idx) => completedCooldowns[`${selectedDate}_${selectedDayIndex}_${idx}`]).length}/{cooldownList.length} Done
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            {cooldownList.map((item, idx) => {
              const isDone = !!completedCooldowns[`${selectedDate}_${selectedDayIndex}_${idx}`];
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => toggleCooldownItem(idx)}
                  className={`flex items-start gap-2.5 p-2.5 rounded-lg border text-left transition-colors text-xs ${
                    isDone
                      ? 'bg-zinc-100 dark:bg-zinc-900/60 border-zinc-200 dark:border-zinc-800 text-zinc-400 dark:text-zinc-500 line-through'
                      : 'bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-900/20 border-zinc-200 dark:border-zinc-900 dark:hover:border-zinc-800 text-zinc-800 dark:text-zinc-300'
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center shrink-0 border transition-colors ${
                      isDone
                        ? 'bg-zinc-900 border-zinc-900 text-white dark:bg-zinc-100 dark:border-zinc-100 dark:text-zinc-950'
                        : 'border-zinc-300 dark:border-zinc-800 text-transparent'
                    }`}
                  >
                    <Check className="w-3 h-3" />
                  </span>
                  <span className="leading-snug">{item}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <YouTubeModal
        isOpen={videoModal.isOpen}
        onClose={() => setVideoModal({ isOpen: false, name: '', url: '' })}
        exerciseName={videoModal.name}
        youtubeLink={videoModal.url}
      />
    </div>
  );
}
