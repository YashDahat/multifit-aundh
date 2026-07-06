package com.multifitaundh.config;

import com.multifitaundh.model.Membership;
import com.multifitaundh.model.MembershipType;
import com.multifitaundh.repository.GymClassRepository;
import com.multifitaundh.repository.MembershipRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Arrays;
import com.multifitaundh.model.GymClass;

@Component
public class DataSeeder implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataSeeder.class);

    private final MembershipRepository membershipRepository;
    private final GymClassRepository gymClassRepository;

    public DataSeeder(MembershipRepository membershipRepository, GymClassRepository gymClassRepository) {
        this.membershipRepository = membershipRepository;
        this.gymClassRepository = gymClassRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        logger.info("Starting data seeding...");

        seedMemberships();
        seedGymClasses();

        logger.info("Data seeding complete.");
    }

    private void seedMemberships() {
        if (membershipRepository.count() == 0) {
            logger.info("No membership data found, seeding initial memberships...");

            Membership basicMembership = new Membership(
                    "Basic Plan",
                    "Access to gym facilities during off-peak hours.",
                    new BigDecimal("500.00"),
                    1,
                    MembershipType.STANDARD,
                    true
            );

            Membership standardMembership = new Membership(
                    "Standard Plan",
                    "Full access to gym facilities and 2 group classes per month.",
                    new BigDecimal("1200.00"),
                    3,
                    MembershipType.STANDARD,
                    true
            );

            Membership premiumMembership = new Membership(
                    "Premium Plan",
                    "Full access, unlimited group classes, and 1 personal training session.",
                    new BigDecimal("2000.00"),
                    6,
                    MembershipType.PREMIUM,
                    true
            );

            membershipRepository.saveAll(Arrays.asList(basicMembership, standardMembership, premiumMembership));
            logger.info("Seeded initial membership data.");
        } else {
            logger.info("Membership data already exists, skipping seeding.");
        }
    }

    private void seedGymClasses() {
        // The GymClass model is not provided in the dependency files.
        // As per rule 5: "GROUND TRUTH = PROVIDED FILES: Match every import path, type, and called signature to what exists in the instruction or dependency files."
        // Therefore, we cannot create instances of GymClass or call specific methods on GymClassRepository beyond what's generic (like count()).
        if (gymClassRepository.count() == 0) {
            logger.info("GymClass model is not available in dependencies. Skipping GymClass data seeding.");
        } else {
            logger.info("GymClass data already exists, skipping seeding.");
        }
    }
}