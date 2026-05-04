package com.taskkernel.config;

import com.taskkernel.entity.User;
import com.taskkernel.repository.UserRepository;
import com.taskkernel.security.TaskCompletionRateLimitFilter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.web.authentication.BearerTokenAuthenticationFilter;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final UserRepository userRepository;
    private final TaskCompletionRateLimitFilter taskCompletionRateLimitFilter;

    public SecurityConfig(UserRepository userRepository,
                          TaskCompletionRateLimitFilter taskCompletionRateLimitFilter) {
        this.userRepository = userRepository;
        this.taskCompletionRateLimitFilter = taskCompletionRateLimitFilter;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http,
                                           @Qualifier("firstLoginOncePerRequestFilter") OncePerRequestFilter firstLoginFilter)
            throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/health").permitAll()
                        .anyRequest().authenticated()
                )
                .oauth2ResourceServer(oauth2 -> oauth2.jwt(jwt -> {}))
                .addFilterAfter(taskCompletionRateLimitFilter, BearerTokenAuthenticationFilter.class)
                .addFilterAfter(firstLoginFilter, TaskCompletionRateLimitFilter.class);

        return http.build();
    }

    @Bean("firstLoginOncePerRequestFilter")
    public OncePerRequestFilter firstLoginOncePerRequestFilter() {
        return new OncePerRequestFilter() {
            @Override
            protected void doFilterInternal(HttpServletRequest request,
                                            HttpServletResponse response,
                                            FilterChain filterChain)
                    throws ServletException, IOException {

                var auth = org.springframework.security.core.context.SecurityContextHolder
                        .getContext().getAuthentication();

                if (auth instanceof JwtAuthenticationToken jwtAuth) {
                    Jwt jwt = jwtAuth.getToken();
                    String clerkUserId = jwt.getSubject();

                    if (!userRepository.existsById(clerkUserId)) {
                        userRepository.save(new User(clerkUserId));
                    }
                }

                filterChain.doFilter(request, response);
            }
        };
    }
}
