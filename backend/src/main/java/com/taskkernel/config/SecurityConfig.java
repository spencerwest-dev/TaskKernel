package com.taskkernel.config;

import com.taskkernel.entity.User;
import com.taskkernel.repository.UserRepository;
import com.taskkernel.security.TaskCompletionRateLimitFilter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtValidators;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.core.DelegatingOAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.OAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2TokenValidatorResult;
import org.springframework.security.oauth2.server.resource.web.authentication.BearerTokenAuthenticationFilter;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final UserRepository userRepository;
    private final TaskCompletionRateLimitFilter taskCompletionRateLimitFilter;
    private final String jwkSetUri;
    private final String issuer;
    private final String authorizedParty;
    private final String audience;

    public SecurityConfig(UserRepository userRepository,
                          TaskCompletionRateLimitFilter taskCompletionRateLimitFilter,
                          @Value("${spring.security.oauth2.resourceserver.jwt.jwk-set-uri}") String jwkSetUri,
                          @Value("${clerk.issuer:}") String issuer,
                          @Value("${clerk.authorized-party:}") String authorizedParty,
                          @Value("${clerk.audience:}") String audience) {
        this.userRepository = userRepository;
        this.taskCompletionRateLimitFilter = taskCompletionRateLimitFilter;
        this.jwkSetUri = jwkSetUri;
        this.issuer = issuer;
        this.authorizedParty = authorizedParty;
        this.audience = audience;
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
                .oauth2ResourceServer(oauth2 -> oauth2.jwt(Customizer.withDefaults()))
                .addFilterAfter(taskCompletionRateLimitFilter, BearerTokenAuthenticationFilter.class)
                .addFilterAfter(firstLoginFilter, TaskCompletionRateLimitFilter.class);

        return http.build();
    }

    @Bean
    public JwtDecoder jwtDecoder() {
        NimbusJwtDecoder decoder = NimbusJwtDecoder.withJwkSetUri(jwkSetUri).build();

        List<OAuth2TokenValidator<Jwt>> validators = new ArrayList<>();
        validators.add(hasText(issuer)
                ? JwtValidators.createDefaultWithIssuer(issuer)
                : JwtValidators.createDefault());

        if (hasText(authorizedParty)) {
            validators.add(jwt -> authorizedParty.equals(jwt.getClaimAsString("azp"))
                    ? OAuth2TokenValidatorResult.success()
                    : invalidToken("Invalid authorized party"));
        }

        if (hasText(audience)) {
            validators.add(jwt -> jwt.getAudience().contains(audience)
                    ? OAuth2TokenValidatorResult.success()
                    : invalidToken("Invalid audience"));
        }

        decoder.setJwtValidator(new DelegatingOAuth2TokenValidator<>(validators));
        return decoder;
    }

    private static boolean hasText(String value) {
        return value != null && !value.trim().isEmpty();
    }

    private static OAuth2TokenValidatorResult invalidToken(String description) {
        return OAuth2TokenValidatorResult.failure(
                new OAuth2Error("invalid_token", description, null)
        );
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
