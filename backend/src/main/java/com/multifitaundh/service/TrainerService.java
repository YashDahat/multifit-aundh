package com.multifitaundh.service;

import com.multifitaundh.repository.TrainerRepository;
import com.multifitaundh.dto.TrainerDto;
import com.multifitaundh.dto.CreateTrainerRequest;
import com.multifitaundh.model.Trainer;
import com.multifitaundh.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
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
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public TrainerDto getTrainerById(UUID id) {
        Trainer trainer = trainerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Trainer not found with ID: " + id));
        return mapToDto(trainer);
    }

    public TrainerDto createTrainer(CreateTrainerRequest request) {
        Trainer trainer = new Trainer();
        trainer.setId(UUID.randomUUID()); // Set ID for new trainer
        trainer.setName(request.getName());
        trainer.setBio(request.getBio());
        trainer.setSpecializations(request.getSpecializations());
        trainer.setImageUrl(request.getImageUrl());
        Trainer savedTrainer = trainerRepository.save(trainer);
        return mapToDto(savedTrainer);
    }

    public TrainerDto updateTrainer(UUID id, CreateTrainerRequest request) {
        Trainer trainer = trainerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Trainer not found with ID: " + id));

        trainer.setName(request.getName());
        trainer.setBio(request.getBio());
        trainer.setSpecializations(request.getSpecializations());
        trainer.setImageUrl(request.getImageUrl());
        Trainer updatedTrainer = trainerRepository.save(trainer);
        return mapToDto(updatedTrainer);
    }

    public void deleteTrainer(UUID id) {
        if (!trainerRepository.existsById(id)) {
            throw new ResourceNotFoundException("Trainer not found with ID: " + id);
        }
        trainerRepository.deleteById(id);
    }

    private TrainerDto mapToDto(Trainer trainer) {
        return TrainerDto.builder()
                .id(trainer.getId())
                .name(trainer.getName())
                .bio(trainer.getBio())
                .specializations(trainer.getSpecializations())
                .imageUrl(trainer.getImageUrl())
                .build();
    }
}