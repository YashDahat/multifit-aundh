package com.multifitaundh.config;

import com.multifitaundh.model.Role;
import com.multifitaundh.model.User;
import com.multifitaundh.repository.UserRepository;
import com.multifitaundh.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class AdminInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(AdminInitializer.class);

    private final UserService userService;
    private final UserRepository userRepository;

    @Autowired
    public AdminInitializer(UserService userService, UserRepository userRepository) {
        this.userService = userService;
        this.userRepository = userRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.findByEmail("admin@multifit.com").isEmpty()) {
            User adminUser = new User("admin@multifit.com", "admin", Role.ADMIN);
            userService.saveUser(adminUser);
            log.info("Default admin user created.");
        } else {
            log.info("Default admin user already exists.");
        }
    }
}