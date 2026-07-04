package com.multifitaundh.controller;

import com.multifitaundh.service.MembershipPlanService;
import com.multifitaundh.dto.MembershipPlanDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/memberships")
public class MembershipPlanController {

    private final MembershipPlanService membershipPlanService;

    public MembershipPlanController(MembershipPlanService membershipPlanService) {
        this.membershipPlanService = membershipPlanService;
    }

    @GetMapping
    public ResponseEntity<List<MembershipPlanDto>> getActivePlans() {
        List<MembershipPlanDto> activePlans = membershipPlanService.getAllActivePlans();
        return ResponseEntity.ok(activePlans);
    }
}