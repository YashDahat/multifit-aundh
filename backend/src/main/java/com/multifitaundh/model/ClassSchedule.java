package com.multifitaundh.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;
import com.multifitaundh.model.GymClass;

@Entity
@Table(name = "class_schedule")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClassSchedule {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "gym_class_id", nullable = false)
    private GymClass gymClass;

    @Column(name = "schedule_date", nullable = false)
    private LocalDate scheduleDate;

    @Column(name = "start_time", nullable = false)
    private LocalTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalTime endTime;

    @Column(name = "max_capacity", nullable = false)
    private int maxCapacity;

    @Column(name = "current_bookings", nullable = false)
    private int currentBookings;
}