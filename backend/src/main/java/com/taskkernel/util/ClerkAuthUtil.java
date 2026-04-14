package com.taskkernel.util;

import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

/**
 * Utility to extract the Clerk user ID from the verified JWT.
 * Use this in ANY controller to scope queries to the logged-in user.
 *
 * Example usage in a controller:
 *
 *   String clerkUserId = ClerkAuthUtil.getCurrentUserId();
 *   List<Task> tasks = taskRepository.findByUserId(clerkUserId);
 */
public class ClerkAuthUtil {

    public static String getCurrentUserId() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth instanceof JwtAuthenticationToken jwtAuth) {
            Jwt jwt = jwtAuth.getToken();
            return jwt.getSubject(); // Clerk user ID, e.g. "user_2abc123xyz"
        }
        throw new IllegalStateException("No authenticated Clerk user found in security context");
    }
}