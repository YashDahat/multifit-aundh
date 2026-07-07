package com.multifitaundh.repository;

import com.multifitaundh.model.GymClass;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public interface GymClassRepository extends JpaRepository<GymClass, UUID> {
    List<GymClass> findByDate(LocalDate date);
    List<GymClass> findByDateBetween(LocalDate startDate, LocalDate endDate);
}