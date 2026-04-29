package com.taskkernel.repository;

import com.taskkernel.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByUserId(String userId);
    void deleteByIdAndUserId(Long id, String userId);
}