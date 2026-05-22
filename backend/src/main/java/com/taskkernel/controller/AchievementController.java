package com.taskkernel.controller;

import com.taskkernel.entity.Achievement;
import com.taskkernel.service.AchievementService;
import com.taskkernel.util.ClerkAuthUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/achievements")
public class AchievementController {

    private final AchievementService achievementService;

    public AchievementController(AchievementService achievementService) {
        this.achievementService = achievementService;
    }

    @GetMapping
    public ResponseEntity<List<Achievement>> getAchievements() {
        String userId = ClerkAuthUtil.getCurrentUserId();
        return ResponseEntity.ok(achievementService.getAchievementsByUserId(userId));
    }

    @GetMapping("/unlocked")
    public ResponseEntity<List<Achievement>> getUnlockedAchievements() {
        String userId = ClerkAuthUtil.getCurrentUserId();
        return ResponseEntity.ok(achievementService.getUnlockedAchievementsByUserId(userId));
    }
}
