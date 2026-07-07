package com.multifitaundh.service;

import com.multifitaundh.repository.TrainerRepository;
import com.multifitaundh.repository.TestimonialRepository;
import com.multifitaundh.model.Trainer;
import com.multifitaundh.model.Testimonial;
import com.multifitaundh.dto.TrainerDto;
import com.multifitaundh.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ContentService {

    private final TrainerRepository trainerRepository;
    private final TestimonialRepository testimonialRepository;

    @Autowired
    public ContentService(TrainerRepository trainerRepository, TestimonialRepository testimonialRepository) {
        this.trainerRepository = trainerRepository;
        this.testimonialRepository = testimonialRepository;
    }

    public List<TrainerDto> getAllTrainers() {
        return trainerRepository.findAll().stream()
                .map(this::mapTrainerToDto)
                .collect(Collectors.toList());
    }

    public TrainerDto getTrainerById(UUID id) {
        Trainer trainer = trainerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Trainer not found with ID: " + id));
        return mapTrainerToDto(trainer);
    }

    public TrainerDto createTrainer(TrainerDto trainerDto) {
        Trainer trainer = new Trainer(
                UUID.randomUUID(),
                trainerDto.getName(),
                trainerDto.getSpecialization(),
                trainerDto.getBio(),
                trainerDto.getPhotoUrl()
        );
        Trainer savedTrainer = trainerRepository.save(trainer);
        return mapTrainerToDto(savedTrainer);
    }

    public TrainerDto updateTrainer(UUID id, TrainerDto trainerDto) {
        Trainer existingTrainer = trainerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Trainer not found with ID: " + id));

        existingTrainer.setName(trainerDto.getName());
        existingTrainer.setSpecialization(trainerDto.getSpecialization());
        existingTrainer.setBio(trainerDto.getBio());
        existingTrainer.setPhotoUrl(trainerDto.getPhotoUrl());

        Trainer updatedTrainer = trainerRepository.save(existingTrainer);
        return mapTrainerToDto(updatedTrainer);
    }

    public void deleteTrainer(UUID id) {
        if (!trainerRepository.existsById(id)) {
            throw new ResourceNotFoundException("Trainer not found with ID: " + id);
        }
        trainerRepository.deleteById(id);
    }

    public List<Testimonial> getAllTestimonials() {
        return testimonialRepository.findAll();
    }

    public Testimonial getTestimonialById(UUID id) {
        return testimonialRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Testimonial not found with ID: " + id));
    }

    public Testimonial createTestimonial(Testimonial testimonial) {
        testimonial.setId(UUID.randomUUID());
        return testimonialRepository.save(testimonial);
    }

    public Testimonial updateTestimonial(UUID id, Testimonial testimonial) {
        Testimonial existingTestimonial = testimonialRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Testimonial not found with ID: " + id));

        existingTestimonial.setAuthor(testimonial.getAuthor());
        existingTestimonial.setText(testimonial.getText());
        existingTestimonial.setRating(testimonial.getRating());
        // Ensure the ID from the path is used, not potentially one from the request body
        existingTestimonial.setId(id);

        return testimonialRepository.save(existingTestimonial);
    }

    public void deleteTestimonial(UUID id) {
        if (!testimonialRepository.existsById(id)) {
            throw new ResourceNotFoundException("Testimonial not found with ID: " + id);
        }
        testimonialRepository.deleteById(id);
    }

    private TrainerDto mapTrainerToDto(Trainer trainer) {
        return TrainerDto.builder()
                .id(trainer.getId())
                .name(trainer.getName())
                .specialization(trainer.getSpecialization())
                .bio(trainer.getBio())
                .photoUrl(trainer.getPhotoUrl())
                .build();
    }
}