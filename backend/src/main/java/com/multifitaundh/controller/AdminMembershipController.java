package com.multifitaundh.controller;

import com.multifitaundh.dto.MembershipPlanDto;
import com.multifitaundh.dto.SubscriptionDto;
import com.multifitaundh.service.MembershipService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin/memberships")
public class AdminMembershipController {

    private final MembershipService membershipService;

    public AdminMembershipController(MembershipService membershipService) {
        this.membershipService = membershipService;
    }

    @GetMapping("/plans")
    public ResponseEntity<List<MembershipPlanDto>> getMembershipPlans() {
        List<MembershipPlanDto> plans = membershipService.getAllPlans();
        return new ResponseEntity<>(plans, HttpStatus.OK);
    }

    @PostMapping("/plans")
    public ResponseEntity<MembershipPlanDto> createMembershipPlan(@Valid @RequestBody MembershipPlanDto membershipPlanDto) {
        MembershipPlanDto createdPlan = membershipService.createMembershipPlan(membershipPlanDto);
        return new ResponseEntity<>(createdPlan, HttpStatus.CREATED);
    }

    @PutMapping("/plans/{id}")
    public ResponseEntity<MembershipPlanDto> updateMembershipPlan(@PathVariable UUID id, @Valid @RequestBody MembershipPlanDto membershipPlanDto) {
        MembershipPlanDto updatedPlan = membershipService.updateMembershipPlan(id, membershipPlanDto);
        return new ResponseEntity<>(updatedPlan, HttpStatus.OK);
    }

    @DeleteMapping("/plans/{id}")
    public ResponseEntity<Void> deleteMembershipPlan(@PathVariable UUID id) {
        membershipService.deleteMembershipPlan(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/subscriptions")
    public ResponseEntity<List<SubscriptionDto>> getAllSubscriptions() {
        List<SubscriptionDto> subscriptions = membershipService.getAllSubscriptions();
        return new ResponseEntity<>(subscriptions, HttpStatus.OK);
    }
}