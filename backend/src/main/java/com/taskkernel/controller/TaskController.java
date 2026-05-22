package com.taskkernel.controller;

import com.taskkernel.entity.Task;
import com.taskkernel.entity.User;
import com.taskkernel.service.TaskService;
import com.taskkernel.service.UserService;
import com.taskkernel.util.ClerkAuthUtil;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Task HTTP API. Task routes require a verified Clerk JWT (Spring Security).
 * <p>
 * <strong>Section 2 — CWE-306 (Janeth Loera): Missing Authentication for Critical Function.</strong>
 * Completion is a critical state change: it is only exposed on authenticated routes, uses
 * {@link ClerkAuthUtil#getCurrentUserId()} (never user id from the client body for auth), and
 * {@link TaskService} enforces task ownership before mutating completion / XP.
 */
@RestController
@RequestMapping("/tasks")
@Validated
public class TaskController {

    private static final Logger log = LoggerFactory.getLogger(TaskController.class);

    private final TaskService taskService;
    private final UserService userService;

    public TaskController(TaskService taskService, UserService userService) {
        this.taskService = taskService;
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getTasks() {
        String userId = ClerkAuthUtil.getCurrentUserId();
        List<Task> tasks = taskService.getTasksForUser(userId);
        User userRecord = userService.getOrCreateUser(userId);
        Map<String, Object> user = Map.of(
                "xp", userRecord.getXp(),
                "level", userRecord.getLevel(),
                "streak", userRecord.getStreak()
        );
        return ResponseEntity.ok(Map.of("tasks", tasks, "user", user));
    }

    @PostMapping
    public ResponseEntity<Task> createTask(@Valid @RequestBody Task task) {
        String userId = ClerkAuthUtil.getCurrentUserId();
        return ResponseEntity.ok(taskService.createTask(task, userId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTask(@PathVariable("id") @Positive Long id,
                                           @Valid @RequestBody Task task) {
        String userId = ClerkAuthUtil.getCurrentUserId();
        return ResponseEntity.ok(taskService.updateTask(id, task, userId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteTask(@PathVariable("id") @Positive Long id) {
        String userId = ClerkAuthUtil.getCurrentUserId();
        taskService.deleteTask(id, userId);
        return ResponseEntity.ok(Map.of("message", "deleted"));
    }

    @PostMapping("/{id}/complete")
    public ResponseEntity<Map<String, Object>> completeTask(@PathVariable("id") @Positive Long id) {
        String userId = ClerkAuthUtil.getCurrentUserId();
        log.info("cwe306 task_completion_attempt userId={} taskId={}", userId, id);

        boolean wasXpClaimed = taskService.isXpClaimed(id, userId);
        Task task = taskService.setCompleted(id, userId, true);
        User user;
        List<?> unlockedAchievements = List.of();
        if (wasXpClaimed) {
            user = userService.getOrCreateUser(userId);
        } else {
            user = userService.addXpForTask(userId, task);
            var unlockResult = userService.unlockAchievementsForTask(user, task);
            user = unlockResult.user();
            unlockedAchievements = unlockResult.unlockedAchievements();
        }

        log.info("cwe306 task_completion_success userId={} taskId={} xpAlreadyClaimed={}", userId, id, wasXpClaimed);

        Map<String, Object> response = new HashMap<>();
        response.put("taskId", task.getId());
        response.put("completed", true);
        response.put("completedAt", task.getCompletedAt() != null ? task.getCompletedAt().toString() : "");
        response.put("xpClaimed", task.isXpClaimed());
        response.put("user", Map.of(
                "xp", user.getXp(),
                "level", user.getLevel(),
                "streak", user.getStreak()
        ));
        response.put("unlockedAchievements", unlockedAchievements);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}/complete")
    public ResponseEntity<Map<String, Object>> uncompleteTask(@PathVariable("id") @Positive Long id) {
        String userId = ClerkAuthUtil.getCurrentUserId();
        log.info("cwe306 task_uncomplete_attempt userId={} taskId={}", userId, id);

        Task task = taskService.setCompleted(id, userId, false);
        User user = userService.getOrCreateUser(userId);

        log.info("cwe306 task_uncomplete_success userId={} taskId={}", userId, id);

        Map<String, Object> response = new HashMap<>();
        response.put("taskId", task.getId());
        response.put("completed", false);
        response.put("completedAt", task.getCompletedAt() != null ? task.getCompletedAt().toString() : "");
        response.put("xpClaimed", task.isXpClaimed());
        response.put("user", Map.of(
                "xp", user.getXp(),
                "level", user.getLevel(),
                "streak", user.getStreak()
        ));
        return ResponseEntity.ok(response);
    }
}
