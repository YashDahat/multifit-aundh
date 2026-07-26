package com.multifitaundh.model;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "trainers")
public class Trainer {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String specialization;

    @Column(length = 1000)
    private String bio;

    private String imageUrl;

    public Trainer() {
    }

    public Trainer(UUID id, String name, String specialization, String bio, String imageUrl) {
        this.id = id;
        this.name = name;
        this.specialization = specialization;
        this.bio = bio;
        this.imageUrl = imageUrl;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSpecialization() {
        return specialization;
    }

    public void setSpecialization(String specialization) {
        this.specialization = specialization;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
}