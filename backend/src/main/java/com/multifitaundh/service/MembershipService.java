package com.multifitaundh.service;

import com.multifitaundh.dto.CreateSubscriptionRequest;
import com.multifitaundh.dto.MembershipPlanDto;
import com.multifitaundh.dto.SubscriptionDto;
import com.multifitaundh.exception.ResourceNotFoundException;
import com.multifitaundh.model.MembershipPlan;
import com.multifitaundh.model.Subscription;
import com.multifitaundh.model.SubscriptionStatus;
import com.multifitaundh.model.User;
import com.multifitaundh.repository.MembershipPlanRepository;
import com.multifitaundh.repository.SubscriptionRepository;
import com.multifitaundh.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class MembershipService {

    private final MembershipPlanRepository membershipPlanRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final UserRepository userRepository;

    public MembershipService(MembershipPlanRepository membershipPlanRepository,
                             SubscriptionRepository subscriptionRepository,
                             UserRepository userRepository) {
        this.membershipPlanRepository = membershipPlanRepository;
        this.subscriptionRepository = subscriptionRepository;
        this.userRepository = userRepository;
    }

    public List<MembershipPlanDto> getAllPlans() {
        return membershipPlanRepository.findAll().stream()
                .map(this::mapToMembershipPlanDto)
                .collect(Collectors.toList());
    }

    public SubscriptionDto createSubscription(CreateSubscriptionRequest request, UserDetails currentUser) {
        MembershipPlan membershipPlan = membershipPlanRepository.findById(request.getPlanId())
                .orElseThrow(() -> new ResourceNotFoundException("Membership plan not found with ID: " + request.getPlanId()));

        User user = userRepository.findByEmail(currentUser.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + currentUser.getUsername()));

        LocalDate startDate = LocalDate.now();
        LocalDate endDate = startDate.plusDays(membershipPlan.getDurationInDays());

        Subscription subscription = new Subscription(user, membershipPlan, startDate, endDate, SubscriptionStatus.ACTIVE);
        Subscription savedSubscription = subscriptionRepository.save(subscription);

        return mapToSubscriptionDto(savedSubscription);
    }

    public MembershipPlanDto createMembershipPlan(MembershipPlanDto dto) {
        MembershipPlan membershipPlan = new MembershipPlan();
        membershipPlan.setName(dto.getName());
        membershipPlan.setDescription(dto.getDescription());
        membershipPlan.setPrice(dto.getPrice());
        membershipPlan.setDurationInDays(dto.getDurationInDays());

        MembershipPlan savedPlan = membershipPlanRepository.save(membershipPlan);
        return mapToMembershipPlanDto(savedPlan);
    }

    public MembershipPlanDto updateMembershipPlan(UUID id, MembershipPlanDto dto) {
        MembershipPlan membershipPlan = membershipPlanRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Membership plan not found with ID: " + id));

        membershipPlan.setName(dto.getName());
        membershipPlan.setDescription(dto.getDescription());
        membershipPlan.setPrice(dto.getPrice());
        membershipPlan.setDurationInDays(dto.getDurationInDays());

        MembershipPlan updatedPlan = membershipPlanRepository.save(membershipPlan);
        return mapToMembershipPlanDto(updatedPlan);
    }

    public void deleteMembershipPlan(UUID id) {
        if (!membershipPlanRepository.existsById(id)) {
            throw new ResourceNotFoundException("Membership plan not found with ID: " + id);
        }
        membershipPlanRepository.deleteById(id);
    }

    public List<SubscriptionDto> getAllSubscriptions() {
        return subscriptionRepository.findAll().stream()
                .map(this::mapToSubscriptionDto)
                .collect(Collectors.toList());
    }

    private MembershipPlanDto mapToMembershipPlanDto(MembershipPlan membershipPlan) {
        return MembershipPlanDto.builder()
                .id(membershipPlan.getId())
                .name(membershipPlan.getName())
                .description(membershipPlan.getDescription())
                .price(membershipPlan.getPrice())
                .durationInDays(membershipPlan.getDurationInDays())
                .build();
    }

    private SubscriptionDto mapToSubscriptionDto(Subscription subscription) {
        return SubscriptionDto.builder()
                .id(subscription.getId())
                .userId(subscription.getUser().getId())
                .userEmail(subscription.getUser().getEmail())
                .planName(subscription.getMembershipPlan().getName())
                .startDate(subscription.getStartDate())
                .endDate(subscription.getEndDate())
                .status(subscription.getStatus().name())
                .build();
    }
}