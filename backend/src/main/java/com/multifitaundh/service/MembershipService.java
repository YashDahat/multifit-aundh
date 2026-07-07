package com.multifitaundh.service;

import com.multifitaundh.dto.MembershipPlanDto;
import com.multifitaundh.exception.ResourceNotFoundException;
import com.multifitaundh.model.MembershipPlan;
import com.multifitaundh.model.User;
import com.multifitaundh.model.UserMembership;
import com.multifitaundh.repository.MembershipPlanRepository;
import com.multifitaundh.repository.UserMembershipRepository;
import com.multifitaundh.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class MembershipService {

    private final MembershipPlanRepository membershipPlanRepository;
    private final UserMembershipRepository userMembershipRepository;
    private final UserRepository userRepository;

    @Autowired
    public MembershipService(MembershipPlanRepository membershipPlanRepository,
                             UserMembershipRepository userMembershipRepository,
                             UserRepository userRepository) {
        this.membershipPlanRepository = membershipPlanRepository;
        this.userMembershipRepository = userMembershipRepository;
        this.userRepository = userRepository;
    }

    // Implicit DTO for exposing user membership data
    public record UserMembershipDto(
            UUID id,
            Long userId,
            UUID membershipPlanId,
            String membershipPlanName,
            LocalDate startDate,
            LocalDate endDate,
            MembershipStatus status
    ) {}

    public List<MembershipPlanDto> getAllActiveMembershipPlans() {
        return membershipPlanRepository.findByIsActiveTrue().stream()
                .map(this::mapToMembershipPlanDto)
                .collect(Collectors.toList());
    }

    public MembershipPlanDto getMembershipPlanById(UUID id) {
        MembershipPlan membershipPlan = membershipPlanRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Membership Plan not found with ID: " + id));
        return mapToMembershipPlanDto(membershipPlan);
    }

    public MembershipPlanDto createMembershipPlan(MembershipPlanDto request) {
        MembershipPlan membershipPlan = new MembershipPlan();
        membershipPlan.setId(UUID.randomUUID());
        membershipPlan.setName(request.getName());
        membershipPlan.setDescription(request.getDescription());
        membershipPlan.setPrice(request.getPrice());
        membershipPlan.setDurationInMonths(request.getDurationInMonths());
        membershipPlan.setIsActive(request.getIsActive());
        MembershipPlan savedPlan = membershipPlanRepository.save(membershipPlan);
        return mapToMembershipPlanDto(savedPlan);
    }

    public MembershipPlanDto updateMembershipPlan(UUID id, MembershipPlanDto request) {
        MembershipPlan membershipPlan = membershipPlanRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Membership Plan not found with ID: " + id));

        membershipPlan.setName(request.getName());
        membershipPlan.setDescription(request.getDescription());
        membershipPlan.setPrice(request.getPrice());
        membershipPlan.setDurationInMonths(request.getDurationInMonths());
        membershipPlan.setIsActive(request.getIsActive());

        MembershipPlan updatedPlan = membershipPlanRepository.save(membershipPlan);
        return mapToMembershipPlanDto(updatedPlan);
    }

    public void deleteMembershipPlan(UUID id) {
        if (!membershipPlanRepository.existsById(id)) {
            throw new ResourceNotFoundException("Membership Plan not found with ID: " + id);
        }
        membershipPlanRepository.deleteById(id);
    }

    public UserMembershipDto purchaseMembership(Long userId, UUID planId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        MembershipPlan membershipPlan = membershipPlanRepository.findById(planId)
                .orElseThrow(() -> new ResourceNotFoundException("Membership Plan not found with ID: " + planId));

        userMembershipRepository.findByUser_IdAndStatus(userId, MembershipStatus.ACTIVE)
                .ifPresent(activeMembership -> {
                    throw new IllegalStateException("User already has an active membership.");
                });

        UserMembership userMembership = new UserMembership();
        userMembership.setId(UUID.randomUUID());
        userMembership.setUser(user);
        userMembership.setMembershipPlan(membershipPlan);
        userMembership.setStartDate(LocalDate.now());
        userMembership.setEndDate(LocalDate.now().plusMonths(membershipPlan.getDurationInMonths()));
        userMembership.setStatus(MembershipStatus.ACTIVE);

        UserMembership savedUserMembership = userMembershipRepository.save(userMembership);
        return mapToUserMembershipDto(savedUserMembership);
    }

    public Optional<UserMembershipDto> getUserActiveMembership(Long userId) {
        return userMembershipRepository.findByUser_IdAndStatus(userId, MembershipStatus.ACTIVE)
                .map(this::mapToUserMembershipDto);
    }

    private MembershipPlanDto mapToMembershipPlanDto(MembershipPlan membershipPlan) {
        return MembershipPlanDto.builder()
                .id(membershipPlan.getId())
                .name(membershipPlan.getName())
                .description(membershipPlan.getDescription())
                .price(membershipPlan.getPrice())
                .durationInMonths(membershipPlan.getDurationInMonths())
                .isActive(membershipPlan.getIsActive())
                .build();
    }

    private UserMembershipDto mapToUserMembershipDto(UserMembership userMembership) {
        return new UserMembershipDto(
                userMembership.getId(),
                userMembership.getUser().getId(),
                userMembership.getMembershipPlan().getId(),
                userMembership.getMembershipPlan().getName(),
                userMembership.getStartDate(),
                userMembership.getEndDate(),
                userMembership.getStatus()
        );
    }
}