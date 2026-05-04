package com.taskkernel.cwe306;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

/** Phase 1 checks for the CWE-306 educational model ({@link TaskAuthorizationDemo}). */
class TaskAuthorizationDemoTest {

    // Proves the CWE-306 fix: invalid token callers are rejected and cannot complete critical actions.
    @Test
    void unauthenticatedCallerCannotCompleteCriticalFunction() {
        assertEquals(
                "Access denied: Authentication or authorization failed.",
                TaskAuthorizationDemo.tryMarkComplete("invalid", 1)
        );
        assertFalse(TaskAuthorizationDemo.canCompleteTask(null, 1));
    }

    // Proves the happy path: valid token + correct owner is allowed through.
    @Test
    void authenticatedOwnerMayComplete() {
        assertTrue(TaskAuthorizationDemo.canCompleteTask(1001, 1));
        assertEquals("Task completed successfully.", TaskAuthorizationDemo.tryMarkComplete("valid_jwt_token", 1));
    }

    // Proves ownership enforcement: a valid token alone is insufficient if the task belongs to another user.
    @Test
    void authenticatedNonOwnerDenied() {
        assertFalse(TaskAuthorizationDemo.canCompleteTask(1001, 2));
        assertEquals(
                "Access denied: Authentication or authorization failed.",
                TaskAuthorizationDemo.tryMarkComplete("valid_jwt_token", 2)
        );
    }
}
