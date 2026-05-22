import React from "react";
import { useAchievements } from "../../../hooks/useAchievements";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function AchievementTracker({
  compact = false,
  achievements: providedAchievements,
  loading: providedLoading,
  error: providedError,
}) {
  const fallback = useAchievements();
  const achievements = providedAchievements ?? fallback.achievements;
  const loading = providedLoading ?? fallback.loading;
  const error = providedError ?? fallback.error;
  const unlockedCount = achievements.filter((achievement) => achievement.unlocked).length;

  return (
    <section className="rounded-[18px] border-2 border-[#dbb96a] bg-[#f5e9cc] p-4">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-[#653d15]">Achievements</h2>
          <p className="text-sm font-semibold text-[#9a6530]">
            {loading ? "Loading achievements..." : `${unlockedCount} of ${achievements.length} unlocked`}
          </p>
        </div>
      </div>

      {error ? (
        <div className="mt-4 rounded-lg border border-rose-300 bg-[#f0ddb8] p-3 text-sm font-semibold text-rose-700">
          {error}
        </div>
      ) : null}

      <div
        className={cn(
          "mt-4 grid grid-cols-1 gap-4",
          compact ? "md:grid-cols-2 xl:grid-cols-3" : "md:grid-cols-2 lg:grid-cols-3"
        )}
      >
        {loading ? (
          <p className="col-span-full text-center text-sm font-semibold text-[#9a6530]">
            Loading achievements...
          </p>
        ) : (
          achievements.map((achievement) => (
            <article
              key={achievement.id}
              className={cn(
                "relative rounded-xl border-2 p-4 transition",
                achievement.unlocked
                  ? "border-[#e9a319] bg-[#f0ddb8] shadow-[0_3px_12px_rgba(101,61,21,0.12)]"
                  : "border-[#dbb96a] bg-[#f0ddb8] opacity-65"
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-extrabold text-[#653d15]">{achievement.title}</h3>
                <span
                  className={cn(
                    "rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase",
                    achievement.unlocked
                      ? "bg-[#e9a319] text-[#653d15]"
                      : "bg-[#dbb96a] text-[#653d15]"
                  )}
                >
                  {achievement.unlocked ? "Unlocked" : "Locked"}
                </span>
              </div>
              <p className="mt-2 text-sm font-semibold text-[#7a4d1a]">
                {achievement.description}
              </p>
              <p className="mt-3 inline-flex rounded-full bg-[#653d15] px-2.5 py-0.5 text-xs font-extrabold text-[#fdf6e3]">
                +{achievement.xp_reward ?? achievement.xpReward} XP
              </p>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
