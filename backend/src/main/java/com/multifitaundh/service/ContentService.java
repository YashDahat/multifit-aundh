package com.multifitaundh.service;

import com.multifitaundh.dto.TestimonialDto;
import com.multifitaundh.dto.TrainerDto;
import com.multifitaundh.exception.ResourceNotFoundException;
import com.multifitaundh.model.Testimonial;
import com.multifitaundh.model.Trainer;
import com.multifitaundh.repository.TestimonialRepository;
import com.multifitaundh.repository.TrainerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
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

    // Trainer methods
    public List<TrainerDto> getAllTrainers() {
        return trainerRepository.findAll().stream()
                .map(this::convertToTrainerDto)
                .collect(Collectors.toList());
    }

    public TrainerDto getTrainerById(UUID id) {
        Trainer trainer = trainerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Trainer not found with ID: " + id));
        return convertToTrainerDto(trainer);
    }

    public TrainerDto createTrainer(TrainerDto trainerDto) {
        Trainer trainer = convertToTrainerEntity(trainerDto);
        Trainer savedTrainer = trainerRepository.save(trainer);
        return convertToTrainerDto(savedTrainer);
    }

    public TrainerDto updateTrainer(UUID id, TrainerDto trainerDto) {
        Trainer existingTrainer = trainerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Trainer not found with ID: " + id));

        // Assuming Trainer entity has setters for these fields
        existingTrainer.setName(trainerDto.getName());
        existingTrainer.setSpecializations(trainerDto.getSpecializations());
        existingTrainer.setBio(trainerDto.getBio());
        existingTrainer.setImageUrl(trainerDto.getImageUrl());

        Trainer updatedTrainer = trainerRepository.save(existingTrainer);
        return convertToTrainerDto(updatedTrainer);
    }

    public void deleteTrainer(UUID id) {
        if (!trainerRepository.existsById(id)) {
            throw new ResourceNotFoundException("Trainer not found with ID: " + id);
        }
        trainerRepository.deleteById(id);
    }

    // Testimonial methods
    public List<TestimonialDto> getAllTestimonials() {
        return testimonialRepository.findAll().stream()
                .map(this::convertToTestimonialDto)
                .collect(Collectors.toList());
    }

    public TestimonialDto getTestimonialById(UUID id) {
        Testimonial testimonial = testimonialRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Testimonial not found with ID: " + id));
        return convertToTestimonialDto(testimonial);
    }

    public TestimonialDto createTestimonial(TestimonialDto testimonialDto) {
        Testimonial testimonial = convertToTestimonialEntity(testimonialDto);
        Testimonial savedTestimonial = testimonialRepository.save(testimonial);
        return convertToTestimonialDto(savedTestimonial);
    }

    public TestimonialDto updateTestimonial(UUID id, TestimonialDto testimonialDto) {
        Testimonial existingTestimonial = testimonialRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Testimonial not found with ID: " + id));

        existingTestimonial.setAuthor(testimonialDto.getAuthor());
        existingTestimonial.setQuote(testimonialDto.getQuote());
        existingTestimonial.setRating(testimonialDto.getRating());

        Testimonial updatedTestimonial = testimonialRepository.save(existingTestimonial);
        return convertToTestimonialDto(updatedTestimonial);
    }

    public void deleteTestimonial(UUID id) {
        if (!testimonialRepository.existsById(id)) {
            throw new ResourceNotFoundException("Testimonial not found with ID: " + id);
        }
        testimonialRepository.deleteById(id);
    }

    // Helper methods for DTO to Entity conversion
    private TrainerDto convertToTrainerDto(Trainer trainer) {
        // Assuming Trainer entity has getters for these fields
        return TrainerDto.builder()
                .id(trainer.getId())
                .name(trainer.getName())
                .specializations(trainer.getSpecializations())
                .bio(trainer.getBio())
                .imageUrl(trainer.getImageUrl())
                .build();
    }

    private Trainer convertToTrainerEntity(TrainerDto trainerDto) {
        Trainer trainer = new Trainer();
        // Assuming Trainer entity has setters for these fields
        trainer.setName(trainerDto.getName());
        trainer.setSpecializations(trainerDto.getSpecializations());
        trainer.setBio(trainerDto.getBio());
        trainer.setImageUrl(trainerDto.getImageUrl());
        // ID is generated by DB, no need to set for new entity
        return trainer;
    }

    private TestimonialDto convertToTestimonialDto(Testimonial testimonial) {
        return TestimonialDto.builder()
                .id(testimonial.getId())
                .author(testimonial.getAuthor())
                .quote(testimonial.getQuote())
                .rating(testimonial.getRating())
                .build();
    }

    private Testimonial convertToTestimonialEntity(TestimonialDto testimonialDto) {
        // Testimonial entity has a constructor for author, quote, rating
        Testimonial testimonial = new Testimonial(
                testimonialDto.getAuthor(),
                testimonialDto.getQuote(),
                testimonialDto.getRating()
        );
        // ID is generated by DB, no need to set for new entity
        return testimonial;
    }
}