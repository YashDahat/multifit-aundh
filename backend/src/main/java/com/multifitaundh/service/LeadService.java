package com.multifitaundh.service;

import com.multifitaundh.repository.TrialLeadRepository;
import com.multifitaundh.model.TrialLead;
import com.multifitaundh.dto.TrialLeadDto;
import com.multifitaundh.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class LeadService {

    private final TrialLeadRepository trialLeadRepository;

    @Autowired
    public LeadService(TrialLeadRepository trialLeadRepository) {
        this.trialLeadRepository = trialLeadRepository;
    }

    public TrialLeadDto captureTrialLead(TrialLeadDto leadDto) {
        TrialLead trialLead = new TrialLead();
        trialLead.setId(UUID.randomUUID());
        trialLead.setName(leadDto.getName());
        trialLead.setEmail(leadDto.getEmail());
        trialLead.setPhone(leadDto.getPhone());
        trialLead.setSubmissionDate(LocalDateTime.now());

        TrialLead savedLead = trialLeadRepository.save(trialLead);

        return TrialLeadDto.builder()
                .name(savedLead.getName())
                .email(savedLead.getEmail())
                .phone(savedLead.getPhone())
                .build();
    }

    public List<TrialLeadDto> getAllTrialLeads() {
        return trialLeadRepository.findAll().stream()
                .map(lead -> TrialLeadDto.builder()
                        .name(lead.getName())
                        .email(lead.getEmail())
                        .phone(lead.getPhone())
                        .build())
                .collect(Collectors.toList());
    }

    public TrialLeadDto getTrialLeadById(UUID id) {
        TrialLead trialLead = trialLeadRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Trial Lead not found with ID: " + id));

        return TrialLeadDto.builder()
                .name(trialLead.getName())
                .email(trialLead.getEmail())
                .phone(trialLead.getPhone())
                .build();
    }
}