package com.multifitaundh.service;

import com.multifitaundh.dto.CreateTrialLeadRequest;
import com.multifitaundh.dto.TrialLeadDto;
import com.multifitaundh.model.TrialLead;
import com.multifitaundh.repository.TrialLeadRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;
import com.multifitaundh.service.NotificationService;

@Service
public class TrialLeadService {

    private final TrialLeadRepository trialLeadRepository;
    private final NotificationService notificationService;

    public TrialLeadService(TrialLeadRepository trialLeadRepository, NotificationService notificationService) {
        this.trialLeadRepository = trialLeadRepository;
        this.notificationService = notificationService;
    }

    public TrialLeadDto createTrialLead(CreateTrialLeadRequest request) {
        if (request.getName() == null || request.getName().isBlank()) {
            throw new IllegalArgumentException("Lead name cannot be null or empty.");
        }
        if (request.getEmail() == null || request.getEmail().isBlank()) {
            throw new IllegalArgumentException("Lead email cannot be null or empty.");
        }
        if (request.getPhone() == null || request.getPhone().isBlank()) {
            throw new IllegalArgumentException("Lead phone cannot be null or empty.");
        }

        TrialLead trialLead = new TrialLead();
        trialLead.setName(request.getName());
        trialLead.setEmail(request.getEmail());
        trialLead.setPhone(request.getPhone());

        TrialLead savedLead = trialLeadRepository.save(trialLead);

        TrialLeadDto trialLeadDto = TrialLeadDto.builder()
                .id(savedLead.getId())
                .name(savedLead.getName())
                .email(savedLead.getEmail())
                .phone(savedLead.getPhone())
                .createdAt(savedLead.getCreatedAt())
                .build();

        notificationService.sendNewLeadNotification(trialLeadDto);

        return trialLeadDto;
    }

    public List<TrialLeadDto> getAllTrialLeads() {
        List<TrialLead> trialLeads = trialLeadRepository.findAllByOrderByCreatedAtDesc();
        return trialLeads.stream()
                .map(lead -> TrialLeadDto.builder()
                        .id(lead.getId())
                        .name(lead.getName())
                        .email(lead.getEmail())
                        .phone(lead.getPhone())
                        .createdAt(lead.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }
}