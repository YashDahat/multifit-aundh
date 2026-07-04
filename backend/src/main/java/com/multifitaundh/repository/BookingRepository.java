package com.multifitaundh.repository;

import com.multifitaundh.model.Booking;
import com.multifitaundh.model.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface BookingRepository extends JpaRepository<Booking, UUID> {
    long countByScheduleId(UUID scheduleId);
    List<Booking> findByUserId(UUID userId);
    Optional<Booking> findByUserIdAndScheduleIdAndStatus(UUID userId, UUID scheduleId, BookingStatus status);
}