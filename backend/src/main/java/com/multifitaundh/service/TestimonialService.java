package com.multifitaundh.service;

import com.multifitaundh.repository.TestimonialRepository;
import com.multifitaundh.model.Testimonial;
import com.multifitaundh.dto.TestimonialDto;
import com.multifitaundh.dto.CreateTestimonialRequest;
import com.multifitaundh.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class TestimonialService {

    private final TestimonialRepository testimonialRepository;

    @Autowired
    public TestimonialService(TestimonialRepository testimonialRepository) {
        this.testimonialRepository = testimonialRepository;
    }

    public List<TestimonialDto> getAllTestimonials() {
        return testimonialRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public TestimonialDto createTestimonial(CreateTestimonialRequest request) {
        if (request.getAuthorName() == null || request.getAuthorName().trim().isEmpty()) {
            throw new IllegalArgumentException("Author name cannot be null or empty.");
        }
        if (request.getQuote() == null || request.getQuote().trim().isEmpty()) {
            throw new IllegalArgumentException("Quote cannot be null or empty.");
        }
        if (request.getRating() == null || request.getRating() < 1 || request.getRating() > 5) {
            throw new IllegalArgumentException("Rating must be between 1 and 5.");
        }

        Testimonial testimonial = new Testimonial();
        testimonial.setAuthorName(request.getAuthorName());
        testimonial.setQuote(request.getQuote());
        testimonial.setRating(request.getRating());

        Testimonial savedTestimonial = testimonialRepository.save(testimonial);
        return convertToDto(savedTestimonial);
    }

    public void deleteTestimonial(UUID id) {
        if (!testimonialRepository.existsById(id)) {
            throw new ResourceNotFoundException("Testimonial with ID " + id + " not found.");
        }
        testimonialRepository.deleteById(id);
    }

    private TestimonialDto convertToDto(Testimonial testimonial) {
        return TestimonialDto.builder()
                .id(testimonial.getId())
                .authorName(testimonial.getAuthorName())
                .quote(testimonial.getQuote())
                .rating(testimonial.getRating())
                .build();
    }
}