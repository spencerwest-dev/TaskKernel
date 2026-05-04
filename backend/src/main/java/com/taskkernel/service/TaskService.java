package com.taskkernel.service;

import com.taskkernel.entity.Task;
import com.taskkernel.repository.TaskRepository;
import org.springframework.stereotype.Service;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class TaskService {

    private final TaskRepository taskRepository;

    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    public List<Task> getTasksForUser(String clerkUserId) {
        return taskRepository.findByUserId(clerkUserId);
    }

    public Task createTask(Task task, String clerkUserId) {
        task.setId(null);
        task.setUserId(clerkUserId);
        return taskRepository.save(task);
    }

    public Task updateTask(Long taskId, Task updated, String clerkUserId) {
        Task existing = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Task not found"));

        if (!existing.getUserId().equals(clerkUserId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied");
        }

        existing.setTitle(updated.getTitle());
        existing.setDescription(updated.getDescription());
        existing.setType(updated.getType());
        existing.setStrength(updated.getStrength());
        boolean wasCompleted = existing.isCompleted();
        boolean nowCompleted = updated.isCompleted();

        existing.setCompleted(nowCompleted);
        if (!wasCompleted && nowCompleted) {
            existing.setCompletedAt(LocalDateTime.now());
            existing.setXpClaimed(true);
        } else if (wasCompleted && !nowCompleted) {
            existing.setCompletedAt(null);
        }

        return taskRepository.save(existing);
    }

    public void deleteTask(Long taskId, String clerkUserId) {
        Task existing = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Task not found"));

        if (!existing.getUserId().equals(clerkUserId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied");
        }

        taskRepository.delete(existing);
    }

    public boolean isXpClaimed(Long taskId, String clerkUserId) {
        Task existing = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Task not found"));
        if (!existing.getUserId().equals(clerkUserId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied");
        }
        return existing.isXpClaimed();
    }

    public Task setCompleted(Long taskId, String clerkUserId, boolean completed) {
        Task existing = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Task not found"));

        if (!existing.getUserId().equals(clerkUserId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied");
        }

        boolean wasCompleted = existing.isCompleted();
        existing.setCompleted(completed);

        if (completed && !wasCompleted) {
            existing.setCompletedAt(LocalDateTime.now());
        } else if (!completed) {
            existing.setCompletedAt(null);
        }

        if (completed && !existing.isXpClaimed()) {
            existing.setXpClaimed(true);
        }

        return taskRepository.save(existing);
    }
}
