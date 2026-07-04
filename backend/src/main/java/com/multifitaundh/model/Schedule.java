package com.multifitaundh.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.JoinColumn;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;
import com.multifitaundh.model.GymClass;
import com.multifitaundh.model.Trainer;

@Entity
@Table(name = "schedules")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Schedule {

    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne
    @JoinColumn(nullable = false)
    private GymClass gymClass;

    @ManyToOne
    @JoinColumn(nullable = false)
    private Trainer trainer;

    private LocalDateTime startTime;

    private LocalDateTime endTime;

    private Integer capacity;
}