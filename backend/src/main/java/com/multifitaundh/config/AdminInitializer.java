package com.multifitaundh.config;

import com.multifitaundh.model.Role;
import com.multifitaundh.model.User;
import com.multifitaundh.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class AdminInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(AdminInitializer.class);

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    @Value("${admin.email}")
    private String adminEmail;

    @Value("${admin.password}")
    private String adminPassword;

    public AdminInitializer(UserRepository userRepository, BCryptPasswordEncoder bCryptPasswordEncoder) {
        this.userRepository = userRepository;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        userRepository.findByEmail(adminEmail).ifPresentOrElse(
            adminUser -> log.info("Default admin user with email {} already exists. No new user created.", adminEmail),
            () -> {
                User adminUser = new User();
                adminUser.setEmail(adminEmail);
                adminUser.setPassword(bCryptPasswordEncoder.encode(adminPassword));
                adminUser.setRole(Role.ADMIN);
                userRepository.save(adminUser);
                log.info("Default admin user with email {} created successfully.", adminEmail);
            }
        );
    }
}