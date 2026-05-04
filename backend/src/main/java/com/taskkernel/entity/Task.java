package com.taskkernel.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "tasks")
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Clerk user ID — links task to the logged-in user
    @Column(name = "user_id", nullable = false)
    private String userId;

    @NotBlank
    @Size(max = 100)
    @Column(nullable = false, length = 100)
    private String title;

    @Size(max = 500)
    @Column(length = 500)
    private String description;

    // "daily" or "weekly"
    @NotNull
    @Column(nullable = false)
    private String type;

    // "weak" or "strong"
    @NotNull
    @Column(nullable = false)
    private String strength;

    @Column(nullable = false)
    private boolean completed = false;

    public Task() {}

    public Task(String userId, String title, String description, String type, String strength) {
        this.userId = userId;
        this.title = title;
        this.description = description;
        this.type = type;
        this.strength = strength;
    }

    // Getters + Setters

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getStrength() { return strength; }
    public void setStrength(String strength) { this.strength = strength; }

    public boolean isCompleted() { return completed; }
    public void setCompleted(boolean completed) { this.completed = completed; }
}