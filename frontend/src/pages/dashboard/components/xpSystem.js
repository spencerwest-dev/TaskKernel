const XP_PER_LEVEL = 100;
const MAX_XP = 1_000_000;
const MAX_XP_GAIN = 1000;

export function clampXp(value) {
  if (!Number.isSafeInteger(value)) return MAX_XP;
  if (value < 0) return 0;
  if (value > MAX_XP) return MAX_XP;
  return value;
}

export function getLevel(xp) {
  const safeXp = clampXp(xp);
  return Math.floor(safeXp / XP_PER_LEVEL) + 1;
}

export function getXpIntoCurrentLevel(xp) {
  const safeXp = clampXp(xp);
  return safeXp % XP_PER_LEVEL;
}

export function getXpPercent(xp) {
  return (getXpIntoCurrentLevel(xp) / XP_PER_LEVEL) * 100;
}

export function addXp(currentXp, amount) {
  const safeCurrentXp = clampXp(currentXp);

  let safeAmount = amount;

  if (!Number.isSafeInteger(safeAmount)) {
    safeAmount = 0;
  }

  if (safeAmount < 0) {
    safeAmount = 0;
  }

  if (safeAmount > MAX_XP_GAIN) {
    safeAmount = MAX_XP_GAIN;
  }

  const newXp = clampXp(safeCurrentXp + safeAmount);

  return {
    xp: newXp,
    level: getLevel(newXp),
    xpIntoLevel: getXpIntoCurrentLevel(newXp),
    xpNeeded: XP_PER_LEVEL,
    percent: getXpPercent(newXp),
  };
}