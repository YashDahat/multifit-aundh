package com.multifitaundh.controller;

import com.multifitaundh.dto.MembershipPlanDto;
import com.multifitaundh.service.MembershipService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin/memberships/plans")
public class AdminMembershipController {

    private final MembershipService membershipService;

    @Autowired
    public AdminMembershipController(MembershipService membershipService) {
        this.membershipService = membershipService;
    }

    @PostMapping
    public ResponseEntity<MembershipPlanDto> createMembershipPlan(@RequestBody MembershipPlanDto membershipPlanDto) {
        MembershipPlanDto createdPlan = membershipService.createMembershipPlan(membershipPlanDto);
        return new ResponseEntity<>(createdPlan, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<MembershipPlanDto> updateMembershipPlan(@PathVariable UUID id, @RequestBody MembershipPlanDto membershipPlanDto) {
        MembershipPlanDto updatedPlan = membershipService.updateMembershipPlan(id, membershipPlanDto);
        return ResponseEntity.ok(updatedPlan);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMembershipPlan(@PathVariable UUID id) {
        membershipService.deleteMembershipPlan(id);
        return ResponseEntity.noContent().build();
    }
}