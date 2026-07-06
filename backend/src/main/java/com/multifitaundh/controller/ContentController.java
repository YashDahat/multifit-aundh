package com.multifitaundh.controller;

import com.multifitaundh.dto.TestimonialDto;
import com.multifitaundh.dto.TrainerDto;
import com.multifitaundh.service.ContentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/content")
public class ContentController {

    private final ContentService contentService;

    @Autowired
    public ContentController(ContentService contentService) {
        this.contentService = contentService;
    }

    @GetMapping("/trainers")
    public ResponseEntity<List<TrainerDto>> getAllTrainers() {
        List<TrainerDto> trainers = contentService.getAllTrainers();
        return ResponseEntity.ok(trainers);
    }

    @GetMapping("/trainers/{id}")
    public ResponseEntity<TrainerDto> getTrainerById(@PathVariable UUID id) {
        TrainerDto trainer = contentService.getTrainerById(id);
        return ResponseEntity.ok(trainer);
    }

    @GetMapping("/testimonials")
    public ResponseEntity<List<TestimonialDto>> getAllTestimonials() {
        List<TestimonialDto> testimonials = contentService.getAllTestimonials();
        return ResponseEntity.ok(testimonials);
    }

    @GetMapping("/testimonials/{id}")
    public ResponseEntity<TestimonialDto> getTestimonialById(@PathVariable UUID id) {
        TestimonialDto testimonial = contentService.getTestimonialById(id);
        return ResponseEntity.ok(testimonial);
    }
}