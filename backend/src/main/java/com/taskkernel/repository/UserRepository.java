package com.taskkernel.repository;

import com.taskkernel.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    // String = type of the primary key (Clerk user ID)
    // findById(clerkUserId) comes free from JpaRepository
}
