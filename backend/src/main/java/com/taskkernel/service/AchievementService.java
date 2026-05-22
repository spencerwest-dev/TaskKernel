package com.taskkernel.service;

import com.taskkernel.entity.Achievement;
import com.taskkernel.entity.Task;
import com.taskkernel.entity.User;
import com.taskkernel.repository.AchievementRepository;
import com.taskkernel.repository.TaskRepository;
import com.taskkernel.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class AchievementService {

    private static final List<SystemAchievement> SYSTEM_ACHIEVEMENTS = List.of(
            new SystemAchievement("FIRST_STEPS", "First Steps", "Complete your first task", 50),
            new SystemAchievement("GETTING_STARTED", "Getting Started", "Complete 5 tasks total", 75),
            new SystemAchievement("PRODUCTIVE_DAY", "Productive Day", "Complete 5 tasks in a single day", 100),
            new SystemAchievement("HARD_WORKER", "Hard Worker", "Complete your first Hard task", 75),
            new SystemAchievement("EPIC_ACHIEVEMENT", "Epic Achievement", "Complete your first Epic task", 150),
            new SystemAchievement("ON_A_ROLL", "On a Roll", "Reach a 3-day streak", 100),
            new SystemAchievement("WEEK_WARRIOR", "Week Warrior", "Reach a 7-day streak", 200),
            new SystemAchievement("EARLY_BIRD", "Early Bird", "Complete a task before 9 AM", 75),
            new SystemAchievement("OVERACHIEVER", "Overachiever", "Complete 10 tasks in a single day", 200),
            new SystemAchievement("CENTURION", "Centurion", "Complete 100 tasks total", 300)
    );
    private static final Set<String> SYSTEM_CODES = SYSTEM_ACHIEVEMENTS.stream()
            .map(SystemAchievement::code)
            .collect(Collectors.toUnmodifiableSet());

    private final AchievementRepository achievementRepository;
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    public AchievementService(AchievementRepository achievementRepository,
                              TaskRepository taskRepository,
                              UserRepository userRepository) {
        this.achievementRepository = achievementRepository;
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
    }

    public List<Achievement> getAchievementsByUserId(String userId) {
        ensureSeeded(userId);
        return achievementRepository.findByUserId(userId).stream()
                .filter(achievement -> achievement.getCode() != null)
                .filter(achievement -> SYSTEM_CODES.contains(achievement.getCode()))
                .sorted(Comparator.comparing(Achievement::getId))
                .toList();
    }

    public List<Achievement> getUnlockedAchievementsByUserId(String userId) {
        ensureSeeded(userId);
        return achievementRepository.findByUserIdAndUnlocked(userId, true).stream()
                .filter(achievement -> achievement.getCode() != null)
                .filter(achievement -> SYSTEM_CODES.contains(achievement.getCode()))
                .toList();
    }

    public UnlockResult checkAndUnlockAchievements(User user, Task completedTask) {
        ensureSeeded(user.getId());

        List<Task> tasks = taskRepository.findByUserId(user.getId());
        AchievementStats stats = AchievementStats.from(tasks, user, completedTask);
        List<Achievement> unlockedThisCall = new ArrayList<>();
        int xpAwarded = 0;

        for (Achievement achievement : achievementRepository.findByUserId(user.getId())) {
            String code = achievement.getCode();
            if (code == null || !SYSTEM_CODES.contains(code)) {
                continue;
            }
            if (achievement.isUnlocked() || !isMet(code, stats)) {
                continue;
            }

            achievement.setUnlocked(true);
            achievement.setUnlockedAt(LocalDateTime.now());
            achievementRepository.save(achievement);
            unlockedThisCall.add(achievement);
            xpAwarded += achievement.getXpReward();
        }

        if (xpAwarded > 0) {
            user.setXp(user.getXp() + xpAwarded);
            user.setLevel(levelForXp(user.getXp()));
            userRepository.save(user);
        }

        return new UnlockResult(user, unlockedThisCall);
    }

    private void ensureSeeded(String userId) {
        for (SystemAchievement achievement : SYSTEM_ACHIEVEMENTS) {
            if (!achievementRepository.existsByUserIdAndCode(userId, achievement.code())) {
                achievementRepository.save(new Achievement(
                        userId,
                        achievement.code(),
                        achievement.title(),
                        achievement.description(),
                        achievement.xpReward()
                ));
            }
        }
    }

    private boolean isMet(String code, AchievementStats stats) {
        return switch (code) {
            case "FIRST_STEPS" -> stats.totalCompleted() >= 1;
            case "GETTING_STARTED" -> stats.totalCompleted() >= 5;
            case "PRODUCTIVE_DAY" -> stats.completedToday() >= 5;
            case "HARD_WORKER" -> stats.completedHard();
            case "EPIC_ACHIEVEMENT" -> stats.completedEpic();
            case "ON_A_ROLL" -> stats.streak() >= 3;
            case "WEEK_WARRIOR" -> stats.streak() >= 7;
            case "EARLY_BIRD" -> stats.completedBeforeNine();
            case "OVERACHIEVER" -> stats.completedToday() >= 10;
            case "CENTURION" -> stats.totalCompleted() >= 100;
            default -> false;
        };
    }

    private static int levelForXp(int xp) {
        return (xp / 100) + 1;
    }

    private record SystemAchievement(String code, String title, String description, int xpReward) {}

    public record UnlockResult(User user, List<Achievement> unlockedAchievements) {}

    private record AchievementStats(
            long totalCompleted,
            long completedToday,
            boolean completedHard,
            boolean completedEpic,
            boolean completedBeforeNine,
            int streak
    ) {
        static AchievementStats from(List<Task> tasks, User user, Task completedTask) {
            LocalDate today = LocalDate.now();
            long totalCompleted = tasks.stream().filter(Task::isCompleted).count();
            long completedToday = tasks.stream()
                    .filter(Task::isCompleted)
                    .filter(task -> task.getCompletedAt() != null)
                    .filter(task -> task.getCompletedAt().toLocalDate().equals(today))
                    .count();
            boolean completedHard = tasks.stream()
                    .filter(Task::isCompleted)
                    .anyMatch(task -> "HARD".equals(task.getDifficulty()));
            boolean completedEpic = tasks.stream()
                    .filter(Task::isCompleted)
                    .anyMatch(task -> "EPIC".equals(task.getDifficulty()));
            boolean completedBeforeNine = tasks.stream()
                    .filter(Task::isCompleted)
                    .map(Task::getCompletedAt)
                    .anyMatch(completedAt -> completedAt != null && completedAt.toLocalTime().isBefore(LocalTime.of(9, 0)));

            if (completedTask != null && completedTask.getCompletedAt() != null) {
                completedBeforeNine = completedBeforeNine
                        || completedTask.getCompletedAt().toLocalTime().isBefore(LocalTime.of(9, 0));
            }

            return new AchievementStats(
                    totalCompleted,
                    completedToday,
                    completedHard,
                    completedEpic,
                    completedBeforeNine,
                    user.getStreak()
            );
        }
    }
}
