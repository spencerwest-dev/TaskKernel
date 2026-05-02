package com.taskkernel.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "achievements")
public class Achievement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String userId;

    @Column(nullable = false)
    private String name;

    @Column(nullable = true)
    private String description;

    @Column(nullable = false)
    private int xpThreshold = 0;

    @Column(nullable = false)
    private int streakThreshold = 0;

    @Column(nullable = false)
    private boolean unlocked = false;

    @Column(nullable = true)
    private LocalDateTime unlockedAt;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public Achievement() {}

    public Achievement(String userId, String name, String description, int xpThreshold, int streakThreshold) {
        this.userId = userId;
        this.name = name;
        this.description = description;
        this.xpThreshold = xpThreshold;
        this.streakThreshold = streakThreshold;
        this.unlocked = false;
    }

    // Getters and Setters

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public int getXpThreshold() { return xpThreshold; }
    public void setXpThreshold(int xpThreshold) { this.xpThreshold = xpThreshold; }

    public int getStreakThreshold() { return streakThreshold; }
    public void setStreakThreshold(int streakThreshold) { this.streakThreshold = streakThreshold; }

    public boolean isUnlocked() { return unlocked; }
    public void setUnlocked(boolean unlocked) { this.unlocked = unlocked; }

    public LocalDateTime getUnlockedAt() { return unlockedAt; }
    public void setUnlockedAt(LocalDateTime unlockedAt) { this.unlockedAt = unlockedAt; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
