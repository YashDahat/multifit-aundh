package com.multifitaundh.repository;

import com.multifitaundh.model.ClassSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public interface ClassScheduleRepository extends JpaRepository<ClassSchedule, UUID> {
    List<ClassSchedule> findByScheduleDate(LocalDate scheduleDate);
    List<ClassSchedule> findByScheduleDateBetween(LocalDate startDate, LocalDate endDate);
}