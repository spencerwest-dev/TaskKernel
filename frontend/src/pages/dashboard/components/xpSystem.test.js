import {
  clampXp,
  getLevel,
  getXpIntoCurrentLevel,
  getXpPercent,
  addXp,
} from "./xpSystem";

describe("XP utils", () => {
  test("clampXp handles valid values", () => {
    expect(clampXp(0)).toBe(0);
    expect(clampXp(50)).toBe(50);
    expect(clampXp(1_000_000)).toBe(1_000_000);
  });

  test("clampXp clamps invalid values", () => {
    expect(clampXp(-10)).toBe(0);
    expect(clampXp(1_000_001)).toBe(1_000_000);
    expect(clampXp(1.5)).toBe(1_000_000);
    expect(clampXp("100")).toBe(1_000_000);
  });

  test("getLevel works correctly", () => {
    expect(getLevel(0)).toBe(1);
    expect(getLevel(99)).toBe(1);
    expect(getLevel(100)).toBe(2);
    expect(getLevel(250)).toBe(3);
  });

  test("getXpIntoCurrentLevel works", () => {
    expect(getXpIntoCurrentLevel(0)).toBe(0);
    expect(getXpIntoCurrentLevel(99)).toBe(99);
    expect(getXpIntoCurrentLevel(100)).toBe(0);
    expect(getXpIntoCurrentLevel(250)).toBe(50);
  });

  test("getXpPercent works", () => {
    expect(getXpPercent(0)).toBe(0);
    expect(getXpPercent(50)).toBe(50);
    expect(getXpPercent(100)).toBe(0);
  });

  test("addXp adds xp correctly", () => {
    expect(addXp(50, 25)).toEqual({
      xp: 75,
      level: 1,
      xpIntoLevel: 75,
      xpNeeded: 100,
      percent: 75,
    });
  });

  test("addXp handles level up", () => {
    expect(addXp(90, 20)).toEqual({
      xp: 110,
      level: 2,
      xpIntoLevel: 10,
      xpNeeded: 100,
      percent: 10,
    });
  });

  test("addXp ignores invalid amounts", () => {
    expect(addXp(50, -10).xp).toBe(50);
    expect(addXp(50, 1.5).xp).toBe(50);
    expect(addXp(50, "10").xp).toBe(50);
  });

  test("addXp caps gain and max xp", () => {
    expect(addXp(0, 2000).xp).toBe(1000);
    expect(addXp(999_500, 1000).xp).toBe(1_000_000);
  });
});
