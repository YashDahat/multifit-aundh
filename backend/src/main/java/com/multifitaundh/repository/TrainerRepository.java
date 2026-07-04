package com.multifitaundh.repository;

import com.multifitaundh.model.Trainer;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface TrainerRepository extends JpaRepository<Trainer, UUID> {
    Optional<Trainer> findBySlug(String slug);
}