package com.multifitaundh.controller;

import com.multifitaundh.dto.TestimonialDto;
import com.multifitaundh.dto.TrainerDto;
import com.multifitaundh.service.ContentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;
import com.multifitaundh.model.Trainer;
import com.multifitaundh.model.Testimonial;

@RestController
@RequestMapping("/api/v1/admin/content")
@PreAuthorize("hasRole('ADMIN')")
public class AdminContentController {

    private final ContentService contentService;

    @Autowired
    public AdminContentController(ContentService contentService) {
        this.contentService = contentService;
    }

    // Trainer Management
    @PostMapping("/trainers")
    public ResponseEntity<TrainerDto> createTrainer(@Valid @RequestBody TrainerDto trainerDto) {
        TrainerDto createdTrainer = contentService.createTrainer(trainerDto);
        return new ResponseEntity<>(createdTrainer, HttpStatus.CREATED);
    }

    @PutMapping("/trainers/{id}")
    public ResponseEntity<TrainerDto> updateTrainer(@PathVariable UUID id, @Valid @RequestBody TrainerDto trainerDto) {
        TrainerDto updatedTrainer = contentService.updateTrainer(id, trainerDto);
        return new ResponseEntity<>(updatedTrainer, HttpStatus.OK);
    }

    @DeleteMapping("/trainers/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteTrainer(@PathVariable UUID id) {
        contentService.deleteTrainer(id);
    }

    // Testimonial Management
    @PostMapping("/testimonials")
    public ResponseEntity<TestimonialDto> createTestimonial(@Valid @RequestBody TestimonialDto testimonialDto) {
        TestimonialDto createdTestimonial = contentService.createTestimonial(testimonialDto);
        return new ResponseEntity<>(createdTestimonial, HttpStatus.CREATED);
    }

    @PutMapping("/testimonials/{id}")
    public ResponseEntity<TestimonialDto> updateTestimonial(@PathVariable UUID id, @Valid @RequestBody TestimonialDto testimonialDto) {
        TestimonialDto updatedTestimonial = contentService.updateTestimonial(id, testimonialDto);
        return new ResponseEntity<>(updatedTestimonial, HttpStatus.OK);
    }

    @DeleteMapping("/testimonials/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteTestimonial(@PathVariable UUID id) {
        contentService.deleteTestimonial(id);
    }
}