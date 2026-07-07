package com.multifitaundh.repository;

import com.multifitaundh.model.TrialLead;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TrialLeadRepository extends JpaRepository<TrialLead, UUID> {}
