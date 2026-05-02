import React, { useState, useEffect } from 'react';

const initialAchievements = [
  { id: 1, name: 'First Steps', description: 'Complete your first task', xpThreshold: 10, streakThreshold: 1, unlocked: false },
  { id: 2, name: 'Streak Master', description: 'Maintain a 7-day streak', xpThreshold: 0, streakThreshold: 7, unlocked: false },
];

function AddAchievementModal({ open, onClose, onCreate }) {
  const [form, setForm] = useState({
    name: '',
    description: '',
    xpThreshold: 0,
    streakThreshold: 0,
  });

  const handleChange = (field) => (event) => {
    const value = field.includes('Threshold') ? parseInt(event.target.value, 10) || 0 : event.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.name.trim()) return;

    onCreate?.({
      name: form.name.trim(),
      description: form.description.trim(),
      xpThreshold: form.xpThreshold,
      streakThreshold: form.streakThreshold,
    });
    setForm({ name: '', description: '', xpThreshold: 0, streakThreshold: 0 });
    onClose?.();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 py-6">
      <div className="w-full max-w-xl rounded-[2rem] bg-white p-6 shadow-2xl ring-1 ring-slate-200">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Add Achievement</h2>
            <p className="mt-1 text-sm text-slate-500">Create a new achievement with name, description, XP threshold, and streak threshold.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-200 bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200"
          >
            Close
          </button>
        </div>

        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          <label className="block text-sm font-medium text-slate-700">
            Name
            <input
              type="text"
              value={form.name}
              onChange={handleChange('name')}
              placeholder="Achievement name"
              className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Description
            <textarea
              value={form.description}
              onChange={handleChange('description')}
              placeholder="Achievement description"
              rows="4"
              className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium text-slate-700">
              XP Threshold
              <input
                type="number"
                value={form.xpThreshold}
                onChange={handleChange('xpThreshold')}
                min="0"
                className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              />
            </label>

            <label className="block text-sm font-medium text-slate-700">
              Streak Threshold
              <input
                type="number"
                value={form.streakThreshold}
                onChange={handleChange('streakThreshold')}
                min="0"
                className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              />
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-3xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
            >
              Create Achievement
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AchievementTracker() {
  const [achievements, setAchievements] = useState(() => {
    const saved = localStorage.getItem('achievements');
    return saved ? JSON.parse(saved) : initialAchievements;
  });
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    localStorage.setItem('achievements', JSON.stringify(achievements));
  }, [achievements]);

  const addAchievement = (newAchievement) => {
    const id = Date.now();
    setAchievements((prev) => [...prev, { ...newAchievement, id, unlocked: false }]);
  };

  const toggleUnlocked = (id) => {
    setAchievements((prev) =>
      prev.map((achievement) =>
        achievement.id === id ? { ...achievement, unlocked: !achievement.unlocked } : achievement
      )
    );
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold">Achievements</h2>
          <p className="text-sm text-slate-500">Create custom achievements and toggle unlocked status.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center justify-center rounded-full bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-600"
        >
          Add Achievement
        </button>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {achievements.map((achievement) => (
          <button
            key={achievement.id}
            type="button"
            onClick={() => toggleUnlocked(achievement.id)}
            className={`text-left p-4 rounded-xl border transition ${
              achievement.unlocked
                ? 'bg-yellow-100 border-yellow-300 hover:bg-yellow-200'
                : 'bg-gray-100 border-gray-300 hover:bg-gray-200'
            }`}
          >
            <h3 className="font-semibold">{achievement.name}</h3>
            <p className="mt-1 text-sm text-slate-600">{achievement.description}</p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
              <span className="rounded-full bg-white px-2 py-1 shadow-sm">XP {achievement.xpThreshold}</span>
              <span className="rounded-full bg-white px-2 py-1 shadow-sm">Streak {achievement.streakThreshold}</span>
            </div>
            <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-700">
              {achievement.unlocked ? 'Unlocked' : 'Locked'}
            </p>
          </button>
        ))}
      </div>

      <AddAchievementModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onCreate={addAchievement}
      />
    </div>
  );
}
