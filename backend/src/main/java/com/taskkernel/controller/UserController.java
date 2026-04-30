package com.taskkernel.controller;

import com.taskkernel.entity.User;
import com.taskkernel.service.UserService;
import com.taskkernel.util.ClerkAuthUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // GET /user/me — returns the logged-in user's profile data
    // Security: user ID is extracted from the JWT via ClerkAuthUtil, never from the request body
    // This ensures a user can only access their own data (prevents CWE-639)
    @GetMapping("/me")
    public ResponseEntity<User> getMe() {
        String clerkUserId = ClerkAuthUtil.getCurrentUserId();
        User user = userService.getOrCreateUser(clerkUserId);
        return ResponseEntity.ok(user);
    }
}