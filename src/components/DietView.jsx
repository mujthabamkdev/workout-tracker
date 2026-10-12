import React, { useState } from 'react';
import { Utensils, Edit3, Plus, Trash2, Check, Clock } from 'lucide-react';

export default function DietView({
  dietPlan,
  dietLogs = [],
  onUpdateDietPlan,
  onOpenLogModal,
  onDeleteDietLog,
  showToast
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedPlan, setEditedPlan] = useState(dietPlan);
  const [selectedLogDate, setSelectedLogDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });

  React.useEffect(() => {
    setEditedPlan(dietPlan);
  }, [dietPlan]);

  const calories = dietPlan?.dailyCalories || 0;
  const protein = dietPlan?.macros?.protein || 0;
  const fat = dietPlan?.macros?.fat || 0;
  const carbs = dietPlan?.macros?.carbs || 0;

  const pCal = protein * 4;
  const fCal = fat * 9;
  const cCal = carbs * 4;
  const totalMacroCal = pCal + fCal + cCal || 1;
  const pPct = Math.round((pCal / totalMacroCal) * 100);
  const fPct = Math.round((fCal / totalMacroCal) * 100);
  const cPct = Math.round((cCal / totalMacroCal) * 100);

  const dateLogs = (dietLogs || []).filter((log) => log.date === selectedLogDate);

  const handleSaveEdit = () => {
    onUpdateDietPlan(editedPlan);
    setIsEditing(false);
    showToast('Diet plan updated.');
  };

  const handleAddMeal = () => {
    const updatedMeals = [
      ...(editedPlan?.meals || []),
      {
        time: '12:00 PM',
        name: 'New Meal',
        items: ['1 portion food item']
      }
    ];
    setEditedPlan({ ...editedPlan, meals: updatedMeals });
  };

  const handleRemoveMeal = (mealIndex) => {
    const updatedMeals = editedPlan.meals.filter((_, idx) => idx !== mealIndex);
    setEditedPlan({ ...editedPlan, meals: updatedMeals });
  };

  const handleUpdateMealField = (mealIndex, field, value) => {
    const updatedMeals = [...editedPlan.meals];
    updatedMeals[mealIndex] = {
      ...updatedMeals[mealIndex],
      [field]: value
    };
    setEditedPlan({ ...editedPlan, meals: updatedMeals });
  };

  const handleAddItemToMeal = (mealIndex) => {
    const updatedMeals = [...editedPlan.meals];
    updatedMeals[mealIndex].items = [...(updatedMeals[mealIndex].items || []), 'New item'];
    setEditedPlan({ ...editedPlan, meals: updatedMeals });
  };

  const handleUpdateMealItem = (mealIndex, itemIndex, value) => {
    const updatedMeals = [...editedPlan.meals];
    const items = [...updatedMeals[mealIndex].items];
    items[itemIndex] = value;
    updatedMeals[mealIndex].items = items;
    setEditedPlan({ ...editedPlan, meals: updatedMeals });
  };

  const handleRemoveMealItem = (mealIndex, itemIndex) => {
    const updatedMeals = [...editedPlan.meals];
    updatedMeals[mealIndex].items = updatedMeals[mealIndex].items.filter((_, idx) => idx !== itemIndex);
    setEditedPlan({ ...editedPlan, meals: updatedMeals });
  };

  return (
    <div className="space-y-5 pb-24 md:pb-12 max-w-6xl mx-auto">
      {/* Target Macros Overview */}
      <div className="border border-zinc-200 dark:border-zinc-900 bg-white dark:bg-zinc-900/30 rounded-xl p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200 dark:border-zinc-900">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Nutrition Targets
            </span>
            <h2 className="text-lg sm:text-xl font-semibold text-zinc-900 dark:text-zinc-100">
              Daily Target Architecture
            </h2>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {isEditing ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1.5 bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-medium rounded-lg text-xs transition"
                >
                  <Check className="w-3.5 h-3.5" /> Save
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs transition"
              >
                <Edit3 className="w-3.5 h-3.5" /> Edit Diet
              </button>
            )}
          </div>
        </div>

        {isEditing ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
            <div className="bg-zinc-50 dark:bg-zinc-900/60 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800">
              <label className="text-[11px] text-zinc-500 dark:text-zinc-400 block mb-1">Calories (kcal)</label>
              <input
                type="number"
                value={editedPlan?.dailyCalories || ''}
                onChange={(e) =>
                  setEditedPlan({ ...editedPlan, dailyCalories: parseInt(e.target.value) || 0 })
                }
                className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded px-2.5 py-1 text-sm font-semibold text-zinc-900 dark:text-white outline-none focus:border-zinc-400 dark:focus:border-zinc-500"
              />
            </div>
            <div className="bg-zinc-50 dark:bg-zinc-900/60 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800">
              <label className="text-[11px] text-zinc-500 dark:text-zinc-400 block mb-1">Protein (g)</label>
              <input
                type="number"
                value={editedPlan?.macros?.protein || ''}
                onChange={(e) =>
                  setEditedPlan({
                    ...editedPlan,
                    macros: { ...editedPlan.macros, protein: parseInt(e.target.value) || 0 }
                  })
                }
                className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded px-2.5 py-1 text-sm font-semibold text-zinc-900 dark:text-white outline-none focus:border-zinc-400 dark:focus:border-zinc-500"
              />
            </div>
            <div className="bg-zinc-50 dark:bg-zinc-900/60 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800">
              <label className="text-[11px] text-zinc-500 dark:text-zinc-400 block mb-1">Fats (g)</label>
              <input
                type="number"
                value={editedPlan?.macros?.fat || ''}
                onChange={(e) =>
                  setEditedPlan({
                    ...editedPlan,
                    macros: { ...editedPlan.macros, fat: parseInt(e.target.value) || 0 }
                  })
                }
                className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded px-2.5 py-1 text-sm font-semibold text-zinc-900 dark:text-white outline-none focus:border-zinc-400 dark:focus:border-zinc-500"
              />
            </div>
            <div className="bg-zinc-50 dark:bg-zinc-900/60 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800">
              <label className="text-[11px] text-zinc-500 dark:text-zinc-400 block mb-1">Carbs (g)</label>
              <input
                type="number"
                value={editedPlan?.macros?.carbs || ''}
                onChange={(e) =>
                  setEditedPlan({
                    ...editedPlan,
                    macros: { ...editedPlan.macros, carbs: parseInt(e.target.value) || 0 }
                  })
                }
                className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded px-2.5 py-1 text-sm font-semibold text-zinc-900 dark:text-white outline-none focus:border-zinc-400 dark:focus:border-zinc-500"
              />
            </div>
          </div>
        ) : (
          <div className="pt-4 space-y-3">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-zinc-50 dark:bg-zinc-900/40 p-3.5 rounded-lg border border-zinc-200 dark:border-zinc-900">
                <span className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase font-mono">Calories</span>
                <div className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mt-1">
                  {calories} <span className="text-xs text-zinc-400 dark:text-zinc-500 font-normal">kcal</span>
                </div>
              </div>
              <div className="bg-zinc-50 dark:bg-zinc-900/40 p-3.5 rounded-lg border border-zinc-200 dark:border-zinc-900">
                <span className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase font-mono">Protein</span>
                <div className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mt-1">
                  {protein}g <span className="text-xs text-zinc-400 dark:text-zinc-500 font-normal">({pPct}%)</span>
                </div>
              </div>
              <div className="bg-zinc-50 dark:bg-zinc-900/40 p-3.5 rounded-lg border border-zinc-200 dark:border-zinc-900">
                <span className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase font-mono">Fats</span>
                <div className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mt-1">
                  {fat}g <span className="text-xs text-zinc-400 dark:text-zinc-500 font-normal">({fPct}%)</span>
                </div>
              </div>
              <div className="bg-zinc-50 dark:bg-zinc-900/40 p-3.5 rounded-lg border border-zinc-200 dark:border-zinc-900">
                <span className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase font-mono">Carbs</span>
                <div className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mt-1">
                  {carbs}g <span className="text-xs text-zinc-400 dark:text-zinc-500 font-normal">({cPct}%)</span>
                </div>
              </div>
            </div>

            {/* Clean segmented progress */}
            <div className="h-1.5 w-full bg-zinc-200 dark:bg-zinc-900 rounded-full overflow-hidden flex">
              <div style={{ width: `${pPct}%` }} className="bg-zinc-800 dark:bg-zinc-300 h-full" title={`Protein: ${pPct}%`} />
              <div style={{ width: `${fPct}%` }} className="bg-zinc-500 dark:bg-zinc-500 h-full" title={`Fat: ${fPct}%`} />
              <div style={{ width: `${cPct}%` }} className="bg-zinc-300 dark:bg-zinc-700 h-full" title={`Carbs: ${cPct}%`} />
            </div>
            <div className="flex items-center justify-between text-[11px] text-zinc-500 font-mono">
              <span>P: {protein}g ({pPct}%)</span>
              <span>F: {fat}g ({fPct}%)</span>
              <span>C: {carbs}g ({cPct}%)</span>
            </div>
          </div>
        )}
      </div>

      {/* Planned Meals Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-200">
            Planned Meals ({editedPlan?.meals?.length || 0})
          </h3>
          {isEditing && (
            <button
              onClick={handleAddMeal}
              className="flex items-center gap-1 px-2.5 py-1 text-xs text-zinc-700 dark:text-zinc-300 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg dark:hover:bg-zinc-800 transition"
            >
              <Plus className="w-3 h-3 text-zinc-500 dark:text-zinc-400" /> Add Meal
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {editedPlan?.meals?.map((meal, mealIdx) => (
            <div
              key={mealIdx}
              className="border border-zinc-200 dark:border-zinc-900 bg-white dark:bg-zinc-900/20 rounded-xl p-4 space-y-3 shadow-xs"
            >
              {isEditing ? (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <input
                      type="text"
                      value={meal.name}
                      onChange={(e) => handleUpdateMealField(mealIdx, 'name', e.target.value)}
                      placeholder="Meal Name"
                      className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-2.5 py-1 text-xs font-semibold text-zinc-900 dark:text-white outline-none flex-1 focus:border-zinc-400 dark:focus:border-zinc-500"
                    />
                    <input
                      type="text"
                      value={meal.time}
                      onChange={(e) => handleUpdateMealField(mealIdx, 'time', e.target.value)}
                      placeholder="Time"
                      className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-2.5 py-1 text-xs text-zinc-800 dark:text-zinc-300 outline-none w-24 text-center focus:border-zinc-400 dark:focus:border-zinc-500"
                    />
                    <button
                      onClick={() => handleRemoveMeal(mealIdx)}
                      className="p-1 text-zinc-400 hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-300 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    {meal.items?.map((item, itemIdx) => (
                      <div key={itemIdx} className="flex items-center gap-1.5">
                        <input
                          type="text"
                          value={item}
                          onChange={(e) => handleUpdateMealItem(mealIdx, itemIdx, e.target.value)}
                          className="flex-1 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded px-2.5 py-1 text-xs text-zinc-800 dark:text-zinc-300 outline-none focus:border-zinc-400 dark:focus:border-zinc-500"
                        />
                        <button
                          onClick={() => handleRemoveMealItem(mealIdx, itemIdx)}
                          className="p-1 text-zinc-400 hover:text-zinc-700 dark:text-zinc-600 dark:hover:text-zinc-300"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => handleAddItemToMeal(mealIdx)}
                      className="text-xs text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200 flex items-center gap-1 pt-0.5"
                    >
                      <Plus className="w-3 h-3" /> Add item
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-900 pb-2.5">
                    <h4 className="font-medium text-zinc-900 dark:text-zinc-200 text-sm">{meal.name}</h4>
                    <span className="text-[11px] text-zinc-400 dark:text-zinc-500 font-mono">
                      {meal.time}
                    </span>
                  </div>

                  <ul className="space-y-1.5 text-xs text-zinc-600 dark:text-zinc-400">
                    {meal.items?.map((item, itemIdx) => (
                      <li key={itemIdx} className="flex items-start gap-2">
                        <span className="text-zinc-400 dark:text-zinc-600 text-xs">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Actual Food Intake Logs */}
      <div className="border border-zinc-200 dark:border-zinc-900 bg-white dark:bg-zinc-900/30 rounded-xl p-4 sm:p-5 space-y-3 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-200 dark:border-zinc-900">
          <div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-200">
              Logged Food Intake
            </h3>
            <p className="text-xs text-zinc-500">Real items logged via floating + button</p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="date"
              value={selectedLogDate}
              onChange={(e) => setSelectedLogDate(e.target.value)}
              className="bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-2.5 py-1 rounded-lg text-xs text-zinc-800 dark:text-zinc-300 outline-none"
            />
            <button
              onClick={() => onOpenLogModal('diet')}
              className="flex items-center gap-1 px-2.5 py-1 bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:text-zinc-900 rounded-lg text-xs font-medium transition"
            >
              <Plus className="w-3 h-3" /> Log Item
            </button>
          </div>
        </div>

        {dateLogs.length === 0 ? (
          <div className="p-6 text-center text-xs text-zinc-400 dark:text-zinc-500">
            No food items logged for {selectedLogDate}.
          </div>
        ) : (
          <div className="space-y-1.5">
            {dateLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-900 rounded-lg"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-zinc-900 dark:text-zinc-200">{log.foodName}</span>
                    <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono">
                      {log.time}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500">{log.quantity}</p>
                </div>
                <button
                  onClick={() => onDeleteDietLog(log.id)}
                  className="p-1.5 text-zinc-400 hover:text-zinc-700 dark:text-zinc-600 dark:hover:text-zinc-300 transition"
                  title="Delete log entry"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
