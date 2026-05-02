package com.taskkernel.service;

import com.taskkernel.entity.Achievement;
import com.taskkernel.entity.User;
import com.taskkernel.repository.AchievementRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class AchievementService {

    private final AchievementRepository achievementRepository;

    public AchievementService(AchievementRepository achievementRepository) {
        this.achievementRepository = achievementRepository;
    }

    // Get all achievements for a user
    public List<Achievement> getAchievementsByUserId(String userId) {
        return achievementRepository.findByUserId(userId);
    }

    // Get only unlocked achievements for a user
    public List<Achievement> getUnlockedAchievementsByUserId(String userId) {
        return achievementRepository.findByUserIdAndUnlocked(userId, true);
    }

    // Create a new achievement for a user
    public Achievement createAchievement(String userId, String name, String description, int xpThreshold, int streakThreshold) {
        Achievement achievement = new Achievement(userId, name, description, xpThreshold, streakThreshold);
        return achievementRepository.save(achievement);
    }

    // Check and unlock achievements for a user based on their current XP and streak
    public List<Achievement> checkAndUnlockAchievements(User user) {
        List<Achievement> achievements = achievementRepository.findByUserId(user.getId());
        List<Achievement> unlockedThisCall = new java.util.ArrayList<>();

        for (Achievement achievement : achievements) {
            // Skip if already unlocked
            if (achievement.isUnlocked()) {
                continue;
            }

            // Check if thresholds are met
            boolean xpThresholdMet = achievement.getXpThreshold() == 0 || user.getXp() >= achievement.getXpThreshold();
            boolean streakThresholdMet = achievement.getStreakThreshold() == 0 || user.getStreak() >= achievement.getStreakThreshold();

            // Unlock if both thresholds are met (or if threshold is 0, it doesn't apply)
            if (xpThresholdMet && streakThresholdMet) {
                achievement.setUnlocked(true);
                achievement.setUnlockedAt(LocalDateTime.now());
                achievementRepository.save(achievement);
                unlockedThisCall.add(achievement);
            }
        }

        return unlockedThisCall;
    }

    // Delete an achievement
    public void deleteAchievement(Long achievementId, String userId) {
        Achievement achievement = achievementRepository.findById(achievementId)
                .orElseThrow(() -> new RuntimeException("Achievement not found"));

        if (!achievement.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }

        achievementRepository.delete(achievement);
    }
}
