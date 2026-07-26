package com.multifitaundh.service;

import com.multifitaundh.dto.MembershipPlanDto;
import com.multifitaundh.exception.ResourceNotFoundException;
import com.multifitaundh.model.MemberSubscription;
import com.multifitaundh.model.MembershipPlan;
import com.multifitaundh.repository.MemberSubscriptionRepository;
import com.multifitaundh.repository.MembershipPlanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import com.multifitaundh.service.PaymentService;

@Service
public class MembershipService {

    private final MembershipPlanRepository membershipPlanRepository;
    private final MemberSubscriptionRepository memberSubscriptionRepository;
    // private final PaymentService paymentService; // Assuming PaymentService is pre-scaffolded

    @Autowired
    public MembershipService(MembershipPlanRepository membershipPlanRepository,
                             MemberSubscriptionRepository memberSubscriptionRepository
                             /*, PaymentService paymentService*/) {
        this.membershipPlanRepository = membershipPlanRepository;
        this.memberSubscriptionRepository = memberSubscriptionRepository;
        // this.paymentService = paymentService;
    }

    public List<MembershipPlanDto> getAllActiveMembershipPlans() {
        return membershipPlanRepository.findByIsActiveTrue().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public MembershipPlanDto getMembershipPlanById(UUID id) {
        MembershipPlan membershipPlan = membershipPlanRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Membership Plan not found with ID: " + id));
        return convertToDto(membershipPlan);
    }

    public MemberSubscription createSubscription(UUID userId, UUID membershipPlanId) {
        MembershipPlan membershipPlan = membershipPlanRepository.findById(membershipPlanId)
                .orElseThrow(() -> new ResourceNotFoundException("Membership Plan not found with ID: " + membershipPlanId));

        LocalDate startDate = LocalDate.now();
        LocalDate endDate = startDate.plusMonths(membershipPlan.getDurationInMonths());

        MemberSubscription subscription = new MemberSubscription();
        subscription.setUserId(userId);
        subscription.setMembershipPlan(membershipPlan);
        subscription.setStartDate(startDate);
        subscription.setEndDate(endDate);
        subscription.setStatus(MemberSubscription.SubscriptionStatus.ACTIVE);

        // Integrate with PaymentService here if needed
        // paymentService.processPayment(userId, membershipPlan.getPrice());

        return memberSubscriptionRepository.save(subscription);
    }

    public MembershipPlanDto createMembershipPlan(MembershipPlanDto membershipPlanDto) {
        MembershipPlan membershipPlan = convertToEntity(membershipPlanDto);
        membershipPlan.setActive(true); // New plans are active by default
        MembershipPlan savedPlan = membershipPlanRepository.save(membershipPlan);
        return convertToDto(savedPlan);
    }

    public MembershipPlanDto updateMembershipPlan(UUID id, MembershipPlanDto membershipPlanDto) {
        MembershipPlan existingPlan = membershipPlanRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Membership Plan not found with ID: " + id));

        existingPlan.setName(membershipPlanDto.getName());
        existingPlan.setDescription(membershipPlanDto.getDescription());
        existingPlan.setPrice(membershipPlanDto.getPrice());
        existingPlan.setDurationInMonths(membershipPlanDto.getDurationInMonths());
        existingPlan.setActive(membershipPlanDto.getIsActive());

        MembershipPlan updatedPlan = membershipPlanRepository.save(existingPlan);
        return convertToDto(updatedPlan);
    }

    public void deleteMembershipPlan(UUID id) {
        if (!membershipPlanRepository.existsById(id)) {
            throw new ResourceNotFoundException("Membership Plan not found with ID: " + id);
        }
        membershipPlanRepository.deleteById(id);
    }

    private MembershipPlanDto convertToDto(MembershipPlan membershipPlan) {
        return MembershipPlanDto.builder()
                .id(membershipPlan.getId())
                .name(membershipPlan.getName())
                .description(membershipPlan.getDescription())
                .price(membershipPlan.getPrice())
                .durationInMonths(membershipPlan.getDurationInMonths())
                .isActive(membershipPlan.isActive())
                .build();
    }

    private MembershipPlan convertToEntity(MembershipPlanDto membershipPlanDto) {
        MembershipPlan membershipPlan = new MembershipPlan();
        membershipPlan.setId(membershipPlanDto.getId()); // ID might be null for new plans
        membershipPlan.setName(membershipPlanDto.getName());
        membershipPlan.setDescription(membershipPlanDto.getDescription());
        membershipPlan.setPrice(membershipPlanDto.getPrice());
        membershipPlan.setDurationInMonths(membershipPlanDto.getDurationInMonths());
        membershipPlan.setActive(membershipPlanDto.getIsActive() != null ? membershipPlanDto.getIsActive() : true);
        return membershipPlan;
    }
}