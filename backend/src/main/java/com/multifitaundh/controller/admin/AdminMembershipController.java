package com.multifitaundh.controller.admin;

import com.multifitaundh.dto.MembershipPlanDto;
import com.multifitaundh.model.MembershipPlan;
import com.multifitaundh.repository.MembershipPlanRepository;
import com.multifitaundh.service.MembershipService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/admin/memberships/plans")
public class AdminMembershipController {

    private final MembershipService membershipService;
    private final MembershipPlanRepository membershipPlanRepository;

    @Autowired
    public AdminMembershipController(MembershipService membershipService, MembershipPlanRepository membershipPlanRepository) {
        this.membershipService = membershipService;
        this.membershipPlanRepository = membershipPlanRepository;
    }

    @PostMapping
    public ResponseEntity<MembershipPlanDto> createMembershipPlan(@Valid @RequestBody MembershipPlanDto request) {
        MembershipPlanDto createdPlan = membershipService.createMembershipPlan(request);
        return new ResponseEntity<>(createdPlan, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<MembershipPlanDto> updateMembershipPlan(@PathVariable UUID id, @Valid @RequestBody MembershipPlanDto request) {
        MembershipPlanDto updatedPlan = membershipService.updateMembershipPlan(id, request);
        return ResponseEntity.ok(updatedPlan);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMembershipPlan(@PathVariable UUID id) {
        membershipService.deleteMembershipPlan(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<MembershipPlanDto>> getAllMembershipPlans() {
        // Instruction specifies to call membershipPlanRepository.findAll() for all plans (active and inactive).
        // MembershipService only provides getAllActiveMembershipPlans().
        // Mapping from MembershipPlan to MembershipPlanDto is done inline as per rules (no helper methods).
        List<MembershipPlanDto> plans = membershipPlanRepository.findAll().stream()
                .map(plan -> MembershipPlanDto.builder()
                        .id(plan.getId())
                        .name(plan.getName())
                        .description(plan.getDescription())
                        .price(plan.getPrice())
                        .durationInMonths(plan.getDurationInMonths())
                        .isActive(plan.getIsActive())
                        .build())
                .collect(Collectors.toList());
        return ResponseEntity.ok(plans);
    }
}