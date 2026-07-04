package com.multifitaundh.service;

import com.multifitaundh.dto.CreateTrialLeadRequest;
import com.multifitaundh.dto.TrialLeadDto;
import com.multifitaundh.model.TrialLead;
import com.multifitaundh.repository.TrialLeadRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TrialLeadService {

    private final TrialLeadRepository trialLeadRepository;

    @Autowired
    public TrialLeadService(TrialLeadRepository trialLeadRepository) {
        this.trialLeadRepository = trialLeadRepository;
    }

    public TrialLeadDto createTrialLead(CreateTrialLeadRequest request) {
        TrialLead trialLead = new TrialLead();
        trialLead.setName(request.getName());
        trialLead.setEmail(request.getEmail());
        trialLead.setPhone(request.getPhone());
        trialLead.setSubmittedAt(LocalDateTime.now());

        TrialLead savedLead = trialLeadRepository.save(trialLead);

        return TrialLeadDto.builder()
                .id(savedLead.getId())
                .name(savedLead.getName())
                .email(savedLead.getEmail())
                .phone(savedLead.getPhone())
                .submittedAt(savedLead.getSubmittedAt())
                .build();
    }

    public List<TrialLeadDto> getAllTrialLeads() {
        return trialLeadRepository.findAllByOrderBySubmittedAtDesc().stream()
                .map(lead -> TrialLeadDto.builder()
                        .id(lead.getId())
                        .name(lead.getName())
                        .email(lead.getEmail())
                        .phone(lead.getPhone())
                        .submittedAt(lead.getSubmittedAt())
                        .build())
                .collect(Collectors.toList());
    }
}