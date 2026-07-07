package com.multifitaundh.controller;

import com.multifitaundh.dto.TrialLeadDto;
import com.multifitaundh.service.LeadService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/leads")
public class LeadController {

    private final LeadService leadService;

    @Autowired
    public LeadController(LeadService leadService) {
        this.leadService = leadService;
    }

    @PostMapping("/trial")
    public ResponseEntity<TrialLeadDto> submitTrialLead(@RequestBody @Valid TrialLeadDto leadDto) {
        TrialLeadDto capturedLead = leadService.captureTrialLead(leadDto);
        return new ResponseEntity<>(capturedLead, HttpStatus.CREATED);
    }
}