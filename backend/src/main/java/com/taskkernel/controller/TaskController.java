package com.taskkernel.controller;

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
}
