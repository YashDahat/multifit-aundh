package com.multifitaundh.config;

import com.multifitaundh.model.GymClass;
import com.multifitaundh.model.MembershipPlan;
import com.multifitaundh.model.Role;
import com.multifitaundh.model.Testimonial;
import com.multifitaundh.model.Trainer;
import com.multifitaundh.model.TrialLead;
import com.multifitaundh.model.User;
import com.multifitaundh.repository.GymClassRepository;
import com.multifitaundh.repository.MembershipPlanRepository;
import com.multifitaundh.repository.TestimonialRepository;
import com.multifitaundh.repository.TrainerRepository;
import com.multifitaundh.repository.TrialLeadRepository;
import com.multifitaundh.service.UserService;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder; // Injected but not directly used here as userService handles encoding
    private final MembershipPlanRepository membershipPlanRepository;
    private final GymClassRepository gymClassRepository;
    private final TrainerRepository trainerRepository;
    private final TestimonialRepository testimonialRepository;
    private final TrialLeadRepository trialLeadRepository;

    @Autowired
    public DataSeeder(UserService userService,
                      PasswordEncoder passwordEncoder,
                      MembershipPlanRepository membershipPlanRepository,
                      GymClassRepository gymClassRepository,
                      TrainerRepository trainerRepository,
                      TestimonialRepository testimonialRepository,
                      TrialLeadRepository trialLeadRepository) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
        this.membershipPlanRepository = membershipPlanRepository;
        this.gymClassRepository = gymClassRepository;
        this.trainerRepository = trainerRepository;
        this.testimonialRepository = testimonialRepository;
        this.trialLeadRepository = trialLeadRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        // Seed a default non-admin user if not exists
        try {
            userService.loadUserByUsername("user@example.com");
        } catch (UsernameNotFoundException e) {
            User user = new User("user@example.com", "password", Role.USER);
            userService.saveUser(user); // Password will be encoded by userService.saveUser
            System.out.println("Default user created: user@example.com");
        }

        // Seed Membership Plans
        if (membershipPlanRepository.count() == 0) {
            MembershipPlan p1 = new MembershipPlan(); p1.setName("Basic Plan"); p1.setDescription("Access to gym facilities during off-peak hours."); p1.setPrice(new java.math.BigDecimal("29.99")); p1.setDurationInMonths(1); p1.setIsActive(true);
            MembershipPlan p2 = new MembershipPlan(); p2.setName("Standard Plan"); p2.setDescription("Full access to gym facilities and 2 group classes per month."); p2.setPrice(new java.math.BigDecimal("49.99")); p2.setDurationInMonths(3); p2.setIsActive(true);
            MembershipPlan p3 = new MembershipPlan(); p3.setName("Premium Plan"); p3.setDescription("Full access, unlimited group classes, and 1 personal training session."); p3.setPrice(new java.math.BigDecimal("79.99")); p3.setDurationInMonths(6); p3.setIsActive(true);
            MembershipPlan p4 = new MembershipPlan(); p4.setName("Annual Plan"); p4.setDescription("Premium plan benefits for a full year at a discounted rate."); p4.setPrice(new java.math.BigDecimal("799.99")); p4.setDurationInMonths(12); p4.setIsActive(true);
            List<MembershipPlan> plans = Arrays.asList(p1, p2, p3, p4);
            membershipPlanRepository.saveAll(plans);
            System.out.println("Seeded " + plans.size() + " membership plans.");
        }

        // Seed Trainers
        if (trainerRepository.count() == 0) {
            Trainer trainer1 = new Trainer(UUID.randomUUID(), "John Doe", "Strength Training", "Certified strength and conditioning specialist with 10 years experience.", null);
            Trainer trainer2 = new Trainer(UUID.randomUUID(), "Jane Smith", "Yoga & Flexibility", "Experienced yoga instructor focusing on holistic wellness.", null);
            Trainer trainer3 = new Trainer(UUID.randomUUID(), "Mike Johnson", "Cardio & HIIT", "High-intensity interval training expert, helping clients achieve peak fitness.", null);

            List<Trainer> trainers = Arrays.asList(trainer1, trainer2, trainer3);
            trainerRepository.saveAll(trainers);
            System.out.println("Seeded " + trainers.size() + " trainers.");

            // Seed Gym Classes (using the seeded trainers)
            if (gymClassRepository.count() == 0) {
                List<GymClass> classes = Arrays.asList(
                    new GymClass("Morning Yoga", "Start your day with a calming yoga session.", LocalDate.now().plusDays(1), LocalTime.of(7, 0), LocalTime.of(8, 0), 20, trainer2),
                    new GymClass("HIIT Blast", "High-intensity interval training for maximum calorie burn.", LocalDate.now().plusDays(1), LocalTime.of(18, 0), LocalTime.of(19, 0), 20, trainer3),
                    new GymClass("Strength & Core", "Build strength and improve core stability.", LocalDate.now().plusDays(2), LocalTime.of(10, 0), LocalTime.of(11, 0), 15, trainer1),
                    new GymClass("Evening Stretch", "Relax and unwind with a gentle stretching class.", LocalDate.now().plusDays(2), LocalTime.of(19, 30), LocalTime.of(20, 30), 25, trainer2)
                );
                gymClassRepository.saveAll(classes);
                System.out.println("Seeded " + classes.size() + " gym classes.");
            }
        }

        // Seed Testimonials
        if (testimonialRepository.count() == 0) {
            List<Testimonial> testimonials = Arrays.asList(
                new Testimonial(UUID.randomUUID(), "Alice Wonderland", "MultiFit Aundh has transformed my fitness journey! The trainers are amazing and the facilities are top-notch.", 5),
                new Testimonial(UUID.randomUUID(), "Bob The Builder", "Great gym with a friendly atmosphere. I've seen significant improvements in my strength since joining.", 4),
                new Testimonial(UUID.randomUUID(), "Charlie Chaplin", "The yoga classes are fantastic. Jane Smith is an incredible instructor.", 5)
            );
            testimonialRepository.saveAll(testimonials);
            System.out.println("Seeded " + testimonials.size() + " testimonials.");
        }

        // Seed Trial Leads
        if (trialLeadRepository.count() == 0) {
            List<TrialLead> leads = Arrays.asList(
                new TrialLead(UUID.randomUUID(), "David Lee", "david.lee@example.com", "123-456-7890", LocalDate.now().plusDays(7).atStartOfDay()),
                new TrialLead(UUID.randomUUID(), "Eve Adams", "eve.adams@example.com", "098-765-4321", LocalDate.now().plusDays(10).atStartOfDay())
            );
            trialLeadRepository.saveAll(leads);
            System.out.println("Seeded " + leads.size() + " trial leads.");
        }
    }
}