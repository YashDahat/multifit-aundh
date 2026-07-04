package com.multifitaundh.controller;

import com.multifitaundh.service.MembershipPlanService;
import com.multifitaundh.dto.MembershipPlanDto;
import com.multifitaundh.dto.CreateMembershipPlanRequest;
import com.multifitaundh.exception.ResourceNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin/memberships")
public class AdminMembershipPlanController {

    private final MembershipPlanService membershipPlanService;

    public AdminMembershipPlanController(MembershipPlanService membershipPlanService) {
        this.membershipPlanService = membershipPlanService;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<MembershipPlanDto>> getAllPlansForAdmin() {
        List<MembershipPlanDto> plans = membershipPlanService.getAllPlansForAdmin();
        return ResponseEntity.ok(plans);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MembershipPlanDto> createPlan(@Valid @RequestBody CreateMembershipPlanRequest request) {
        MembershipPlanDto createdPlan = membershipPlanService.createPlan(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdPlan);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MembershipPlanDto> updatePlan(@PathVariable UUID id, @Valid @RequestBody CreateMembershipPlanRequest request) {
        try {
            MembershipPlanDto updatedPlan = membershipPlanService.updatePlan(id, request);
            return ResponseEntity.ok(updatedPlan);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deletePlan(@PathVariable UUID id) {
        try {
            membershipPlanService.deletePlan(id);
            return ResponseEntity.noContent().build();
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }
}