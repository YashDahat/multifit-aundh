package com.multifitaundh.controller;

import com.multifitaundh.dto.TestimonialDto;
import com.multifitaundh.dto.TrainerDto;
import com.multifitaundh.dto.TrialLeadDto;
import com.multifitaundh.service.ContentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
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

    @GetMapping("/testimonials")
    public ResponseEntity<List<TestimonialDto>> getAllTestimonials() {
        List<TestimonialDto> testimonials = contentService.getAllTestimonials();
        return ResponseEntity.ok(testimonials);
    }

    @PostMapping("/trial-leads")
    public ResponseEntity<TrialLeadDto> submitTrialLead(@Valid @RequestBody TrialLeadDto trialLeadDto) {
        TrialLeadDto createdLead = contentService.createTrialLead(trialLeadDto);
        return new ResponseEntity<>(createdLead, HttpStatus.CREATED);
    }
}