package com.multifitaundh.controller;

import com.multifitaundh.dto.CreateTrialLeadRequest;
import com.multifitaundh.dto.TrialLeadDto;
import com.multifitaundh.service.TrialLeadService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/leads")
public class LeadController {

    private final TrialLeadService trialLeadService;

    public LeadController(TrialLeadService trialLeadService) {
        this.trialLeadService = trialLeadService;
    }

    @PostMapping("/trial")
    public ResponseEntity<TrialLeadDto> createTrialLead(@Valid @RequestBody CreateTrialLeadRequest request) {
        TrialLeadDto createdLead = trialLeadService.createTrialLead(request);
        return new ResponseEntity<>(createdLead, HttpStatus.CREATED);
    }
}