package com.multifitaundh.service;

import com.multifitaundh.repository.TrainerRepository;
import com.multifitaundh.model.Trainer;
import com.multifitaundh.dto.TrainerDto;
import com.multifitaundh.dto.CreateTrainerRequest;
import com.multifitaundh.dto.UpdateTrainerRequest;
import com.multifitaundh.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class TrainerService {

    private final TrainerRepository trainerRepository;

    @Autowired
    public TrainerService(TrainerRepository trainerRepository) {
        this.trainerRepository = trainerRepository;
    }

    public List<TrainerDto> getAllTrainers() {
        return trainerRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public TrainerDto createTrainer(CreateTrainerRequest request) {
        String baseSlug = request.getName().toLowerCase().replace(" ", "-");
        String uniqueSlug = baseSlug;
        int suffix = 0;

        while (trainerRepository.findBySlug(uniqueSlug).isPresent()) {
            suffix++;
            uniqueSlug = baseSlug + "-" + suffix;
        }

        Trainer trainer = new Trainer();
        trainer.setName(request.getName());
        trainer.setSpecializations(request.getSpecializations());
        trainer.setBio(request.getBio());
        trainer.setImageUrl(request.getImageUrl());
        trainer.setSlug(uniqueSlug);

        Trainer savedTrainer = trainerRepository.save(trainer);
        return toDto(savedTrainer);
    }

    public TrainerDto updateTrainer(UUID id, UpdateTrainerRequest request) {
        Trainer trainer = trainerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Trainer not found with ID: " + id));

        trainer.setName(request.getName());
        trainer.setSpecializations(request.getSpecializations());
        trainer.setBio(request.getBio());
        trainer.setImageUrl(request.getImageUrl());

        Trainer updatedTrainer = trainerRepository.save(trainer);
        return toDto(updatedTrainer);
    }

    public void deleteTrainer(UUID id) {
        if (!trainerRepository.existsById(id)) {
            throw new ResourceNotFoundException("Trainer not found with ID: " + id);
        }
        trainerRepository.deleteById(id);
    }

    private TrainerDto toDto(Trainer trainer) {
        return TrainerDto.builder()
                .id(trainer.getId())
                .name(trainer.getName())
                .specializations(trainer.getSpecializations())
                .bio(trainer.getBio())
                .imageUrl(trainer.getImageUrl())
                .slug(trainer.getSlug())
                .build();
    }
}