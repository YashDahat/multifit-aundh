package com.multifitaundh.service;

import com.multifitaundh.dto.ClassScheduleDto;
import com.multifitaundh.dto.GymClassDto;
import com.multifitaundh.exception.BookingConflictException;
import com.multifitaundh.exception.ResourceNotFoundException;
import com.multifitaundh.model.Booking;
import com.multifitaundh.model.ClassSchedule;
import com.multifitaundh.model.GymClass;
import com.multifitaundh.model.Trainer;
import com.multifitaundh.repository.BookingRepository;
import com.multifitaundh.repository.ClassScheduleRepository;
import com.multifitaundh.repository.GymClassRepository;
import com.multifitaundh.repository.TrainerRepository; // Assuming TrainerRepository exists for fetching Trainer by ID
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import com.multifitaundh.repository.TrainerRepository;
import com.multifitaundh.model.User;

@Service
public class SchedulingService {

    private final GymClassRepository gymClassRepository;
    private final ClassScheduleRepository classScheduleRepository;
    private final BookingRepository bookingRepository;
    private final TrainerRepository trainerRepository; // Added for fetching Trainer by ID

    @Autowired
    public SchedulingService(GymClassRepository gymClassRepository,
                             ClassScheduleRepository classScheduleRepository,
                             BookingRepository bookingRepository,
                             TrainerRepository trainerRepository) {
        this.gymClassRepository = gymClassRepository;
        this.classScheduleRepository = classScheduleRepository;
        this.bookingRepository = bookingRepository;
        this.trainerRepository = trainerRepository;
    }

    public List<GymClassDto> getAllGymClasses() {
        return gymClassRepository.findAll().stream()
                .map(this::mapToGymClassDto)
                .collect(Collectors.toList());
    }

    public GymClassDto getGymClassById(UUID classId) {
        GymClass gymClass = gymClassRepository.findById(classId)
                .orElseThrow(() -> new ResourceNotFoundException("GymClass not found with ID: " + classId));
        return mapToGymClassDto(gymClass);
    }

    public List<ClassScheduleDto> getScheduleForDate(LocalDate date) {
        return classScheduleRepository.findByScheduleDate(date).stream()
                .map(this::mapToClassScheduleDto)
                .collect(Collectors.toList());
    }

    public List<ClassScheduleDto> getScheduleForWeek(LocalDate startDate) {
        LocalDate endDate = startDate.plusDays(6); // 7 days from startDate (inclusive)
        return classScheduleRepository.findByScheduleDateBetween(startDate, endDate).stream()
                .map(this::mapToClassScheduleDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public BookingDto bookClass(UUID classScheduleId, UUID userId) {
        ClassSchedule classSchedule = classScheduleRepository.findById(classScheduleId)
                .orElseThrow(() -> new ResourceNotFoundException("ClassSchedule not found with ID: " + classScheduleId));

        if (classSchedule.getCurrentBookings() >= classSchedule.getMaxCapacity()) {
            throw new BookingConflictException("Class is full for schedule ID: " + classScheduleId);
        }

        if (bookingRepository.findByClassScheduleIdAndUserId(classScheduleId, userId).isPresent()) {
            throw new BookingConflictException("User already booked this class for schedule ID: " + classScheduleId);
        }

        Booking booking = new Booking();
        booking.setClassSchedule(classSchedule);
        booking.setUserId(userId);
        booking.setBookingDate(LocalDateTime.now());

        Booking savedBooking = bookingRepository.save(booking);

        classSchedule.setCurrentBookings(classSchedule.getCurrentBookings() + 1);
        classScheduleRepository.save(classSchedule);

        return mapToBookingDto(savedBooking);
    }

    @Transactional
    public void cancelBooking(UUID bookingId, UUID userId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + bookingId));

        if (!booking.getUserId().equals(userId)) {
            throw new ResourceNotFoundException("Booking not found for user with ID: " + bookingId);
        }

        ClassSchedule classSchedule = booking.getClassSchedule();
        bookingRepository.delete(booking);

        if (classSchedule.getCurrentBookings() > 0) {
            classSchedule.setCurrentBookings(classSchedule.getCurrentBookings() - 1);
            classScheduleRepository.save(classSchedule);
        }
    }

    public GymClassDto createGymClass(GymClassDto gymClassDto) {
        GymClass gymClass = mapToGymClass(gymClassDto);
        GymClass savedGymClass = gymClassRepository.save(gymClass);
        return mapToGymClassDto(savedGymClass);
    }

    public GymClassDto updateGymClass(UUID classId, GymClassDto gymClassDto) {
        GymClass existingGymClass = gymClassRepository.findById(classId)
                .orElseThrow(() -> new ResourceNotFoundException("GymClass not found with ID: " + classId));

        existingGymClass.setName(gymClassDto.getName());
        existingGymClass.setDescription(gymClassDto.getDescription());
        existingGymClass.setDurationMinutes(gymClassDto.getDurationMinutes());

        if (gymClassDto.getTrainerId() != null) {
            Trainer trainer = trainerRepository.findById(gymClassDto.getTrainerId())
                    .orElseThrow(() -> new ResourceNotFoundException("Trainer not found with ID: " + gymClassDto.getTrainerId()));
            existingGymClass.setTrainer(trainer);
        }

        GymClass updatedGymClass = gymClassRepository.save(existingGymClass);
        return mapToGymClassDto(updatedGymClass);
    }

    public void deleteGymClass(UUID classId) {
        gymClassRepository.deleteById(classId);
    }

    public ClassScheduleDto createClassSchedule(ClassScheduleDto classScheduleDto) {
        GymClass gymClass = gymClassRepository.findById(classScheduleDto.getGymClassId())
                .orElseThrow(() -> new ResourceNotFoundException("GymClass not found with ID: " + classScheduleDto.getGymClassId()));

        ClassSchedule classSchedule = mapToClassSchedule(classScheduleDto, gymClass);
        classSchedule.setCurrentBookings(0); // New schedule starts with 0 bookings
        ClassSchedule savedClassSchedule = classScheduleRepository.save(classSchedule);
        return mapToClassScheduleDto(savedClassSchedule);
    }

    public ClassScheduleDto updateClassSchedule(UUID scheduleId, ClassScheduleDto classScheduleDto) {
        ClassSchedule existingClassSchedule = classScheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new ResourceNotFoundException("ClassSchedule not found with ID: " + scheduleId));

        GymClass gymClass = gymClassRepository.findById(classScheduleDto.getGymClassId())
                .orElseThrow(() -> new ResourceNotFoundException("GymClass not found with ID: " + classScheduleDto.getGymClassId()));

        existingClassSchedule.setGymClass(gymClass);
        existingClassSchedule.setScheduleDate(classScheduleDto.getScheduleDate());
        existingClassSchedule.setStartTime(classScheduleDto.getStartTime());
        existingClassSchedule.setEndTime(classScheduleDto.getEndTime());
        existingClassSchedule.setMaxCapacity(classScheduleDto.getMaxCapacity());
        // currentBookings should not be updated directly via DTO in this method, it's managed by booking/cancellation

        ClassSchedule updatedClassSchedule = classScheduleRepository.save(existingClassSchedule);
        return mapToClassScheduleDto(updatedClassSchedule);
    }

    public void deleteClassSchedule(UUID scheduleId) {
        classScheduleRepository.deleteById(scheduleId);
    }

    private GymClassDto mapToGymClassDto(GymClass gymClass) {
        return GymClassDto.builder()
                .id(gymClass.getId())
                .name(gymClass.getName())
                .description(gymClass.getDescription())
                .durationMinutes(gymClass.getDurationMinutes())
                .trainerId(gymClass.getTrainer() != null ? gymClass.getTrainer().getId() : null)
                .trainerName(gymClass.getTrainer() != null ? gymClass.getTrainer().getName() : null)
                .build();
    }

    private GymClass mapToGymClass(GymClassDto gymClassDto) {
        GymClass gymClass = new GymClass();
        gymClass.setId(gymClassDto.getId()); // ID might be null for creation
        gymClass.setName(gymClassDto.getName());
        gymClass.setDescription(gymClassDto.getDescription());
        gymClass.setDurationMinutes(gymClassDto.getDurationMinutes());
        if (gymClassDto.getTrainerId() != null) {
            Trainer trainer = trainerRepository.findById(gymClassDto.getTrainerId())
                    .orElseThrow(() -> new ResourceNotFoundException("Trainer not found with ID: " + gymClassDto.getTrainerId()));
            gymClass.setTrainer(trainer);
        }
        return gymClass;
    }

    private ClassScheduleDto mapToClassScheduleDto(ClassSchedule classSchedule) {
        return ClassScheduleDto.builder()
                .id(classSchedule.getId())
                .gymClassId(classSchedule.getGymClass().getId())
                .gymClassName(classSchedule.getGymClass().getName())
                .trainerName(classSchedule.getGymClass().getTrainer() != null ? classSchedule.getGymClass().getTrainer().getName() : null)
                .scheduleDate(classSchedule.getScheduleDate())
                .startTime(classSchedule.getStartTime())
                .endTime(classSchedule.getEndTime())
                .maxCapacity(classSchedule.getMaxCapacity())
                .currentBookings(classSchedule.getCurrentBookings())
                .build();
    }

    private ClassSchedule mapToClassSchedule(ClassScheduleDto classScheduleDto, GymClass gymClass) {
        ClassSchedule classSchedule = new ClassSchedule();
        classSchedule.setId(classScheduleDto.getId()); // ID might be null for creation
        classSchedule.setGymClass(gymClass);
        classSchedule.setScheduleDate(classScheduleDto.getScheduleDate());
        classSchedule.setStartTime(classScheduleDto.getStartTime());
        classSchedule.setEndTime(classScheduleDto.getEndTime());
        classSchedule.setMaxCapacity(classScheduleDto.getMaxCapacity());
        classSchedule.setCurrentBookings(classScheduleDto.getCurrentBookings() != null ? classScheduleDto.getCurrentBookings() : 0);
        return classSchedule;
    }

    private BookingDto mapToBookingDto(Booking booking) {
        return BookingDto.builder()
                .id(booking.getId())
                .classScheduleId(booking.getClassSchedule().getId())
                .userId(booking.getUserId())
                .bookingDate(booking.getBookingDate())
                .build();
    }
}