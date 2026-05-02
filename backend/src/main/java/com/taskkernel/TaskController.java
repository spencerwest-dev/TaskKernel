package com.taskkernel;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.taskkernel.entity.Task;
import com.taskkernel.util.ClerkAuthUtil;

import java.util.List;

@RestController
@RequestMapping("/tasks")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @GetMapping
    public ResponseEntity<List<Task>> getTasks() {
        String userId = ClerkAuthUtil.getCurrentUserId();
        return ResponseEntity.ok(taskService.getTasksForUser(userId));
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
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        String userId = ClerkAuthUtil.getCurrentUserId();
        taskService.deleteTask(id, userId);
        return ResponseEntity.noContent().build();
    }
}