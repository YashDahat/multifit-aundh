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
public class SubscriptionDto {
    private UUID id;
    private UUID userId;
    private String userEmail;
    private String planName;
    private java.time.LocalDate startDate;
    private java.time.LocalDate endDate;
    private String status;
}
