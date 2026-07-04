package com.multifitaundh.service;

import com.multifitaundh.repository.MembershipPlanRepository;
import com.multifitaundh.model.MembershipPlan;
import com.multifitaundh.dto.MembershipPlanDto;
import com.multifitaundh.dto.CreateMembershipPlanRequest;
import com.multifitaundh.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class MembershipPlanService {

    private final MembershipPlanRepository membershipPlanRepository;

    public MembershipPlanService(MembershipPlanRepository membershipPlanRepository) {
        this.membershipPlanRepository = membershipPlanRepository;
    }

    public List<MembershipPlanDto> getAllActivePlans() {
        return membershipPlanRepository.findAllByActiveTrue().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public List<MembershipPlanDto> getAllPlansForAdmin() {
        return membershipPlanRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public MembershipPlanDto createPlan(CreateMembershipPlanRequest request) {
        MembershipPlan membershipPlan = new MembershipPlan();
        membershipPlan.setName(request.getName());
        membershipPlan.setDescription(request.getDescription());
        membershipPlan.setPrice(request.getPrice());
        membershipPlan.setDurationInDays(request.getDurationInDays());
        membershipPlan.setActive(request.getActive());

        MembershipPlan savedPlan = membershipPlanRepository.save(membershipPlan);
        return mapToDto(savedPlan);
    }

    public MembershipPlanDto updatePlan(UUID id, CreateMembershipPlanRequest request) {
        MembershipPlan existingPlan = membershipPlanRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Membership plan not found with ID: " + id));

        existingPlan.setName(request.getName());
        existingPlan.setDescription(request.getDescription());
        existingPlan.setPrice(request.getPrice());
        existingPlan.setDurationInDays(request.getDurationInDays());
        existingPlan.setActive(request.getActive());

        MembershipPlan updatedPlan = membershipPlanRepository.save(existingPlan);
        return mapToDto(updatedPlan);
    }

    public void deletePlan(UUID id) {
        if (!membershipPlanRepository.existsById(id)) {
            throw new ResourceNotFoundException("Membership plan not found with ID: " + id);
        }
        membershipPlanRepository.deleteById(id);
    }

    private MembershipPlanDto mapToDto(MembershipPlan membershipPlan) {
        return MembershipPlanDto.builder()
                .id(membershipPlan.getId())
                .name(membershipPlan.getName())
                .description(membershipPlan.getDescription())
                .price(membershipPlan.getPrice())
                .durationInDays(membershipPlan.getDurationInDays())
                .build();
    }
}