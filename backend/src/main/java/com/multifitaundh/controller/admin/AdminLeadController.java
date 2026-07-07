package com.multifitaundh.controller.admin;

import com.multifitaundh.service.LeadService;
import com.multifitaundh.dto.TrialLeadDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin/leads/trial")
public class AdminLeadController {

    private final LeadService leadService;

    @Autowired
    public AdminLeadController(LeadService leadService) {
        this.leadService = leadService;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<TrialLeadDto>> getAllTrialLeads() {
        List<TrialLeadDto> leads = leadService.getAllTrialLeads();
        return ResponseEntity.ok(leads);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TrialLeadDto> getTrialLeadById(@PathVariable UUID id) {
        TrialLeadDto lead = leadService.getTrialLeadById(id);
        return ResponseEntity.ok(lead);
    }
}