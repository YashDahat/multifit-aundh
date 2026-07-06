package com.multifitaundh.controller;

import com.multifitaundh.model.TrialLead;
import com.multifitaundh.service.TrialLeadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/leads")
public class AdminTrialLeadController {

    @Autowired
    private TrialLeadService trialLeadService;

    @GetMapping("/trial")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<TrialLead>> getAllTrialLeads() {
        List<TrialLead> leads = trialLeadService.getAllTrialLeads();
        return ResponseEntity.ok(leads);
    }
}