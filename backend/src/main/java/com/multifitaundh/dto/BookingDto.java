package com.multifitaundh.dto;

import jakarta.validation.constraints.*;
import java.util.List;
import java.util.UUID;
import java.time.LocalDateTime;
import java.time.LocalTime;
import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.multifitaundh.model.BookingStatus;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingDto {
    private UUID id;
    private UUID userId;
    private String userName;
    private UUID classScheduleId;
    private String className;
    private java.time.LocalDate scheduleDate;
    private LocalTime startTime;
    private LocalDateTime bookingTime;
    private BookingStatus status;
}
