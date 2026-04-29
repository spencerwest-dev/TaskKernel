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
    <div className="rounded-2xl border-2 border-[#dbb96a] bg-[#f0ddb8] p-4 md:p-5">
      <div className="mb-2 flex items-center justify-between gap-3">
        <p className="text-sm font-bold text-[#653d15]">
          Level <span className="text-[#c47e0a]">{level}</span> · Habit Warrior
        </p>
        <p className="text-xs font-semibold text-[#7a4d1a]">{currentXp} / 100 XP</p>
      </div>

      <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#ddb96a]">
        <div
          className="h-full rounded-full bg-[#e9a319] transition-all duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}