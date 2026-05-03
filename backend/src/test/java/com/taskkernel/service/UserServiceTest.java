package com.taskkernel.service;

import com.taskkernel.entity.User;
import com.taskkernel.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Unit tests for UserService.
 *
 * CWE-20 (Improper Input Validation) coverage:
 * - Verifies that a new user is created when a valid Clerk user ID is provided
 * - Verifies that an existing user is returned without duplication
 * - Verifies that getUserById throws when the user does not exist (no silent failures)
 * - Verifies XP/level/streak updates are applied correctly and saved
 */
@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    private User existingUser;

    @BeforeEach
    void setUp() {
        existingUser = new User("user_abc123");
        existingUser.setXp(50);
        existingUser.setLevel(1);
        existingUser.setStreak(3);
    }

    // Verifies that a new user row is created on first login
    @Test
    void getOrCreateUser_createsNewUser_whenNotFound() {
        when(userRepository.findById("user_new123")).thenReturn(Optional.empty());
        when(userRepository.save(any(User.class))).thenAnswer(i -> i.getArgument(0));

        User result = userService.getOrCreateUser("user_new123");

        assertNotNull(result);
        assertEquals("user_new123", result.getId());
        assertEquals(0, result.getXp());
        assertEquals(1, result.getLevel());
        assertEquals(0, result.getStreak());
        verify(userRepository, times(1)).save(any(User.class));
    }

    // Verifies that an existing user is returned without creating a duplicate
    @Test
    void getOrCreateUser_returnsExistingUser_whenFound() {
        when(userRepository.findById("user_abc123")).thenReturn(Optional.of(existingUser));

        User result = userService.getOrCreateUser("user_abc123");

        assertNotNull(result);
        assertEquals("user_abc123", result.getId());
        assertEquals(50, result.getXp());
        verify(userRepository, never()).save(any(User.class));
    }

    // Verifies that getUserById throws RuntimeException for unknown user IDs (CWE-20: no silent failures)
    @Test
    void getUserById_throwsException_whenUserNotFound() {
        when(userRepository.findById("user_unknown")).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            userService.getUserById("user_unknown");
        });

        assertEquals("User not found", exception.getMessage());
    }

    // Verifies that XP, level, and streak are correctly updated and persisted
    @Test
    void updateUserXpAndLevel_updatesAndSavesUser() {
        when(userRepository.findById("user_abc123")).thenReturn(Optional.of(existingUser));
        when(userRepository.save(any(User.class))).thenAnswer(i -> i.getArgument(0));

        User result = userService.updateUserXpAndLevel("user_abc123", 100, 2, 5);

        assertEquals(100, result.getXp());
        assertEquals(2, result.getLevel());
        assertEquals(5, result.getStreak());
        verify(userRepository, times(1)).save(existingUser);
    }

    // Verifies that XP defaults to 0 and level to 1 for a brand new user (valid initial state)
    @Test
    void newUser_hasCorrectDefaultValues() {
        User newUser = new User("user_fresh");
        assertEquals(0, newUser.getXp());
        assertEquals(1, newUser.getLevel());
        assertEquals(0, newUser.getStreak());
    }
}