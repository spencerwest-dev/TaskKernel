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

    private static final Map<Integer, Integer> TASK_OWNERS = new HashMap<>();

    static {
        TASK_OWNERS.put(1, 1001);
        TASK_OWNERS.put(2, 1002);
    }

    private TaskAuthorizationDemo() {}

    /** Simulated JWT authentication — {@code null} means not authenticated. */
    public static Integer authenticateUser(String jwtToken) {
        if ("valid_jwt_token".equals(jwtToken)) {
            return 1001;
        }
        if ("valid_jwt_user_1002".equals(jwtToken)) {
            return 1002;
        }
        return null;
    }

    public static boolean canCompleteTask(Integer authenticatedUserId, int taskId) {
        if (authenticatedUserId == null) {
            return false;
        }
        Integer owner = TASK_OWNERS.get(taskId);
        return owner != null && owner.equals(authenticatedUserId);
    }

    public static String tryMarkComplete(String jwtToken, int taskId) {
        Integer authenticatedUserId = authenticateUser(jwtToken);
        if (authenticatedUserId == null) {
            return "Access denied: Authentication or authorization failed.";
        }
        if (!canCompleteTask(authenticatedUserId, taskId)) {
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
