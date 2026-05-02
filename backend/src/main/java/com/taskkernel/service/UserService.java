package com.taskkernel.service;

import com.taskkernel.entity.Task;
import com.taskkernel.entity.User;
import com.taskkernel.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final AchievementService achievementService;

    public UserService(UserRepository userRepository, AchievementService achievementService) {
        this.userRepository = userRepository;
        this.achievementService = achievementService;
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

    // Awards XP based on task strength — strong = 20 XP, weak = 10 XP
    public User addXpForTask(String clerkUserId, Task task) {
        User user = getOrCreateUser(clerkUserId);
        int xpGain = "strong".equals(task.getStrength()) ? 20 : 10;
        int newXp = user.getXp() + xpGain;
        int newLevel = (newXp / 100) + 1;
        user.setXp(newXp);
        user.setLevel(newLevel);
        user.setStreak(user.getStreak() + 1);
        User savedUser = userRepository.save(user);
        
        // Check and unlock achievements
        achievementService.checkAndUnlockAchievements(savedUser);
        
        return savedUser;
    }
}