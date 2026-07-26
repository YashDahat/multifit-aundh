package com.multifitaundh.config;

import com.multifitaundh.model.Role;
import com.multifitaundh.model.User;
import com.multifitaundh.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Seeds the single ADMIN user from the admin.email / admin.password properties (which carry
 * demo-safe defaults in application.properties). Idempotent — never creates a duplicate.
 * This is the ONLY user-seeding component; a business DataSeeder must seed domain content only.
 */
@Component
public class AdminInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${admin.email:owner@yourbusiness.com}")
    private String adminEmail;

    @Value("${admin.password:changeme123}")
    private String adminPassword;

    public AdminInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.findByEmail(adminEmail).isEmpty()) {
            userRepository.save(User.builder()
                    .firstName("Admin")
                    .lastName("User")
                    .email(adminEmail)
                    .password(passwordEncoder.encode(adminPassword))
                    .role(Role.ADMIN)
                    .build());
        }
    }
}
