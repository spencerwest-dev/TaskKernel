package com.taskkernel.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.concurrent.ConcurrentHashMap;

/**
 * CWE-306 / abuse mitigation: throttle POST and DELETE on {@code /tasks/{id}/complete} per authenticated user.
 * In-memory fixed window (no extra dependencies).
 */
@Component
@Order(Ordered.LOWEST_PRECEDENCE - 50)
public class TaskCompletionRateLimitFilter extends OncePerRequestFilter {

    private static final long WINDOW_MS = 60_000L;

    @Value("${cwe306.completion.rate-limit.enabled:true}")
    private boolean enabled;

    @Value("${cwe306.completion.rate-limit.per-minute:90}")
    private int maxPerMinute;

    private final ConcurrentHashMap<String, WindowCounter> counters = new ConcurrentHashMap<>();

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        if (!enabled) {
            return true;
        }
        String method = request.getMethod();
        if (!"POST".equals(method) && !"DELETE".equals(method)) {
            return true;
        }
        String path = request.getServletPath();
        return path == null || !path.matches("/tasks/\\d+/complete");
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                      HttpServletResponse response,
                                      FilterChain filterChain) throws ServletException, IOException {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (!(auth instanceof JwtAuthenticationToken jwtAuth)) {
            filterChain.doFilter(request, response);
            return;
        }
        String key = jwtAuth.getName();
        WindowCounter counter = counters.computeIfAbsent(key, k -> new WindowCounter());
        if (!counter.tryAcquire(maxPerMinute)) {
            response.setStatus(429);
            response.setContentType("application/json;charset=UTF-8");
            response.getWriter().write("{\"error\":\"Too many completion requests; try again later.\"}");
            return;
        }
        filterChain.doFilter(request, response);
    }

    private static final class WindowCounter {
        private long windowStartMillis;
        private int count;

        synchronized boolean tryAcquire(int max) {
            long now = System.currentTimeMillis();
            if (windowStartMillis == 0 || now - windowStartMillis > WINDOW_MS) {
                windowStartMillis = now;
                count = 1;
                return true;
            }
            count++;
            return count <= max;
        }
    }
}
