import React from "react";
import {
  getLevel,
  getXpIntoCurrentLevel,
  getXpPercent,
} from "./xpSystem";

export default function XpBar({ xp }) {
  const level = getLevel(xp);
  const currentXp = getXpIntoCurrentLevel(xp);
  const percent = getXpPercent(xp);

  return (
    <div className="w-full rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-2 flex items-center justify-between">
        <p className="font-semibold text-slate-900">Level {level}</p>
        <p className="text-sm text-slate-500">{currentXp} / 100 XP</p>
      </div>

      <div className="h-4 w-full overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-indigo-600 transition-all duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}