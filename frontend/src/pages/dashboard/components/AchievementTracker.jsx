import React, { useState, useEffect } from 'react';
import { useAchievements } from '../../../hooks/useAchievements';

function AddAchievementModal({ open, onClose, onCreate, isSubmitting }) {
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.name.trim()) return;

    await onCreate?.({
      name: form.name.trim(),
      description: form.description.trim(),
      xpThreshold: form.xpThreshold,
      streakThreshold: form.streakThreshold,
    });
    setForm({ name: '', description: '', xpThreshold: 0, streakThreshold: 0 });
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
              disabled={isSubmitting}
              className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 disabled:opacity-50"
            />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Description
            <textarea
              value={form.description}
              onChange={handleChange('description')}
              placeholder="Achievement description"
              rows="4"
              disabled={isSubmitting}
              className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 disabled:opacity-50"
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
                disabled={isSubmitting}
                className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 disabled:opacity-50"
              />
            </label>

            <label className="block text-sm font-medium text-slate-700">
              Streak Threshold
              <input
                type="number"
                value={form.streakThreshold}
                onChange={handleChange('streakThreshold')}
                min="0"
                disabled={isSubmitting}
                className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 disabled:opacity-50"
              />
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-3xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Creating...' : 'Create Achievement'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function UnlockNotification({ achievement, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-slide-up rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-500 p-4 shadow-lg">
      <div className="flex items-center gap-3">
        <span className="text-2xl">🏆</span>
        <div>
          <p className="font-bold text-slate-900">Achievement Unlocked!</p>
          <p className="text-sm text-slate-800">{achievement.name}</p>
        </div>
      </div>
    </div>
  );
}

export default function AchievementTracker({ onAchievementUnlocked }) {
  const { achievements, loading, error, addAchievement, deleteAchievement } = useAchievements();
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newlyUnlocked, setNewlyUnlocked] = useState(null);
  const [previousUnlockedIds, setPreviousUnlockedIds] = useState(new Set());

  // Check for newly unlocked achievements
  useEffect(() => {
    if (achievements && achievements.length > 0) {
      const currentUnlockedIds = new Set(
        achievements.filter((a) => a.unlocked).map((a) => a.id)
      );

      // Find newly unlocked achievements
      const unlockedThisRender = achievements.find(
        (a) => a.unlocked && !previousUnlockedIds.has(a.id)
      );

      if (unlockedThisRender) {
        setNewlyUnlocked(unlockedThisRender);
        onAchievementUnlocked?.(unlockedThisRender);
      }

      setPreviousUnlockedIds(currentUnlockedIds);
    }
  }, [achievements, previousUnlockedIds, onAchievementUnlocked]);

  const handleAddAchievement = async (newAchievement) => {
    setIsSubmitting(true);
    try {
      await addAchievement(
        newAchievement.name,
        newAchievement.description,
        newAchievement.xpThreshold,
        newAchievement.streakThreshold
      );
      setShowAddModal(false);
    } catch (err) {
      console.error('Failed to create achievement:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAchievement = async (achievementId) => {
    try {
      await deleteAchievement(achievementId);
    } catch (err) {
      console.error('Failed to delete achievement:', err);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold">Achievements</h2>
          <p className="text-sm text-slate-500">
            {loading
              ? 'Loading achievements...'
              : `${achievements.filter((a) => a.unlocked).length} of ${achievements.length} unlocked`}
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center justify-center rounded-full bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-600 disabled:opacity-50"
          disabled={loading}
        >
          Add Achievement
        </button>
      </div>

      {error && (
        <div className="mt-4 rounded-lg bg-red-100 p-3 text-sm text-red-700">
          Error: {error}
        </div>
      )}

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <p className="col-span-full text-center text-slate-500">Loading achievements...</p>
        ) : achievements.length === 0 ? (
          <p className="col-span-full text-center text-slate-500">No achievements yet. Create one to get started!</p>
        ) : (
          achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`text-left p-4 rounded-xl border transition relative ${
                achievement.unlocked
                  ? 'bg-yellow-100 border-yellow-300'
                  : 'bg-gray-100 border-gray-300'
              }`}
            >
              {achievement.unlocked && (
                <div className="absolute top-2 right-2 text-2xl">🏆</div>
              )}
              <h3 className="font-semibold">{achievement.name}</h3>
              <p className="mt-1 text-sm text-slate-600">{achievement.description}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
                {achievement.xpThreshold > 0 && (
                  <span className="rounded-full bg-white px-2 py-1 shadow-sm">XP {achievement.xpThreshold}</span>
                )}
                {achievement.streakThreshold > 0 && (
                  <span className="rounded-full bg-white px-2 py-1 shadow-sm">Streak {achievement.streakThreshold}</span>
                )}
              </div>
              <div className="mt-3 flex items-center justify-between">
                <p className={`text-xs font-semibold uppercase tracking-wide ${
                  achievement.unlocked ? 'text-yellow-700' : 'text-slate-700'
                }`}>
                  {achievement.unlocked ? 'Unlocked' : 'Locked'}
                </p>
                <button
                  onClick={() => handleDeleteAchievement(achievement.id)}
                  className="text-xs text-slate-500 hover:text-red-600 transition"
                  title="Delete achievement"
                >
                  ✕
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <AddAchievementModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onCreate={handleAddAchievement}
        isSubmitting={isSubmitting}
      />

      {newlyUnlocked && (
        <UnlockNotification
          achievement={newlyUnlocked}
          onClose={() => setNewlyUnlocked(null)}
        />
      )}

      <style>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}