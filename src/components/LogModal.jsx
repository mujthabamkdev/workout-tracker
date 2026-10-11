import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { calculateBodyFat } from '../utils/storage';

export default function LogModal({
  isOpen,
  onClose,
  initialTab = 'diet',
  profile,
  onAddDietLog,
  onAddMeasurementLog,
  showToast
}) {
  const now = new Date();
  const todayDate = now.toISOString().split('T')[0];
  const currentTime = now.toTimeString().slice(0, 5);

  const [activeTab, setActiveTab] = useState(initialTab);

  const [dietDate, setDietDate] = useState(todayDate);
  const [dietTime, setDietTime] = useState(
    now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  );
  const [foodName, setFoodName] = useState('');
  const [quantity, setQuantity] = useState('');

  const [vitalsDate, setVitalsDate] = useState(todayDate);
  const [vitalsTime, setVitalsTime] = useState(currentTime);
  const [weight, setWeight] = useState(profile?.weight || '');
  const [neck, setNeck] = useState(profile?.neck || '');
  const [waist, setWaist] = useState(profile?.waist || '');

  React.useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  if (!isOpen) return null;

  const handleDietSubmit = (e) => {
    e.preventDefault();
    if (!foodName.trim()) {
      showToast('Please enter the food name.');
      return;
    }

    const newLog = {
      id: `dl_${Date.now()}`,
      date: dietDate,
      time: dietTime || '12:00 PM',
      foodName: foodName.trim(),
      quantity: quantity.trim() || '1 serving'
    };

    onAddDietLog(newLog);
    showToast('Food entry logged.');
    setFoodName('');
    setQuantity('');
    onClose();
  };

  const handleVitalsSubmit = (e) => {
    e.preventDefault();
    if (!weight) {
      showToast('Please enter your weight.');
      return;
    }

    const wNum = parseFloat(weight);
    const nNum = parseFloat(neck) || profile?.neck || 38.5;
    const waistNum = parseFloat(waist) || profile?.waist || 83.0;
    const height = profile?.height || 178;
    const calculatedBF = calculateBodyFat(waistNum, nNum, height) || 14.5;

    const newEntry = {
      id: `m_${Date.now()}`,
      date: vitalsDate,
      time: vitalsTime,
      weight: wNum,
      neck: nNum,
      waist: waistNum,
      bodyFat: calculatedBF
    };

    onAddMeasurementLog(newEntry);
    showToast('Measurement saved.');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-zinc-900 bg-zinc-950">
          <h3 className="font-semibold text-sm text-zinc-100">Quick Daily Log</h3>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-500 hover:text-zinc-200 rounded-lg hover:bg-zinc-900 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex p-1.5 gap-1.5 bg-zinc-900/50 border-b border-zinc-900">
          <button
            onClick={() => setActiveTab('diet')}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-medium transition ${
              activeTab === 'diet'
                ? 'bg-zinc-800 text-zinc-100'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Food / Meal
          </button>
          <button
            onClick={() => setActiveTab('vitals')}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-medium transition ${
              activeTab === 'vitals'
                ? 'bg-zinc-800 text-zinc-100'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Weight / Vitals
          </button>
        </div>

        {/* Content */}
        <div className="p-5">
          {activeTab === 'diet' ? (
            <form onSubmit={handleDietSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-2.5">
                <div className="bg-zinc-900/50 p-2.5 rounded-lg border border-zinc-900">
                  <label className="text-[10px] text-zinc-500 block mb-1">Date</label>
                  <input
                    type="date"
                    value={dietDate}
                    onChange={(e) => setDietDate(e.target.value)}
                    className="w-full bg-transparent text-xs text-zinc-200 outline-none"
                    required
                  />
                </div>
                <div className="bg-zinc-900/50 p-2.5 rounded-lg border border-zinc-900">
                  <label className="text-[10px] text-zinc-500 block mb-1">Time</label>
                  <input
                    type="text"
                    value={dietTime}
                    onChange={(e) => setDietTime(e.target.value)}
                    placeholder="1:30 PM"
                    className="w-full bg-transparent text-xs text-zinc-200 outline-none"
                    required
                  />
                </div>
              </div>

              <div className="bg-zinc-900/50 p-3 rounded-lg border border-zinc-900">
                <label className="text-xs text-zinc-400 block mb-1">Food Name (free-text)</label>
                <input
                  type="text"
                  placeholder="e.g. Chicken breast with white rice"
                  value={foodName}
                  onChange={(e) => setFoodName(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-xs text-zinc-100 outline-none focus:border-zinc-500"
                  autoFocus
                  required
                />
              </div>

              <div className="bg-zinc-900/50 p-3 rounded-lg border border-zinc-900">
                <label className="text-xs text-zinc-400 block mb-1">Quantity / Notes</label>
                <input
                  type="text"
                  placeholder="e.g. 200g, 1 bowl"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-xs text-zinc-100 outline-none focus:border-zinc-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-zinc-100 hover:bg-white text-zinc-900 font-medium rounded-lg text-xs transition flex items-center justify-center gap-1.5 mt-2"
              >
                <Check className="w-3.5 h-3.5" /> Save Food Item
              </button>
            </form>
          ) : (
            <form onSubmit={handleVitalsSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-2.5">
                <div className="bg-zinc-900/50 p-2.5 rounded-lg border border-zinc-900">
                  <label className="text-[10px] text-zinc-500 block mb-1">Date</label>
                  <input
                    type="date"
                    value={vitalsDate}
                    onChange={(e) => setVitalsDate(e.target.value)}
                    className="w-full bg-transparent text-xs text-zinc-200 outline-none"
                    required
                  />
                </div>
                <div className="bg-zinc-900/50 p-2.5 rounded-lg border border-zinc-900">
                  <label className="text-[10px] text-zinc-500 block mb-1">Time</label>
                  <input
                    type="time"
                    value={vitalsTime}
                    onChange={(e) => setVitalsTime(e.target.value)}
                    className="w-full bg-transparent text-xs text-zinc-200 outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="bg-zinc-900/50 p-2.5 rounded-lg border border-zinc-900 text-center">
                  <label className="text-[10px] text-zinc-500 block mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="76.5"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-center text-xs font-semibold text-zinc-100 outline-none focus:border-zinc-500"
                    required
                  />
                </div>
                <div className="bg-zinc-900/50 p-2.5 rounded-lg border border-zinc-900 text-center">
                  <label className="text-[10px] text-zinc-500 block mb-1">Neck (cm)</label>
                  <input
                    type="number"
                    step="0.5"
                    placeholder="38.5"
                    value={neck}
                    onChange={(e) => setNeck(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-center text-xs font-semibold text-zinc-100 outline-none focus:border-zinc-500"
                  />
                </div>
                <div className="bg-zinc-900/50 p-2.5 rounded-lg border border-zinc-900 text-center">
                  <label className="text-[10px] text-zinc-500 block mb-1">Waist (cm)</label>
                  <input
                    type="number"
                    step="0.5"
                    placeholder="83.0"
                    value={waist}
                    onChange={(e) => setWaist(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-center text-xs font-semibold text-zinc-100 outline-none focus:border-zinc-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-zinc-100 hover:bg-white text-zinc-900 font-medium rounded-lg text-xs transition flex items-center justify-center gap-1.5 mt-2"
              >
                <Check className="w-3.5 h-3.5" /> Save Measurement
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
