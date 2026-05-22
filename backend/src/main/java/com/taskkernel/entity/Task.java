package com.taskkernel.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;

@Entity
@Table(name = "tasks")
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    @JsonIgnore
    private String userId;

    // CWE-89 Mitigation: @Size enforces input length at the application layer before
    // data reaches the database. @Column(length) enforces it at the schema level.
    @NotBlank
    @Size(max = 100)
    @Column(nullable = false, length = 100)
    private String title;

    @Size(max = 500)
    @Column(length = 500)
    private String description;

    @NotNull
    @Pattern(regexp = "DAILY|WEEKLY|ONE_TIME", message = "Task recurrence must be DAILY, WEEKLY, or ONE_TIME")
    @Column(name = "type", nullable = false)
    private String recurrence;

    @NotNull
    @Pattern(regexp = "EASY|MEDIUM|HARD|EPIC", message = "Task difficulty must be EASY, MEDIUM, HARD, or EPIC")
    @Column(name = "strength", nullable = false)
    private String difficulty;

    @Size(max = 40)
    @Column(length = 40)
    private String tag;

    @Column(nullable = false)
    private boolean completed = false;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @Column(nullable = false, columnDefinition = "boolean default false")
    private boolean xpClaimed = false;

    public Task() {}

    public Task(String userId, String title, String description, String recurrence, String difficulty) {
        this.userId = userId;
        this.title = title;
        this.description = description;
        setRecurrence(recurrence);
        setDifficulty(difficulty);
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getRecurrence() { return recurrence; }
    public void setRecurrence(String recurrence) { this.recurrence = normalizeRecurrence(recurrence); }

    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = normalizeDifficulty(difficulty); }

    public String getTag() { return tag; }
    public void setTag(String tag) { this.tag = tag; }

    public boolean isCompleted() { return completed; }
    public void setCompleted(boolean completed) { this.completed = completed; }

    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }

    public boolean isXpClaimed() { return xpClaimed; }
    public void setXpClaimed(boolean xpClaimed) { this.xpClaimed = xpClaimed; }

    @PrePersist
    @PreUpdate
    @PostLoad
    private void normalizeFields() {
        recurrence = recurrence == null ? "DAILY" : normalizeRecurrence(recurrence);
        difficulty = difficulty == null ? "EASY" : normalizeDifficulty(difficulty);
        if (tag != null && tag.trim().isEmpty()) {
            tag = null;
        }
    }

    private static String normalizeRecurrence(String value) {
        if (value == null) return null;
        String normalized = value.trim().toUpperCase().replace('-', '_');
        if ("DAILY".equals(normalized) || "WEEKLY".equals(normalized) || "ONE_TIME".equals(normalized)) {
            return normalized;
        }
        if ("DAILY_TASK".equals(normalized)) return "DAILY";
        if ("WEEKLY_TASK".equals(normalized)) return "WEEKLY";
        return normalized;
    }

    private static String normalizeDifficulty(String value) {
        if (value == null) return null;
        String normalized = value.trim().toUpperCase();
        if ("WEAK".equals(normalized)) return "EASY";
        if ("STRONG".equals(normalized)) return "HARD";
        return normalized;
    }
}
