package com.multifitaundh.controller;

import com.multifitaundh.dto.TestimonialDto;
import com.multifitaundh.dto.TrainerDto;
import com.multifitaundh.dto.TrialLeadDto;
import com.multifitaundh.service.ContentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin")
public class AdminContentController {

    private final ContentService contentService;

    public AdminContentController(ContentService contentService) {
        this.contentService = contentService;
    }

    @GetMapping("/trainers")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<TrainerDto>> getAllTrainers() {
        List<TrainerDto> trainers = contentService.getAllTrainers();
        return new ResponseEntity<>(trainers, HttpStatus.OK);
    }

    @PostMapping("/trainers")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TrainerDto> createTrainer(@Valid @RequestBody TrainerDto trainerDto) {
        TrainerDto createdTrainer = contentService.createTrainer(trainerDto);
        return new ResponseEntity<>(createdTrainer, HttpStatus.CREATED);
    }

    @PutMapping("/trainers/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TrainerDto> updateTrainer(@PathVariable UUID id, @Valid @RequestBody TrainerDto trainerDto) {
        try {
            TrainerDto updatedTrainer = contentService.updateTrainer(id, trainerDto);
            return new ResponseEntity<>(updatedTrainer, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @DeleteMapping("/trainers/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteTrainer(@PathVariable UUID id) {
        try {
            contentService.deleteTrainer(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/testimonials")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<TestimonialDto>> getAllTestimonials() {
        List<TestimonialDto> testimonials = contentService.getAllTestimonials();
        return new ResponseEntity<>(testimonials, HttpStatus.OK);
    }

    @PostMapping("/testimonials")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TestimonialDto> createTestimonial(@Valid @RequestBody TestimonialDto testimonialDto) {
        TestimonialDto createdTestimonial = contentService.createTestimonial(testimonialDto);
        return new ResponseEntity<>(createdTestimonial, HttpStatus.CREATED);
    }

    @PutMapping("/testimonials/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TestimonialDto> updateTestimonial(@PathVariable UUID id, @Valid @RequestBody TestimonialDto testimonialDto) {
        try {
            TestimonialDto updatedTestimonial = contentService.updateTestimonial(id, testimonialDto);
            return new ResponseEntity<>(updatedTestimonial, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @DeleteMapping("/testimonials/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteTestimonial(@PathVariable UUID id) {
        try {
            contentService.deleteTestimonial(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/leads/trial")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<TrialLeadDto>> getAllTrialLeads() {
        List<TrialLeadDto> trialLeads = contentService.getAllTrialLeads();
        return new ResponseEntity<>(trialLeads, HttpStatus.OK);
    }
}