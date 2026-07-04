package com.multifitaundh.service;

import com.multifitaundh.dto.CreateTrialLeadRequest;
import com.multifitaundh.dto.TestimonialDto;
import com.multifitaundh.dto.TrainerDto;
import com.multifitaundh.dto.TrialLeadDto;
import com.multifitaundh.model.Testimonial;
import com.multifitaundh.model.Trainer;
import com.multifitaundh.model.TrialLead;
import com.multifitaundh.repository.TestimonialRepository;
import com.multifitaundh.repository.TrainerRepository;
import com.multifitaundh.repository.TrialLeadRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ContentService {

    private final TrainerRepository trainerRepository;
    private final TestimonialRepository testimonialRepository;
    private final TrialLeadRepository trialLeadRepository;

    public ContentService(TrainerRepository trainerRepository, TestimonialRepository testimonialRepository, TrialLeadRepository trialLeadRepository) {
        this.trainerRepository = trainerRepository;
        this.testimonialRepository = testimonialRepository;
        this.trialLeadRepository = trialLeadRepository;
    }

    public List<TrainerDto> getAllTrainers() {
        return trainerRepository.findAll().stream()
                .map(this::mapToTrainerDto)
                .collect(Collectors.toList());
    }

    public TrainerDto getTrainerById(UUID id) {
        Trainer trainer = trainerRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Trainer not found with ID: " + id));
        return mapToTrainerDto(trainer);
    }

    public TrainerDto createTrainer(TrainerDto trainerDto) {
        Trainer trainer = new Trainer();
        trainer.setId(UUID.randomUUID());
        trainer.setName(trainerDto.getName());
        trainer.setSpecialization(trainerDto.getSpecialization());
        trainer.setBio(trainerDto.getBio());
        trainer.setImageUrl(trainerDto.getImageUrl());
        Trainer savedTrainer = trainerRepository.save(trainer);
        return mapToTrainerDto(savedTrainer);
    }

    public TrainerDto updateTrainer(UUID id, TrainerDto trainerDto) {
        Trainer trainer = trainerRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Trainer not found with ID: " + id));
        trainer.setName(trainerDto.getName());
        trainer.setSpecialization(trainerDto.getSpecialization());
        trainer.setBio(trainerDto.getBio());
        trainer.setImageUrl(trainerDto.getImageUrl());
        Trainer updatedTrainer = trainerRepository.save(trainer);
        return mapToTrainerDto(updatedTrainer);
    }

    public void deleteTrainer(UUID id) {
        if (!trainerRepository.existsById(id)) {
            throw new IllegalArgumentException("Trainer not found with ID: " + id);
        }
        trainerRepository.deleteById(id);
    }

    public List<TestimonialDto> getAllTestimonials() {
        return testimonialRepository.findAll().stream()
                .map(this::mapToTestimonialDto)
                .collect(Collectors.toList());
    }

    public TestimonialDto getTestimonialById(UUID id) {
        Testimonial testimonial = testimonialRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Testimonial not found with ID: " + id));
        return mapToTestimonialDto(testimonial);
    }

    public TestimonialDto createTestimonial(TestimonialDto testimonialDto) {
        Testimonial testimonial = new Testimonial();
        testimonial.setId(UUID.randomUUID());
        testimonial.setAuthorName(testimonialDto.getAuthorName());
        testimonial.setQuote(testimonialDto.getQuote());
        testimonial.setRating(testimonialDto.getRating());
        Testimonial savedTestimonial = testimonialRepository.save(testimonial);
        return mapToTestimonialDto(savedTestimonial);
    }

    public TestimonialDto updateTestimonial(UUID id, TestimonialDto testimonialDto) {
        Testimonial testimonial = testimonialRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Testimonial not found with ID: " + id));
        testimonial.setAuthorName(testimonialDto.getAuthorName());
        testimonial.setQuote(testimonialDto.getQuote());
        testimonial.setRating(testimonialDto.getRating());
        Testimonial updatedTestimonial = testimonialRepository.save(testimonial);
        return mapToTestimonialDto(updatedTestimonial);
    }

    public void deleteTestimonial(UUID id) {
        if (!testimonialRepository.existsById(id)) {
            throw new IllegalArgumentException("Testimonial not found with ID: " + id);
        }
        testimonialRepository.deleteById(id);
    }

    public TrialLeadDto createTrialLead(CreateTrialLeadRequest request) {
        TrialLead trialLead = new TrialLead();
        trialLead.setId(UUID.randomUUID());
        trialLead.setName(request.getName());
        trialLead.setEmail(request.getEmail());
        trialLead.setPhone(request.getPhone());
        trialLead.setSubmittedAt(LocalDateTime.now());
        TrialLead savedTrialLead = trialLeadRepository.save(trialLead);
        return mapToTrialLeadDto(savedTrialLead);
    }

    public List<TrialLeadDto> getAllTrialLeads() {
        return trialLeadRepository.findAll().stream()
                .map(this::mapToTrialLeadDto)
                .collect(Collectors.toList());
    }

    private TrainerDto mapToTrainerDto(Trainer trainer) {
        return TrainerDto.builder()
                .id(trainer.getId())
                .name(trainer.getName())
                .specialization(trainer.getSpecialization())
                .bio(trainer.getBio())
                .imageUrl(trainer.getImageUrl())
                .build();
    }

    private TestimonialDto mapToTestimonialDto(Testimonial testimonial) {
        return TestimonialDto.builder()
                .id(testimonial.getId())
                .authorName(testimonial.getAuthorName())
                .quote(testimonial.getQuote())
                .rating(testimonial.getRating())
                .build();
    }

    private TrialLeadDto mapToTrialLeadDto(TrialLead trialLead) {
        return TrialLeadDto.builder()
                .id(trialLead.getId())
                .name(trialLead.getName())
                .email(trialLead.getEmail())
                .phone(trialLead.getPhone())
                .submittedAt(trialLead.getSubmittedAt())
                .build();
    }
}