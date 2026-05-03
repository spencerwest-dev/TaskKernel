package com.taskkernel.controller;

import java.util.HashMap;
import java.util.Map;
import com.taskkernel.entity.Task;
import com.taskkernel.entity.User;
import com.taskkernel.service.TaskService;
import com.taskkernel.service.UserService;
import com.taskkernel.util.ClerkAuthUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tasks")
public class TaskController {

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
    public ResponseEntity<Task> createTask(@RequestBody Task task) {
        String userId = ClerkAuthUtil.getCurrentUserId();
        return ResponseEntity.ok(taskService.createTask(task, userId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTask(@PathVariable Long id,
                                           @RequestBody Task task) {
        String userId = ClerkAuthUtil.getCurrentUserId();
        return ResponseEntity.ok(taskService.updateTask(id, task, userId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteTask(@PathVariable Long id) {
        String userId = ClerkAuthUtil.getCurrentUserId();
        taskService.deleteTask(id, userId);
        return ResponseEntity.ok(Map.of("message", "deleted"));
    }

    // Mark task complete — awards XP only if not already claimed
    @PostMapping("/{id}/complete")
    public ResponseEntity<Map<String, Object>> completeTask(@PathVariable Long id) {
        String userId = ClerkAuthUtil.getCurrentUserId();
        boolean wasXpClaimed = taskService.isXpClaimed(id, userId);
        Task task = taskService.setCompleted(id, userId, true);
        User user = wasXpClaimed
                ? userService.getOrCreateUser(userId)
                : userService.addXpForTask(userId, task);

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
        return ResponseEntity.ok(response);
    }

    // Unmark task complete — never removes XP
    @DeleteMapping("/{id}/complete")
    public ResponseEntity<Map<String, Object>> uncompleteTask(@PathVariable Long id) {
        String userId = ClerkAuthUtil.getCurrentUserId();
        Task task = taskService.setCompleted(id, userId, false);
        User user = userService.getOrCreateUser(userId);

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