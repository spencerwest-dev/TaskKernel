package com.taskkernel.controller;

import java.util.Map;
import com.taskkernel.entity.Task;
import com.taskkernel.service.TaskService;
import com.taskkernel.util.ClerkAuthUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tasks")
public class TaskController {

    private final TaskService taskService;
    private final ClerkAuthUtil clerkAuthUtil;

    public TaskController(TaskService taskService, ClerkAuthUtil clerkAuthUtil) {
        this.taskService = taskService;
        this.clerkAuthUtil = clerkAuthUtil;
    }

    @GetMapping
public ResponseEntity<Map<String, Object>> getTasks(@AuthenticationPrincipal Jwt jwt) {
    String userId = clerkAuthUtil.extractUserId(jwt);
    List<Task> tasks = taskService.getTasksForUser(userId);
    Map<String, Object> user = Map.of("xp", 0, "level", 1, "streak", 0);
    return ResponseEntity.ok(Map.of("tasks", tasks, "user", user));
}

    @PostMapping
    public ResponseEntity<Task> createTask(@RequestBody Task task,
                                           @AuthenticationPrincipal Jwt jwt) {
        String userId = clerkAuthUtil.extractUserId(jwt);
        return ResponseEntity.ok(taskService.createTask(task, userId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTask(@PathVariable Long id,
                                           @RequestBody Task task,
                                           @AuthenticationPrincipal Jwt jwt) {
        String userId = clerkAuthUtil.extractUserId(jwt);
        return ResponseEntity.ok(taskService.updateTask(id, task, userId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteTask(@PathVariable Long id,
                                           @AuthenticationPrincipal Jwt jwt) {
        String userId = clerkAuthUtil.extractUserId(jwt);
        taskService.deleteTask(id, userId);
        return ResponseEntity.ok(Map.of("message", "deleted"));
    }
}
