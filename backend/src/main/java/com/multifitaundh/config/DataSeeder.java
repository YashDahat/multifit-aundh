package com.multifitaundh.config;

import com.multifitaundh.model.GymClass;
import com.multifitaundh.model.MembershipPlan;
import com.multifitaundh.model.Trainer;
import com.multifitaundh.repository.GymClassRepository;
import com.multifitaundh.repository.MembershipPlanRepository;
import com.multifitaundh.repository.TrainerRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner initDatabase(MembershipPlanRepository membershipPlanRepository,
                                   TrainerRepository trainerRepository,
                                   GymClassRepository gymClassRepository) {
        return args -> {
            // Seed Membership Plans
            if (membershipPlanRepository.count() == 0) {
                MembershipPlan plan1 = new MembershipPlan();
                plan1.setName("Basic Monthly");
                plan1.setDescription("Access to gym facilities during off-peak hours.");
                plan1.setPrice(new BigDecimal("29.99"));
                plan1.setDurationInMonths(1);
                plan1.setActive(true);

                MembershipPlan plan2 = new MembershipPlan();
                plan2.setName("Premium Annual");
                plan2.setDescription("Full access to all gym facilities and classes, 24/7.");
                plan2.setPrice(new BigDecimal("299.99"));
                plan2.setDurationInMonths(12);
                plan2.setActive(true);

                MembershipPlan plan3 = new MembershipPlan();
                plan3.setName("Student Special");
                plan3.setDescription("Discounted access for students with valid ID.");
                plan3.setPrice(new BigDecimal("19.99"));
                plan3.setDurationInMonths(1);
                plan3.setActive(false); // Example of an inactive plan

                membershipPlanRepository.saveAll(Arrays.asList(plan1, plan2, plan3));
                System.out.println("Seeded Membership Plans.");
            }

            // Seed Trainers
            if (trainerRepository.count() == 0) {
                Trainer trainer1 = new Trainer(UUID.randomUUID(), "Alice Smith", "Yoga Instructor", "Alice is a certified yoga instructor with over 10 years of experience.", "https://example.com/alice.jpg");
                Trainer trainer2 = new Trainer(UUID.randomUUID(), "Bob Johnson", "Strength & Conditioning", "Bob specializes in helping clients build strength and improve overall fitness.", "https://example.com/bob.jpg");
                Trainer trainer3 = new Trainer(UUID.randomUUID(), "Charlie Brown", "Pilates & Core", "Charlie focuses on core strength and flexibility through Pilates.", "https://example.com/charlie.jpg");

                trainerRepository.saveAll(Arrays.asList(trainer1, trainer2, trainer3));
                System.out.println("Seeded Trainers.");

                // Seed Gym Classes (only if trainers are seeded)
                if (gymClassRepository.count() == 0) {
                    List<Trainer> trainers = trainerRepository.findAll();
                    if (!trainers.isEmpty()) {
                        GymClass class1 = new GymClass();
                        class1.setName("Morning Yoga Flow");
                        class1.setDescription("Start your day with a refreshing yoga session.");
                        class1.setDurationMinutes(60);
                        class1.setTrainer(trainers.get(0)); // Assign to Alice

                        GymClass class2 = new GymClass();
                        class2.setName("HIIT Blast");
                        class2.setDescription("High-intensity interval training for maximum calorie burn.");
                        class2.setDurationMinutes(45);
                        class2.setTrainer(trainers.get(1)); // Assign to Bob

                        GymClass class3 = new GymClass();
                        class3.setName("Pilates Core");
                        class3.setDescription("Strengthen your core and improve flexibility.");
                        class3.setDurationMinutes(55);
                        class3.setTrainer(trainers.get(2)); // Assign to Charlie

                        gymClassRepository.saveAll(Arrays.asList(class1, class2, class3));
                        System.out.println("Seeded Gym Classes.");
                    } else {
                        System.out.println("No trainers found to assign to gym classes. Skipping gym class seeding.");
                    }
                }
            }
        };
    }
}