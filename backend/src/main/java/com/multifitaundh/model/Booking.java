package com.multifitaundh.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.GenericGenerator;

import java.time.LocalDateTime;
import java.util.UUID;
import com.multifitaundh.model.ClassSchedule;

@Entity
@Table(name = "bookings")
@Getter
@Setter
public class Booking {
    @Id
    @GeneratedValue(generator = "uuid2")
    @GenericGenerator(name = "uuid2", strategy = "uuid2")
    @Column(name = "id", columnDefinition = "BINARY(16)")
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "class_schedule_id", nullable = false)
    private ClassSchedule classSchedule;

    @Column(name = "user_id", columnDefinition = "BINARY(16)", nullable = false)
    private UUID userId;

    @Column(name = "booking_date", nullable = false)
    private LocalDateTime bookingDate;
}