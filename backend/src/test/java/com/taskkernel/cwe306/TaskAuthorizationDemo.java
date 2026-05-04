package com.taskkernel.cwe306;

import java.util.HashMap;
import java.util.Map;

/**
 * Section 2 — Janeth Loera — <strong>CWE-306: Missing Authentication for Critical Function</strong>.
 * <p>
 * Toy model of the same rules enforced in production: (1) authenticate the caller,
 * (2) authorize against task ownership, (3) only then perform the critical action.
 * The live app uses Spring Security JWT + {@link com.taskkernel.service.TaskService} ownership checks.
 */
public final class TaskAuthorizationDemo {

    // Simulated task-ownership datastore (taskId -> ownerUserId); production uses a real PostgreSQL-backed table.
    private static final Map<Integer, Integer> TASK_OWNERS = new HashMap<>();

    static {
        TASK_OWNERS.put(1, 1001);
        TASK_OWNERS.put(2, 1002);
    }

    private TaskAuthorizationDemo() {}

    // Simulates JWT validation; in production the backend verifies Clerk session tokens and resolves the caller's user ID.
    /** Simulated JWT authentication — {@code null} means not authenticated. */
    public static Integer authenticateUser(String jwtToken) {
        if ("valid_jwt_token".equals(jwtToken)) {
            return 1001;
        }
        if ("valid_jwt_user_1002".equals(jwtToken)) {
            return 1002;
        }
        // CWE-306 fix: unauthenticated/invalid-token callers are rejected before reaching any critical function.
        return null;
    }

    // Authorization gate: authenticated users can complete only tasks they personally own.
    public static boolean canCompleteTask(Integer authenticatedUserId, int taskId) {
        if (authenticatedUserId == null) {
            return false;
        }
        Integer owner = TASK_OWNERS.get(taskId);
        // Ownership enforcement: caller userId must match the stored owner userId for this task.
        return owner != null && owner.equals(authenticatedUserId);
    }

    // Critical function gate: combines authentication + authorization before allowing task completion (CWE-306 requirement).
    public static String tryMarkComplete(String jwtToken, int taskId) {
        Integer authenticatedUserId = authenticateUser(jwtToken);
        if (authenticatedUserId == null) {
            // Blocks unauthenticated callers from invoking the critical completion action.
            return "Access denied: Authentication or authorization failed.";
        }
        if (!canCompleteTask(authenticatedUserId, taskId)) {
            // Blocks authenticated users who are not the owner of the target task.
            return "Access denied: Authentication or authorization failed.";
        }
        return "Task completed successfully.";
    }

    public static void main(String[] args) {
        Integer authenticatedUserId = authenticateUser("valid_jwt_token");
        int taskId = 1;
        if (authenticatedUserId != null && canCompleteTask(authenticatedUserId, taskId)) {
            System.out.println("Task completed successfully.");
        } else {
            System.out.println("Access denied: Authentication or authorization failed.");
        }
    }
}
