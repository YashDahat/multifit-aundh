package com.multifitaundh.config;

import com.multifitaundh.model.User;
import com.multifitaundh.model.Role;
import com.multifitaundh.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component
public class AdminInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(AdminInitializer.class);

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    @Autowired
    public AdminInitializer(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        Optional<User> adminUserOptional = userRepository.findByEmail("admin@multifitaundh.com");

        if (adminUserOptional.isEmpty()) {
            User adminUser = new User();
            adminUser.setEmail("admin@multifitaundh.com");
            adminUser.setPassword(passwordEncoder.encode("admin123"));
            adminUser.setFirstName("Admin");
            adminUser.setLastName("User");

            Set<Role> roles = new HashSet<>();
            roles.add(Role.ROLE_ADMIN);
            adminUser.setRoles(roles);

            userRepository.save(adminUser);
            logger.info("Default admin user created with email: admin@multifitaundh.com");
        } else {
            logger.info("Default admin user already exists.");
        }
    }
}