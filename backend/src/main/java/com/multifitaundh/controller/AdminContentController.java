package com.multifitaundh.controller;

import com.multifitaundh.dto.TestimonialDto;
import com.multifitaundh.dto.TrainerDto;
import com.multifitaundh.service.ContentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin")
public class AdminContentController {

    private final ContentService contentService;

    @Autowired
    public AdminContentController(ContentService contentService) {
        this.contentService = contentService;
    }

    @PostMapping("/trainers")
    public ResponseEntity<TrainerDto> createTrainer(@Valid @RequestBody TrainerDto trainerDto) {
        TrainerDto createdTrainer = contentService.createTrainer(trainerDto);
        return new ResponseEntity<>(createdTrainer, HttpStatus.CREATED);
    }

    @PutMapping("/trainers/{id}")
    public ResponseEntity<TrainerDto> updateTrainer(@PathVariable UUID id, @Valid @RequestBody TrainerDto trainerDto) {
        TrainerDto updatedTrainer = contentService.updateTrainer(id, trainerDto);
        return ResponseEntity.ok(updatedTrainer);
    }

    @DeleteMapping("/trainers/{id}")
    public ResponseEntity<Void> deleteTrainer(@PathVariable UUID id) {
        contentService.deleteTrainer(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/testimonials")
    public ResponseEntity<TestimonialDto> createTestimonial(@Valid @RequestBody TestimonialDto testimonialDto) {
        TestimonialDto createdTestimonial = contentService.createTestimonial(testimonialDto);
        return new ResponseEntity<>(createdTestimonial, HttpStatus.CREATED);
    }

    @PutMapping("/testimonials/{id}")
    public ResponseEntity<TestimonialDto> updateTestimonial(@PathVariable UUID id, @Valid @RequestBody TestimonialDto testimonialDto) {
        TestimonialDto updatedTestimonial = contentService.updateTestimonial(id, testimonialDto);
        return ResponseEntity.ok(updatedTestimonial);
    }

    @DeleteMapping("/testimonials/{id}")
    public ResponseEntity<Void> deleteTestimonial(@PathVariable UUID id) {
        contentService.deleteTestimonial(id);
        return ResponseEntity.noContent().build();
    }
}