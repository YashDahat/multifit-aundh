package com.multifitaundh.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.util.UUID;

@Entity
@Table(name = "testimonials")
public class Testimonial {

    @Id
    private UUID id;

    @Column(nullable = false)
    private String author;

    @Column(nullable = false, length = 1000)
    private String text;

    @Column(nullable = false)
    private int rating;

    public Testimonial() {
        // Default constructor for JPA
    }

    public Testimonial(UUID id, String author, String text, int rating) {
        this.id = id;
        this.author = author;
        this.text = text;
        this.rating = rating;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public int getRating() {
        return rating;
    }

    public void setRating(int rating) {
        this.rating = rating;
    }
}