package com.multifitaundh.dto;

import jakarta.validation.constraints.*;
import java.util.List;
import java.util.UUID;
import java.time.LocalDateTime;
import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClassScheduleDto {
    private String id;
    private String className;
    private String startTime;
    private Integer durationMinutes;
    private String trainerName;
    private String bookingUrl;
}
