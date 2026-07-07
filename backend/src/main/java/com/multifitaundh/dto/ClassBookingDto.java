package com.multifitaundh.dto;

import com.multifitaundh.model.ClassBooking;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClassBookingDto {
    private UUID id;
    private Long userId;
    private UUID gymClassId;
    private LocalDateTime bookingTime;
    private ClassBooking.BookingStatus status;
    private String gymClassName;
    private LocalDate gymClassDate;
    private LocalTime gymClassStartTime;
}
