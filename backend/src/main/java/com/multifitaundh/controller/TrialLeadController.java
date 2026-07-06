package com.multifitaundh.controller;

import com.multifitaundh.dto.CreateTrialLeadRequest;
import com.multifitaundh.model.TrialLead;
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
@RequestMapping("/api/v1/leads/trial")
public class TrialLeadController {

    @Autowired
    private TrialLeadService trialLeadService;

    @PostMapping
    public ResponseEntity<TrialLead> submitTrialLead(@Valid @RequestBody CreateTrialLeadRequest request) {
        TrialLead createdLead = trialLeadService.createTrialLead(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdLead);
    }
}