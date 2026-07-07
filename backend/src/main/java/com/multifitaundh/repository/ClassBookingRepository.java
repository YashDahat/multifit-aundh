package com.multifitaundh.repository;

import com.multifitaundh.model.ClassBooking;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ClassBookingRepository extends JpaRepository<ClassBooking, UUID> {

    /**
     * Finds a class booking by user ID and gym class ID.
     * Used to check if a user has already booked a specific class.
     *
     * @param userId The ID of the user.
     * @param gymClassId The ID of the gym class.
     * @return An Optional containing the ClassBooking if found, otherwise empty.
     */
    Optional<ClassBooking> findByUser_IdAndGymClass_Id(Long userId, UUID gymClassId);

    /**
     * Finds all class bookings for a specific user.
     *
     * @param userId The ID of the user.
     * @return A list of ClassBooking entities for the given user.
     */
    List<ClassBooking> findByUser_Id(Long userId);

    /**
     * Finds all class bookings for a specific gym class.
     *
     * @param gymClassId The ID of the gym class.
     * @return A list of ClassBooking entities for the given gym class.
     */
    List<ClassBooking> findByGymClass_Id(UUID gymClassId);

    /**
     * Counts the number of bookings for a specific gym class with a given status.
     *
     * @param gymClassId The ID of the gym class.
     * @param status The booking status to count (e.g., CONFIRMED, CANCELLED).
     * @return The count of bookings matching the criteria.
     */
    int countByGymClass_IdAndStatus(UUID gymClassId, ClassBooking.BookingStatus status);
}