package com.multifitaundh.repository;

import com.multifitaundh.model.TrialLead;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface TrialLeadRepository extends JpaRepository<TrialLead, UUID> {
    List<TrialLead> findAllByOrderByCreatedAtDesc();
}