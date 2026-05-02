package com.taskkernel.controller;

import com.taskkernel.entity.Achievement;
import com.taskkernel.service.AchievementService;
import com.taskkernel.util.ClerkAuthUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/achievements")
public class AchievementController {

    private final AchievementService achievementService;

    public AchievementController(AchievementService achievementService) {
        this.achievementService = achievementService;
    }

    // GET /achievements — get all achievements for the logged-in user
    @GetMapping
    public ResponseEntity<List<Achievement>> getAchievements() {
        String userId = ClerkAuthUtil.getCurrentUserId();
        List<Achievement> achievements = achievementService.getAchievementsByUserId(userId);
        return ResponseEntity.ok(achievements);
    }

    // GET /achievements/unlocked — get only unlocked achievements for the logged-in user
    @GetMapping("/unlocked")
    public ResponseEntity<List<Achievement>> getUnlockedAchievements() {
        String userId = ClerkAuthUtil.getCurrentUserId();
        List<Achievement> unlockedAchievements = achievementService.getUnlockedAchievementsByUserId(userId);
        return ResponseEntity.ok(unlockedAchievements);
    }

    // POST /achievements — create a new achievement for the logged-in user
    @PostMapping
    public ResponseEntity<Achievement> createAchievement(@RequestBody Map<String, Object> request) {
        String userId = ClerkAuthUtil.getCurrentUserId();
        String name = (String) request.get("name");
        String description = (String) request.getOrDefault("description", "");
        int xpThreshold = ((Number) request.getOrDefault("xpThreshold", 0)).intValue();
        int streakThreshold = ((Number) request.getOrDefault("streakThreshold", 0)).intValue();

        if (name == null || name.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        Achievement achievement = achievementService.createAchievement(userId, name, description, xpThreshold, streakThreshold);
        return ResponseEntity.status(HttpStatus.CREATED).body(achievement);
    }

    // DELETE /achievements/{id} — delete an achievement
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteAchievement(@PathVariable Long id) {
        String userId = ClerkAuthUtil.getCurrentUserId();
        achievementService.deleteAchievement(id, userId);
        return ResponseEntity.ok(Map.of("message", "Achievement deleted"));
    }
}
