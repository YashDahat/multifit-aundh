package com.multifitaundh.controller;

import com.multifitaundh.dto.MembershipPlanDto;
import com.multifitaundh.model.User;
import com.multifitaundh.service.MembershipService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/memberships")
public class MembershipController {

    private final MembershipService membershipService;

    @Autowired
    public MembershipController(MembershipService membershipService) {
        this.membershipService = membershipService;
    }

    @GetMapping("/plans")
    public ResponseEntity<List<MembershipPlanDto>> getAllActiveMembershipPlans() {
        List<MembershipPlanDto> plans = membershipService.getAllActiveMembershipPlans();
        return ResponseEntity.ok(plans);
    }

    @GetMapping("/plans/{id}")
    public ResponseEntity<MembershipPlanDto> getMembershipPlanById(@PathVariable UUID id) {
        MembershipPlanDto plan = membershipService.getMembershipPlanById(id);
        return ResponseEntity.ok(plan);
    }

    @PostMapping("/purchase/{planId}")
    public ResponseEntity<UserMembershipDto> purchaseMembership(
            @AuthenticationPrincipal User user,
            @PathVariable UUID planId) {
        UserMembershipDto userMembership = membershipService.purchaseMembership(user.getId(), planId);
        return ResponseEntity.status(HttpStatus.CREATED).body(userMembership);
    }

    @GetMapping("/my-membership")
    public ResponseEntity<UserMembershipDto> getMyActiveMembership(
            @AuthenticationPrincipal User user) {
        Optional<UserMembershipDto> userMembership = membershipService.getUserActiveMembership(user.getId());
        return userMembership.map(ResponseEntity::ok)
                             .orElseGet(() -> ResponseEntity.noContent().build());
    }
}