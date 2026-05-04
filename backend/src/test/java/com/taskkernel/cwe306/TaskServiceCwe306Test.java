package com.taskkernel.cwe306;

import com.taskkernel.entity.Task;
import com.taskkernel.repository.TaskRepository;
import com.taskkernel.service.TaskService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

/**
 * CWE-306 (production path): completion must not apply to another user's task.
 * (Teammate {@link com.taskkernel.service.UserServiceTest} stays unchanged for CWE-20.)
 */
@ExtendWith(MockitoExtension.class)
class TaskServiceCwe306Test {

    @Mock
    private TaskRepository taskRepository;

    @InjectMocks
    private TaskService taskService;

    @Test
    void setCompleted_forbiddenWhenTaskOwnedBySomeoneElse() {
        // Simulates a real database record where the task is owned by a different authenticated user.
        Task other = new Task();
        other.setId(5L);
        other.setUserId("user_owner");

        // Mock repository behavior: when task ID 5 is requested, return that foreign-owned task.
        when(taskRepository.findById(5L)).thenReturn(Optional.of(other));

        // Key CWE-306 assertion: an attacker completing another user's task must trigger FORBIDDEN (403), never succeed.
        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> taskService.setCompleted(5L, "user_attacker", true));
        // Confirms the backend returns exactly 403 FORBIDDEN (not 200 success and not 401 unauthenticated).
        assertEquals(HttpStatus.FORBIDDEN, ex.getStatusCode());
    }
}
