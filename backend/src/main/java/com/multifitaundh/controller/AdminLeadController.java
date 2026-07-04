package com.multifitaundh.controller;

import com.multifitaundh.dto.TrialLeadDto;
import com.multifitaundh.service.TrialLeadService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/leads")
public class AdminLeadController {

    private final TrialLeadService trialLeadService;

    public AdminLeadController(TrialLeadService trialLeadService) {
        this.trialLeadService = trialLeadService;
    }

    @GetMapping("/trial")
    public ResponseEntity<List<TrialLeadDto>> getAllTrialLeads() {
        List<TrialLeadDto> leads = trialLeadService.getAllTrialLeads();
        return new ResponseEntity<>(leads, HttpStatus.OK);
    }
}