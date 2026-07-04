package com.multifitaundh.controller;

import com.multifitaundh.dto.MembershipPlanDto;
import com.multifitaundh.service.MembershipService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/memberships")
public class MembershipController {

    private final MembershipService membershipService;

    public MembershipController(MembershipService membershipService) {
        this.membershipService = membershipService;
    }

    @GetMapping("/plans")
    public ResponseEntity<List<MembershipPlanDto>> getMembershipPlans() {
        List<MembershipPlanDto> plans = membershipService.getAllPlans();
        return ResponseEntity.ok(plans);
    }
}