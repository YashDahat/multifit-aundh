package com.multifitaundh.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "testimonials")
public class Testimonial {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(nullable = false)
    private String authorName;

    @Column(nullable = false)
    private Integer rating; // 1-5

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(nullable = false)
    private LocalDate displayDate;

    public Testimonial() {
    }

    public Testimonial(UUID id, String authorName, Integer rating, String content, LocalDate displayDate) {
        this.id = id;
        this.authorName = authorName;
        this.rating = rating;
        this.content = content;
        this.displayDate = displayDate;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getAuthorName() {
        return authorName;
    }

    public void setAuthorName(String authorName) {
        this.authorName = authorName;
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public LocalDate getDisplayDate() {
        return displayDate;
    }

    public void setDisplayDate(LocalDate displayDate) {
        this.displayDate = displayDate;
    }
}