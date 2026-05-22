package com.taskkernel.repository;

import com.taskkernel.entity.Achievement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AchievementRepository extends JpaRepository<Achievement, Long> {
    List<Achievement> findByUserId(String userId);
    List<Achievement> findByUserIdAndUnlocked(String userId, boolean unlocked);
    boolean existsByUserIdAndCode(String userId, String code);
    void deleteByUserId(String userId);
}
