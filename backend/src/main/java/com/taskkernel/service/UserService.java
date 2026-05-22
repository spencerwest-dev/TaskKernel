package com.taskkernel.service;

import com.taskkernel.entity.Task;
import com.taskkernel.entity.User;
import com.taskkernel.repository.AchievementRepository;
import com.taskkernel.repository.TaskRepository;
import com.taskkernel.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final AchievementService achievementService;
    private final TaskRepository taskRepository;
    private final AchievementRepository achievementRepository;

    public UserService(UserRepository userRepository,
                       AchievementService achievementService,
                       TaskRepository taskRepository,
                       AchievementRepository achievementRepository) {
        this.userRepository = userRepository;
        this.achievementService = achievementService;
        this.taskRepository = taskRepository;
        this.achievementRepository = achievementRepository;
    }

    public User getOrCreateUser(String clerkUserId) {
        return userRepository.findById(clerkUserId).orElseGet(() -> {
            User newUser = new User(clerkUserId);
            return userRepository.save(newUser);
        });
    }

    public User getUserById(String clerkUserId) {
        return userRepository.findById(clerkUserId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User updateUserXpAndLevel(String clerkUserId, int xp, int level, int streak) {
        User user = getUserById(clerkUserId);
        user.setXp(xp);
        user.setLevel(level);
        user.setStreak(streak);
        return userRepository.save(user);
    }

    public User addXpForTask(String clerkUserId, Task task) {
        User user = getOrCreateUser(clerkUserId);
        int newXp = user.getXp() + xpForDifficulty(task.getDifficulty());
        user.setXp(newXp);
        user.setLevel(levelForXp(newXp));
        user.setStreak(user.getStreak() + 1);
        return userRepository.save(user);
    }

    public AchievementService.UnlockResult unlockAchievementsForTask(User user, Task task) {
        return achievementService.checkAndUnlockAchievements(user, task);
    }

    @Transactional
    public User resetDemoState(String clerkUserId) {
        taskRepository.deleteByUserId(clerkUserId);
        achievementRepository.deleteByUserId(clerkUserId);

        User user = getOrCreateUser(clerkUserId);
        user.setXp(0);
        user.setLevel(1);
        user.setStreak(0);
        return userRepository.save(user);
    }

    private int xpForDifficulty(String difficulty) {
        return switch (String.valueOf(difficulty)) {
            case "MEDIUM" -> 25;
            case "HARD" -> 50;
            case "EPIC" -> 100;
            default -> 10;
        };
    }

    private int levelForXp(int xp) {
        return (xp / 100) + 1;
    }
}
