package com.multifitaundh.config;

import com.multifitaundh.model.MembershipPlan;
import com.multifitaundh.model.Trainer;
import com.multifitaundh.repository.MembershipPlanRepository;
import com.multifitaundh.repository.TrainerRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Autowired;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private MembershipPlanRepository membershipPlanRepository;

    @Autowired
    private TrainerRepository trainerRepository;

    @Override
    public void run(String... args) throws Exception {
        seedMembershipPlans();
        seedTrainers();
    }

    private void seedMembershipPlans() {
        if (membershipPlanRepository.count() == 0) {
            List<MembershipPlan> plans = new ArrayList<>();

            MembershipPlan plan1 = new MembershipPlan();
            plan1.setName("Monthly Pass");
            plan1.setDescription("Access to all gym facilities for one month.");
            plan1.setPrice(new BigDecimal("1500.00"));
            plan1.setDurationInDays(30);
            plan1.setActive(true);
            plans.add(plan1);

            MembershipPlan plan2 = new MembershipPlan();
            plan2.setName("Quarterly Premium");
            plan2.setDescription("Three months of full gym access, including 2 personal training sessions.");
            plan2.setPrice(new BigDecimal("4000.00"));
            plan2.setDurationInDays(90);
            plan2.setActive(true);
            plans.add(plan2);

            MembershipPlan plan3 = new MembershipPlan();
            plan3.setName("Annual Elite");
            plan3.setDescription("One year of unlimited access, 10 personal training sessions, and nutritional guidance.");
            plan3.setPrice(new BigDecimal("12000.00"));
            plan3.setDurationInDays(365);
            plan3.setActive(true);
            plans.add(plan3);

            MembershipPlan plan4 = new MembershipPlan();
            plan4.setName("Student Special");
            plan4.setDescription("Monthly access for students with valid ID.");
            plan4.setPrice(new BigDecimal("1000.00"));
            plan4.setDurationInDays(30);
            plan4.setActive(true);
            plans.add(plan4);

            MembershipPlan plan5 = new MembershipPlan();
            plan5.setName("Family Pack");
            plan5.setDescription("Quarterly access for a family of 4.");
            plan5.setPrice(new BigDecimal("7500.00"));
            plan5.setDurationInDays(90);
            plan5.setActive(true);
            plans.add(plan5);

            membershipPlanRepository.saveAll(plans);
        }
    }

    private void seedTrainers() {
        if (trainerRepository.count() == 0) {
            List<Trainer> trainers = new ArrayList<>();

            Trainer trainer1 = new Trainer();
            trainer1.setName("Rajesh Kumar");
            trainer1.setBio("Expert in strength training and bodybuilding.");
            trainer1.setSpecializations("Strength Training, Bodybuilding");
            trainer1.setImageUrl("https://multifitaundh.com/images/trainers/rajesh.jpg");
            trainers.add(trainer1);

            Trainer trainer2 = new Trainer();
            trainer2.setName("Priya Sharma");
            trainer2.setBio("Specializes in yoga, pilates, and flexibility.");
            trainer2.setSpecializations("Yoga, Pilates, Flexibility");
            trainer2.setImageUrl("https://multifitaundh.com/images/trainers/priya.jpg");
            trainers.add(trainer2);

            Trainer trainer3 = new Trainer();
            trainer3.setName("Vikram Singh");
            trainer3.setBio("Certified in functional training and HIIT.");
            trainer3.setSpecializations("Functional Training, HIIT, Cardio");
            trainer3.setImageUrl("https://multifitaundh.com/images/trainers/vikram.jpg");
            trainers.add(trainer3);

            Trainer trainer4 = new Trainer();
            trainer4.setName("Anjali Mehta");
            trainer4.setBio("Nutritionist and weight management coach.");
            trainer4.setSpecializations("Nutrition, Weight Loss, Diet Planning");
            trainer4.setImageUrl("https://multifitaundh.com/images/trainers/anjali.jpg");
            trainers.add(trainer4);

            Trainer trainer5 = new Trainer();
            trainer5.setName("Suresh Reddy");
            trainer5.setBio("Focuses on endurance training and marathon preparation.");
            trainer5.setSpecializations("Endurance, Marathon Prep, Crossfit");
            trainer5.setImageUrl("https://multifitaundh.com/images/trainers/suresh.jpg");
            trainers.add(trainer5);

            trainerRepository.saveAll(trainers);
        }
    }
}