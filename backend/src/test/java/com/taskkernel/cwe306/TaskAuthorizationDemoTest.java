package com.taskkernel.cwe306;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

/** Phase 1 checks for the CWE-306 educational model ({@link TaskAuthorizationDemo}). */
class TaskAuthorizationDemoTest {

    @Test
    void unauthenticatedCallerCannotCompleteCriticalFunction() {
        assertEquals(
                "Access denied: Authentication or authorization failed.",
                TaskAuthorizationDemo.tryMarkComplete("invalid", 1)
        );
        assertFalse(TaskAuthorizationDemo.canCompleteTask(null, 1));
    }

    @Test
    void authenticatedOwnerMayComplete() {
        assertTrue(TaskAuthorizationDemo.canCompleteTask(1001, 1));
        assertEquals("Task completed successfully.", TaskAuthorizationDemo.tryMarkComplete("valid_jwt_token", 1));
    }

    @Test
    void authenticatedNonOwnerDenied() {
        assertFalse(TaskAuthorizationDemo.canCompleteTask(1001, 2));
        assertEquals(
                "Access denied: Authentication or authorization failed.",
                TaskAuthorizationDemo.tryMarkComplete("valid_jwt_token", 2)
        );
    }
}
