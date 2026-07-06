package com.multifitaundh.model;

import jakarta.persistence.*;
import java.util.UUID;

// Assuming Trainer is in the same model package or a closely related one
// as per the cross-feature contract, since no specific package for Trainer
// from 'content-backend' was provided.
import com.multifitaundh.model.Trainer;

@Entity
@Table(name = "gym_classes")
public class GymClass {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private int durationMinutes;

    @Column(nullable = false)
    private int maxCapacity;

    private String imageUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trainer_id", nullable = false)
    private Trainer trainer;
}