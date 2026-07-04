package com.multifitaundh.controller;

import com.multifitaundh.service.TrainerService;
import com.multifitaundh.dto.TrainerDto;
import com.multifitaundh.dto.CreateTrainerRequest;
import com.multifitaundh.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin/trainers")
public class AdminTrainerController {

    private final TrainerService trainerService;

    @Autowired
    public AdminTrainerController(TrainerService trainerService) {
        this.trainerService = trainerService;
    }

    @PostMapping
    public ResponseEntity<TrainerDto> createTrainer(@Valid @RequestBody CreateTrainerRequest request) {
        TrainerDto createdTrainer = trainerService.createTrainer(request);
        return new ResponseEntity<>(createdTrainer, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TrainerDto> updateTrainer(@PathVariable UUID id, @Valid @RequestBody CreateTrainerRequest request) {
        try {
            TrainerDto updatedTrainer = trainerService.updateTrainer(id, request);
            return new ResponseEntity<>(updatedTrainer, HttpStatus.OK);
        } catch (ResourceNotFoundException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTrainer(@PathVariable UUID id) {
        try {
            trainerService.deleteTrainer(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (ResourceNotFoundException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}