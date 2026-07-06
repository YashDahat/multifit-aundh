package com.multifitaundh.service;

import com.multifitaundh.model.TrialLead;
import com.multifitaundh.repository.TrialLeadRepository;
import com.multifitaundh.dto.CreateTrialLeadRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TrialLeadService {

    @Autowired
    private TrialLeadRepository trialLeadRepository;

    public TrialLead createTrialLead(CreateTrialLeadRequest request) {
        TrialLead trialLead = new TrialLead();
        trialLead.setName(request.getName());
        trialLead.setEmail(request.getEmail());
        trialLead.setPhone(request.getPhone());
        trialLead.setSubmissionDate(LocalDateTime.now());
        return trialLeadRepository.save(trialLead);
    }

    public List<TrialLead> getAllTrialLeads() {
        return trialLeadRepository.findAll();
    }
}