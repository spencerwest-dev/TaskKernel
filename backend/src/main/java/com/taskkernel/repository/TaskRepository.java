package com.taskkernel.repository;

import com.taskkernel.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    // CWE-89 Mitigation: Spring Data JPA compiles this derived query into a prepared
    // statement automatically. The userId is bound as a parameter, never concatenated
    // into raw SQL, preventing SQL injection.   
    List<Task> findByUserId(String userId);
    void deleteByIdAndUserId(Long id, String userId);
    void deleteByUserId(String userId);
}
