package com.taskkernel.service;

import com.taskkernel.entity.User;
import com.taskkernel.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
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
}