package com.taskkernel.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {

    // Clerk user ID (e.g. "user_2abc123xyz") — this IS the primary key, no auto-gen needed
    @Id
    @Column(name = "id", nullable = false)
    private String id;

    @Column(nullable = false)
    private int xp = 0;

    @Column(nullable = false)
    private int level = 1;

    @Column(nullable = false)
    private int streak = 0;

    public User() {}

    public User(String id) {
        this.id = id;
    }

    // Getters + Setters

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public int getXp() { return xp; }
    public void setXp(int xp) { this.xp = xp; }

    public int getLevel() { return level; }
    public void setLevel(int level) { this.level = level; }

    public int getStreak() { return streak; }
    public void setStreak(int streak) { this.streak = streak; }
}