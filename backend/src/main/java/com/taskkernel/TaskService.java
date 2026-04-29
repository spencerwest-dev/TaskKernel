package com.taskkernel;

import org.springframework.stereotype.Service;
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
        task.setUserId(clerkUserId);
        return taskRepository.save(task);
    }

    public Task updateTask(Long taskId, Task updated, String clerkUserId) {
        Task existing = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        if (!existing.getUserId().equals(clerkUserId)) {
            throw new RuntimeException("Forbidden");
        }

        existing.setTitle(updated.getTitle());
        existing.setDescription(updated.getDescription());
        existing.setType(updated.getType());
        existing.setStrength(updated.getStrength());
        existing.setFrequency(updated.getFrequency());
        return taskRepository.save(existing);
    }

    public void deleteTask(Long taskId, String clerkUserId) {
        Task existing = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        if (!existing.getUserId().equals(clerkUserId)) {
            throw new RuntimeException("Forbidden");
        }

        taskRepository.delete(existing);
    }
}
