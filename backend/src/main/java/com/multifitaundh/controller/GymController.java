package com.multifitaundh.controller;

import com.multifitaundh.dto.ClassScheduleDto;
import com.multifitaundh.dto.MembershipPlanDto;
import com.multifitaundh.service.SaaSIntegrationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/gym")
public class GymController {

    private final SaaSIntegrationService saaSIntegrationService;

    public GymController(SaaSIntegrationService saaSIntegrationService) {
        this.saaSIntegrationService = saaSIntegrationService;
    }

    @GetMapping("/memberships")
    public ResponseEntity<List<MembershipPlanDto>> getMembershipPlans() {
        try {
            List<MembershipPlanDto> plans = saaSIntegrationService.getMembershipPlans();
            return ResponseEntity.ok(plans);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/schedule")
    public ResponseEntity<List<ClassScheduleDto>> getClassSchedule() {
        try {
            List<ClassScheduleDto> schedule = saaSIntegrationService.getClassSchedule();
            return ResponseEntity.ok(schedule);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}