package com.multifitaundh.config;

import com.multifitaundh.model.GymClass;
import com.multifitaundh.model.MembershipPlan;
import com.multifitaundh.model.Testimonial;
import com.multifitaundh.model.Trainer;
import com.multifitaundh.repository.GymClassRepository;
import com.multifitaundh.repository.MembershipPlanRepository;
import com.multifitaundh.repository.TestimonialRepository;
import com.multifitaundh.repository.TrainerRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.UUID;

@Component
public class DataSeeder implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataSeeder.class);

    private final MembershipPlanRepository membershipPlanRepository;
    private final TrainerRepository trainerRepository;
    private final GymClassRepository gymClassRepository;
    private final TestimonialRepository testimonialRepository;

    @Autowired
    public DataSeeder(MembershipPlanRepository membershipPlanRepository,
                      TrainerRepository trainerRepository,
                      GymClassRepository gymClassRepository,
                      TestimonialRepository testimonialRepository) {
        this.membershipPlanRepository = membershipPlanRepository;
        this.trainerRepository = trainerRepository;
        this.gymClassRepository = gymClassRepository;
        this.testimonialRepository = testimonialRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (membershipPlanRepository.count() > 0) {
            logger.info("Database already seeded. Skipping data seeding.");
            return;
        }

        logger.info("Seeding initial data...");

        // Seed Membership Plans
        MembershipPlan plan1 = new MembershipPlan();
        plan1.setName("Monthly Power Pass");
        plan1.setDescription("Access to all gym facilities and group classes for one month.");
        plan1.setPrice(new BigDecimal("2999.00"));
        plan1.setDurationInDays(30);
        membershipPlanRepository.save(plan1);

        MembershipPlan plan2 = new MembershipPlan();
        plan2.setName("Annual Elite Membership");
        plan2.setDescription("Unlock unlimited access, personal training sessions, and exclusive workshops for a year.");
        plan2.setPrice(new BigDecimal("29999.00"));
        plan2.setDurationInDays(365);
        membershipPlanRepository.save(plan2);

        MembershipPlan plan3 = new MembershipPlan();
        plan3.setName("Personal Training Package");
        plan3.setDescription("10 personalized 1-on-1 training sessions with our expert coaches.");
        plan3.setPrice(new BigDecimal("7500.00"));
        plan3.setDurationInDays(90);
        membershipPlanRepository.save(plan3);

        // Seed Trainers
        Trainer trainer1 = new Trainer(null, "Coach Rahul Sharma", "Strength & Conditioning",
                "Rahul is passionate about helping members achieve peak performance.",
                "https://images.unsplash.com/photo-1571019625454-f4437295052e?w=1920&q=80");
        trainerRepository.save(trainer1);

        Trainer trainer2 = new Trainer(null, "Trainer Priya Singh", "Yoga & Flexibility",
                "Priya brings calm and strength to every session, enhancing mind-body connection.",
                "https://images.unsplash.com/photo-1544367664-92e16d414e0b?w=1920&q=80");
        trainerRepository.save(trainer2);

        Trainer trainer3 = new Trainer(null, "Instructor Amit Kumar", "HIIT & Cardio",
                "Amit's high-energy classes push limits and deliver results.",
                "https://images.unsplash.com/photo-1590487903102-143d04730626?w=1920&q=80");
        trainerRepository.save(trainer3);

        // Seed Gym Classes
        GymClass gymClass1 = new GymClass(null, "High-Intensity Interval Training (HIIT)", "Burn maximum calories in minimum time.");
        gymClassRepository.save(gymClass1);

        GymClass gymClass2 = new GymClass(null, "Power Yoga", "Strengthen your core and improve flexibility.");
        gymClassRepository.save(gymClass2);

        GymClass gymClass3 = new GymClass(null, "Zumba Dance Fitness", "Dance your way to fitness with energetic routines.");
        gymClassRepository.save(gymClass3);

        // Seed Testimonials
        Testimonial testimonial1 = new Testimonial(null, "Anjali M.",
                "MultiFit Aundh has truly transformed my fitness journey! The trainers are incredibly supportive and the community is amazing. Highly recommend!", 5);
        testimonialRepository.save(testimonial1);

        Testimonial testimonial2 = new Testimonial(null, "Rohan S.",
                "I've never felt more energized and motivated. The variety of classes and state-of-the-art equipment make every workout exciting.", 4);
        testimonialRepository.save(testimonial2);

        Testimonial testimonial3 = new Testimonial(null, "Sneha P.",
                "Joining MultiFit Aundh was the best decision for my health. The personalized attention and positive environment are unmatched.", 5);
        testimonialRepository.save(testimonial3);

        logger.info("Database seeding complete.");
    }
}