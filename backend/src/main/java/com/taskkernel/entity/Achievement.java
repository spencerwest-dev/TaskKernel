package com.taskkernel.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "achievements")
public class Achievement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 40)
    @JsonIgnore
    private String code;

    @Column(nullable = false)
    @JsonIgnore
    private String userId;

    @Column(name = "name", nullable = false)
    private String title;

    @Column(nullable = true)
    private String description;

    @Column(name = "xp_threshold", nullable = false)
    @JsonProperty("xp_reward")
    private int xpReward = 0;

    @Column(nullable = false)
    @JsonIgnore
    private int streakThreshold = 0;

    @Column(nullable = false)
    private boolean unlocked = false;

    @Column(nullable = true)
    private LocalDateTime unlockedAt;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public Achievement() {}

    public Achievement(String userId, String code, String title, String description, int xpReward) {
        this.userId = userId;
        this.code = code;
        this.title = title;
        this.description = description;
        this.xpReward = xpReward;
        this.streakThreshold = 0;
        this.unlocked = false;
    }

    // Getters and Setters

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public int getXpReward() { return xpReward; }
    public void setXpReward(int xpReward) { this.xpReward = xpReward; }

    public int getStreakThreshold() { return streakThreshold; }
    public void setStreakThreshold(int streakThreshold) { this.streakThreshold = streakThreshold; }

    public boolean isUnlocked() { return unlocked; }
    public void setUnlocked(boolean unlocked) { this.unlocked = unlocked; }

    public LocalDateTime getUnlockedAt() { return unlockedAt; }
    public void setUnlockedAt(LocalDateTime unlockedAt) { this.unlockedAt = unlockedAt; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
