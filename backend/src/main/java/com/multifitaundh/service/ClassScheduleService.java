package com.multifitaundh.service;

import com.multifitaundh.dto.GymClassDto;
import com.multifitaundh.exception.ResourceNotFoundException;
import com.multifitaundh.model.ClassBooking;
import com.multifitaundh.model.GymClass;
import com.multifitaundh.model.Trainer;
import com.multifitaundh.model.User;
import com.multifitaundh.repository.ClassBookingRepository;
import com.multifitaundh.repository.GymClassRepository;
import com.multifitaundh.repository.TrainerRepository;
import com.multifitaundh.repository.UserRepository;
import com.multifitaundh.dto.ClassBookingDto;
import com.multifitaundh.dto.CreateGymClassRequest;
import com.multifitaundh.dto.UpdateGymClassRequest;
import com.multifitaundh.service.MembershipService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ClassScheduleService {

    private final GymClassRepository gymClassRepository;
    private final ClassBookingRepository classBookingRepository;
    private final UserRepository userRepository;
    private final TrainerRepository trainerRepository;
    private final MembershipService membershipService;

    @Autowired
    public ClassScheduleService(GymClassRepository gymClassRepository,
                                ClassBookingRepository classBookingRepository,
                                UserRepository userRepository,
                                TrainerRepository trainerRepository,
                                MembershipService membershipService) {
        this.gymClassRepository = gymClassRepository;
        this.classBookingRepository = classBookingRepository;
        this.userRepository = userRepository;
        this.trainerRepository = trainerRepository;
        this.membershipService = membershipService;
    }

    public List<GymClassDto> getGymClassesByDate(LocalDate date) {
        List<GymClass> gymClasses = gymClassRepository.findByDate(date);
        return gymClasses.stream()
                .map(this::convertToGymClassDto)
                .collect(Collectors.toList());
    }

    public List<GymClassDto> getWeeklySchedule(LocalDate startDate, LocalDate endDate) {
        List<GymClass> gymClasses = gymClassRepository.findByDateBetween(startDate, endDate);
        return gymClasses.stream()
                .map(this::convertToGymClassDto)
                .collect(Collectors.toList());
    }

    public GymClassDto getGymClassById(UUID classId) {
        GymClass gymClass = gymClassRepository.findById(classId)
                .orElseThrow(() -> new ResourceNotFoundException("GymClass not found with ID: " + classId));
        return convertToGymClassDto(gymClass);
    }

    public ClassBookingDto bookClass(Long userId, UUID classId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));
        GymClass gymClass = gymClassRepository.findById(classId)
                .orElseThrow(() -> new ResourceNotFoundException("GymClass not found with ID: " + classId));

        if (membershipService.getUserActiveMembership(userId).isEmpty()) {
            throw new IllegalStateException("User does not have an active membership.");
        }

        if (gymClass.getCurrentBookings() >= gymClass.getCapacity()) {
            throw new IllegalStateException("Class is full.");
        }

        Optional<ClassBooking> existingBooking = classBookingRepository.findByUser_IdAndGymClass_Id(userId, classId);
        if (existingBooking.isPresent() && existingBooking.get().getStatus() == ClassBooking.BookingStatus.CONFIRMED) {
            throw new IllegalStateException("User already booked this class.");
        }

        ClassBooking newBooking = new ClassBooking();
        newBooking.setUser(user);
        newBooking.setGymClass(gymClass);
        newBooking.setBookingTime(LocalDateTime.now());
        newBooking.setStatus(ClassBooking.BookingStatus.CONFIRMED);

        ClassBooking savedBooking = classBookingRepository.save(newBooking);

        gymClass.setCurrentBookings(gymClass.getCurrentBookings() + 1);
        gymClassRepository.save(gymClass);

        return convertToClassBookingDto(savedBooking);
    }

    public void cancelBooking(Long userId, UUID bookingId) {
        ClassBooking booking = classBookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("ClassBooking not found with ID: " + bookingId));

        if (!booking.getUser().getId().equals(userId)) {
            throw new AccessDeniedException("User not authorized to cancel this booking.");
        }

        if (booking.getStatus() == ClassBooking.BookingStatus.CANCELLED) {
            return;
        }

        booking.setStatus(ClassBooking.BookingStatus.CANCELLED);
        classBookingRepository.save(booking);

        GymClass gymClass = booking.getGymClass();
        if (gymClass.getCurrentBookings() > 0) {
            gymClass.setCurrentBookings(gymClass.getCurrentBookings() - 1);
            gymClassRepository.save(gymClass);
        }
    }

    public List<ClassBookingDto> getUserBookings(Long userId) {
        List<ClassBooking> bookings = classBookingRepository.findByUser_Id(userId);
        return bookings.stream()
                .map(this::convertToClassBookingDto)
                .collect(Collectors.toList());
    }

    public GymClassDto createGymClass(CreateGymClassRequest request) {
        Trainer trainer = trainerRepository.findById(request.getTrainerId())
                .orElseThrow(() -> new ResourceNotFoundException("Trainer not found with ID: " + request.getTrainerId()));

        GymClass gymClass = new GymClass();
        gymClass.setName(request.getName());
        gymClass.setDescription(request.getDescription());
        gymClass.setDate(request.getDate());
        gymClass.setStartTime(request.getStartTime());
        gymClass.setEndTime(request.getEndTime());
        gymClass.setCapacity(request.getCapacity());
        gymClass.setCurrentBookings(0);
        gymClass.setTrainer(trainer);

        GymClass savedGymClass = gymClassRepository.save(gymClass);
        return convertToGymClassDto(savedGymClass);
    }

    public GymClassDto updateGymClass(UUID classId, UpdateGymClassRequest request) {
        GymClass gymClass = gymClassRepository.findById(classId)
                .orElseThrow(() -> new ResourceNotFoundException("GymClass not found with ID: " + classId));

        Optional.ofNullable(request.getName()).ifPresent(gymClass::setName);
        Optional.ofNullable(request.getDescription()).ifPresent(gymClass::setDescription);
        Optional.ofNullable(request.getDate()).ifPresent(gymClass::setDate);
        Optional.ofNullable(request.getStartTime()).ifPresent(gymClass::setStartTime);
        Optional.ofNullable(request.getEndTime()).ifPresent(gymClass::setEndTime);
        Optional.ofNullable(request.getCapacity()).ifPresent(gymClass::setCapacity);

        if (request.getTrainerId() != null && (gymClass.getTrainer() == null || !request.getTrainerId().equals(gymClass.getTrainer().getId()))) {
            Trainer newTrainer = trainerRepository.findById(request.getTrainerId())
                    .orElseThrow(() -> new ResourceNotFoundException("Trainer not found with ID: " + request.getTrainerId()));
            gymClass.setTrainer(newTrainer);
        }

        GymClass updatedGymClass = gymClassRepository.save(gymClass);
        return convertToGymClassDto(updatedGymClass);
    }

    public void deleteGymClass(UUID classId) {
        if (!gymClassRepository.existsById(classId)) {
            throw new ResourceNotFoundException("GymClass not found with ID: " + classId);
        }
        gymClassRepository.deleteById(classId);
    }

    private GymClassDto convertToGymClassDto(GymClass gymClass) {
        return GymClassDto.builder()
                .id(gymClass.getId())
                .name(gymClass.getName())
                .description(gymClass.getDescription())
                .date(gymClass.getDate())
                .startTime(gymClass.getStartTime())
                .endTime(gymClass.getEndTime())
                .capacity(gymClass.getCapacity())
                .currentBookings(gymClass.getCurrentBookings())
                .trainerId(gymClass.getTrainer() != null ? gymClass.getTrainer().getId() : null)
                .trainerName(gymClass.getTrainer() != null ? gymClass.getTrainer().getName() : null)
                .build();
    }

    private ClassBookingDto convertToClassBookingDto(ClassBooking classBooking) {
        // Assuming ClassBookingDto has fields: id, userId, gymClassId, bookingTime, status, gymClassName, gymClassDate, gymClassStartTime
        return ClassBookingDto.builder()
                .id(classBooking.getId())
                .userId(classBooking.getUser().getId())
                .gymClassId(classBooking.getGymClass().getId())
                .bookingTime(classBooking.getBookingTime())
                .status(classBooking.getStatus())
                .gymClassName(classBooking.getGymClass().getName())
                .gymClassDate(classBooking.getGymClass().getDate())
                .gymClassStartTime(classBooking.getGymClass().getStartTime())
                .build();
    }
}