package com.multifitaundh.controller;

import com.multifitaundh.dto.CreateTrialLeadRequest;
import com.multifitaundh.dto.TrialLeadDto;
import com.multifitaundh.service.TrialLeadService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/trials")
public class TrialLeadController {

    private final TrialLeadService trialLeadService;

    @Autowired
    public TrialLeadController(TrialLeadService trialLeadService) {
        this.trialLeadService = trialLeadService;
    }

    @PostMapping
    public ResponseEntity<TrialLeadDto> createTrialLead(@Valid @RequestBody CreateTrialLeadRequest request) {
        TrialLeadDto createdLead = trialLeadService.createTrialLead(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdLead);
    }
}