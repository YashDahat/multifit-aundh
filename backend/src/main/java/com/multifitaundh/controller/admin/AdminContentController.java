package com.multifitaundh.controller.admin;

import com.multifitaundh.service.ContentService;
import com.multifitaundh.dto.TrainerDto;
import com.multifitaundh.model.Testimonial;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import com.multifitaundh.model.Trainer;

@RestController
@RequestMapping("/api/v1/admin")
public class AdminContentController {

    private final ContentService contentService;

    @Autowired
    public AdminContentController(ContentService contentService) {
        this.contentService = contentService;
    }

    // Trainer Endpoints
    @GetMapping("/trainers")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<TrainerDto>> getAllTrainers() {
        List<TrainerDto> trainers = contentService.getAllTrainers();
        return ResponseEntity.ok(trainers);
    }

    @GetMapping("/trainers/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TrainerDto> getTrainerById(@PathVariable UUID id) {
        TrainerDto trainer = contentService.getTrainerById(id);
        return ResponseEntity.ok(trainer);
    }

    @PostMapping("/trainers")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TrainerDto> createTrainer(@RequestBody TrainerDto trainerDto) {
        TrainerDto createdTrainer = contentService.createTrainer(trainerDto);
        return new ResponseEntity<>(createdTrainer, HttpStatus.CREATED);
    }

    @PutMapping("/trainers/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TrainerDto> updateTrainer(@PathVariable UUID id, @RequestBody TrainerDto trainerDto) {
        TrainerDto updatedTrainer = contentService.updateTrainer(id, trainerDto);
        return ResponseEntity.ok(updatedTrainer);
    }

    @DeleteMapping("/trainers/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteTrainer(@PathVariable UUID id) {
        contentService.deleteTrainer(id);
        return ResponseEntity.noContent().build();
    }

    // Testimonial Endpoints
    @GetMapping("/testimonials")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Testimonial>> getAllTestimonials() {
        List<Testimonial> testimonials = contentService.getAllTestimonials();
        return ResponseEntity.ok(testimonials);
    }

    @GetMapping("/testimonials/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Testimonial> getTestimonialById(@PathVariable UUID id) {
        Testimonial testimonial = contentService.getTestimonialById(id);
        return ResponseEntity.ok(testimonial);
    }

    @PostMapping("/testimonials")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Testimonial> createTestimonial(@RequestBody Testimonial testimonial) {
        Testimonial createdTestimonial = contentService.createTestimonial(testimonial);
        return new ResponseEntity<>(createdTestimonial, HttpStatus.CREATED);
    }

    @PutMapping("/testimonials/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Testimonial> updateTestimonial(@PathVariable UUID id, @RequestBody Testimonial testimonial) {
        Testimonial updatedTestimonial = contentService.updateTestimonial(id, testimonial);
        return ResponseEntity.ok(updatedTestimonial);
    }

    @DeleteMapping("/testimonials/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteTestimonial(@PathVariable UUID id) {
        contentService.deleteTestimonial(id);
        return ResponseEntity.noContent().build();
    }
}