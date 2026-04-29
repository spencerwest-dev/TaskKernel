package com.taskkernel.config;

import com.taskkernel.entity.User;
import com.taskkernel.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private UserRepository userRepository;

    /**
     * Spring Security filter chain.
     * - /health is public (Ben needs this for Render health checks)
     * - Everything else requires a valid Clerk JWT
     * - Sessions are stateless — Clerk handles auth state in the browser
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/health").permitAll()
                        .anyRequest().authenticated()
                )
                // Verifies Clerk JWTs using Clerk's JWKS endpoint.
                // Set CLERK_JWKS_URI in your environment variables on Render.
                // Format: https://<your-clerk-frontend-api>/.well-known/jwks.json
                .oauth2ResourceServer(oauth2 -> oauth2
                        .jwt(jwt -> {}) // JWKS URI is pulled from application.properties
                )
                // After JWT is verified, auto-create the user row if it's their first login
                .addFilterAfter(firstLoginFilter(), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    /**
     * After Clerk verifies the token, check if this Clerk user ID exists in our DB.
     * If not, create a new User row — this handles the "first login" case.
     *
     * This is YOUR Week 2 user scoping hook too — every downstream controller
     * can call getClerkUserId(request) to get the authenticated user's ID.
     */
    @Bean
    public OncePerRequestFilter firstLoginFilter() {
        return new OncePerRequestFilter() {
            @Override
            protected void doFilterInternal(HttpServletRequest request,
                                            HttpServletResponse response,
                                            FilterChain filterChain)
                    throws ServletException, IOException {

                // Only run for authenticated requests (JWT already verified by this point)
                var auth = org.springframework.security.core.context.SecurityContextHolder
                        .getContext().getAuthentication();

                if (auth instanceof JwtAuthenticationToken jwtAuth) {
                    Jwt jwt = jwtAuth.getToken();
                    String clerkUserId = jwt.getSubject(); // "sub" claim = Clerk user ID

                    // Auto-create user row on first login
                    if (!userRepository.existsById(clerkUserId)) {
                        userRepository.save(new User(clerkUserId));
                    }
                }

                filterChain.doFilter(request, response);
            }
        };
    }
}
